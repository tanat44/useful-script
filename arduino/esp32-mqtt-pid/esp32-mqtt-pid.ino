/*
  SimpleMQTTClient.ino
  The purpose of this exemple is to illustrate a simple handling of MQTT and Wifi connection.
  Once it connects successfully to a Wifi network and a MQTT broker, it subscribe to a topic and send a message to it.
  It will also send a message delayed 5 seconds later.
*/

#include "EspMQTTClient.h"
#include "AS5600.h"

// global
uint32_t deltaTime = 0;
enum MotorMode { PWM,
                 POS,
                 COM }; // complicance control (stiffness control)
uint32_t midLoopTime;
uint32_t slowLoopTime;

// mqtt
const char *wifi = "Ziggo41AA8C624";
const char *wifiPass = "Jj12345678";
const char *serverIp = "192.168.178.53";
const char *serverUser = "hello";
const char *serverPass = "test";
const char *nodeName = "myesp";
EspMQTTClient client(
  wifi,
  wifiPass,
  serverIp,
  serverUser,
  serverPass,
  nodeName,
  1883);
const uint8_t ledPin = 21;

// sensor1
AS5600 encoder1;
const uint8_t encoder1Pin1 = 7;
const uint8_t encoder1Pin2 = 8;
uint32_t encoder1Raw = 0;
int32_t encoder1Vel = 0;

// motor
const int freq = 5000;
const int resolution = 8;
const int motorPin1 = 10;
const int motorPin2 = 9;
MotorMode motorMode = MotorMode::POS;
int16_t motorCommand = 0;
float kp = 0.08f;   // history kp 0.1, kd -100
float kd = 2000.0f;
float ki = 0.0f;
float stiffness = 0.01f;
uint8_t minPwm = 140;
const uint8_t frictionOvercomePwm = 170;
int16_t lastPwm = 0;
int16_t lastDelta = 0;
int16_t error = 0;
int16_t motorPosition = 0;

void setup() {
  Serial.println("started");
  Serial.begin(115200);

  // motor
  ledcAttach(motorPin1, freq, resolution);
  ledcAttach(motorPin2, freq, resolution);

  // sensor1
  Wire.begin(encoder1Pin1, encoder1Pin2);    // pin7 for sensor sda, pin8 for sensor scl
  encoder1.begin(4);                         //  set direction pin.
  encoder1.setDirection(AS5600_CLOCK_WISE);  //  default, just be explicit.

  // mqtt
  // client.enableDebuggingMessages();                    // Enable debugging messages sent to serial output
  client.enableHTTPWebUpdater();                       // Enable the web updater. User and password default to values of MQTTUsername and MQTTPassword. These can be overridded with enableHTTPWebUpdater("user", "password").
  client.enableOTA();                                  // Enable OTA (Over The Air) updates. Password defaults to MQTTPassword. Port is the default OTA port. Can be overridden with enableOTA("password", port).
  client.enableLastWillMessage("node/bye", nodeName);  // You can activate the retain flag by setting the third parameter to true

  rgbLedWrite(ledPin, 255, 0, 0);   // red light when disconnect
}

void sendInfo(const String &message) {
  client.publish(String(nodeName) + "/info", message);
}

void sendError(const String &message) {
  client.publish(String(nodeName) + "/error", message);
}

void setMotorPwm(int16_t pwm) {
  if (pwm > 255) {
    pwm = 255;
  }
  if (pwm < -255) {
    pwm = -255;
  }
  if (lastPwm == pwm)
    return;

  // friction compensation (introduce pwm spike) when start from v = 0 && there's pwm command
  if (pwm != 0) {
    if (abs(encoder1Vel) < 10) {
      if (pwm > 0) {
        pwm = frictionOvercomePwm;
      } else {
        pwm = -frictionOvercomePwm;
      }
    }
  }

  // rescale pwm from MIN to 255
  uint8_t command = map(abs(pwm), 0, 255, minPwm, 255);

  sendInfo("Update pwm: " + String(pwm) + ", command: " + String(command));
  if (pwm == 0) {
    ledcWrite(motorPin1, 0);
    ledcWrite(motorPin2, 0);
  } else if (pwm > 0) {
    ledcWrite(motorPin1, command);
    ledcWrite(motorPin2, 0);
  } else {
    ledcWrite(motorPin1, 0);
    ledcWrite(motorPin2, command);
  }
  lastPwm = pwm;
}

void setMotorPos(int16_t position) {
  int32_t d = position - encoder1Raw;
  int32_t d2 = d - lastDelta;
  error += d;
  setMotorPwm(kp * (float)d + kd * (float)d2 + ki * error);
  lastDelta = d;
}

void setMotorVel(int16_t vel) {
  int32_t delta = vel - encoder1Raw;
  if (delta > 0)
    setMotorPwm(255);
  else
    setMotorPwm(-255);
}

void setMotorCompliance() {
  int16_t d = abs( (int16_t) encoder1Raw - motorPosition);
  kp = (double) d * (double) stiffness / 1000.0d;
  kd = 0.0f;
  setMotorPos(motorPosition);
  sendInfo("complicance new kp = " + String(kp));
}

// This function is called once everything is connected (Wifi and MQTT)
void onConnectionEstablished() {

  // motor control
  String motorTopic = String(nodeName) + "/motor/1/#";
  client.subscribe(motorTopic, [](const String &topic, const String &payload) {
    int16_t value = payload.toInt();
    sendInfo("received: " + topic + " >> " + String(value));
    if (topic.indexOf("pwm") > -1) {
      if (topic.indexOf("min") > -1) {
        minPwm = payload.toInt();
        return;
      }
      if (value < -255 || value > 255) {
        sendError(topic + ": input out of range");
        return;
      }
      motorMode = MotorMode::PWM;
      motorCommand = value;
    } else if (topic.indexOf("pos") > -1) {
      if (topic.indexOf("kp") > -1) {
        kp = payload.toFloat();
      } else if (topic.indexOf("ki") > -1) {
        ki = payload.toFloat();
      } else if (topic.indexOf("kd") > -1) {
        kd = payload.toFloat();
      } else if (topic.indexOf("pid/req") > -1) {
        String response = String(kp) + "\t" + String(ki) + "\t" + String(kd);
        client.publish(String(nodeName) + "/motor/1/pos/pid", response);
      } else if (topic.endsWith("pos")) {
        // set target position
        motorMode = MotorMode::POS;
        motorCommand = value;
      }
    } else if (topic.indexOf("com") > -1) {
      if (topic.indexOf("stiffness") > -1) {
        stiffness = payload.toFloat();
      } else if (topic.endsWith("com")) {
        motorMode = MotorMode::COM;
        motorCommand = value;
        motorPosition = encoder1Raw;
      }
    } else {
      sendError(topic + ": not supported");
      return;
    }
  });

  client.publish("node/hi", nodeName);

  rgbLedWrite(ledPin, 0, 255, 0);   // red light on connect
}

void loop() {
  static uint32_t lastTime = 0;

  // FAST LOOP
  client.loop();
  int32_t value = encoder1.getCumulativePosition();

  if (motorMode == MotorMode::PWM) {
    setMotorPwm(motorCommand);
  } else if (motorMode == MotorMode::POS) {
    setMotorPos(motorCommand);
  } else if (motorMode == MotorMode::COM) {
    setMotorCompliance();
  } else {
    sendError("MotorMode not supported");
    setMotorPwm(0);
  }

  // MID LOOP
  if (millis() - midLoopTime < 100) return;
  deltaTime = millis() - midLoopTime;
  midLoopTime = millis();

  int32_t vel = ((int32_t)value - (int32_t)encoder1Raw);
  int32_t acc = ((int32_t)vel - (int32_t)encoder1Vel);
  Serial.printf("%d\t%d\t%d\n", value, vel, acc);

  // update state
  encoder1Raw = value;
  encoder1Vel = vel;

  // SLOW LOOP
  if (millis() - slowLoopTime < 500) return;
  slowLoopTime = millis();

  // publish data sensor/1
  char topic[30] = "";
  strcat(topic, nodeName);
  strcat(topic, "/encoder/1");
  String out = String(value) + "\t" + String(vel) + "\t" + String(acc);
  client.publish(topic, out);
}
