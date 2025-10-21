#include "EspMQTTClient.h"

// global
int32_t steer = 0;
int32_t accel = 0;

// mqtt
const char *wifi = "Ziggo41AA8C624";
const char *wifiPass = "Jj12345678";
const char *serverIp = "192.168.178.53";
const char *serverUser = "hello";
const char *serverPass = "test";
const char *nodeName = "rccar";
EspMQTTClient client(
  wifi,
  wifiPass,
  serverIp,
  serverUser,
  serverPass,
  nodeName,
  1883);

// motor
const int freq = 5000;
const int resolution = 8;
const int motorLPin1 = 3;
const int motorLPin2 = 4;
const int motorRPin1 = 5;
const int motorRPin2 = 6;
const int maxSpeed = 255;
const int maxSteerSpeed = 255;
const int spotTurnSpeed = 255;

void setup() {
  Serial.begin(115200);
  Serial.println("started");

  // motor
  ledcAttach(motorLPin1, freq, resolution);
  ledcAttach(motorLPin2, freq, resolution);
  ledcAttach(motorRPin1, freq, resolution);
  ledcAttach(motorRPin2, freq, resolution);

  // mqtt
  client.enableLastWillMessage("node/bye", nodeName);  // You can activate the retain flag by setting the third parameter to true
}

void sendInfo(const String &message) {
  client.publish(String(nodeName) + "/info", message);
}

void sendError(const String &message) {
  client.publish(String(nodeName) + "/error", message);
}

void spotTurn(int32_t *pwmL, int32_t *pwmR) {
  int32_t newSteer = map(steer, -512, 512, -spotTurnSpeed, spotTurnSpeed);
  *pwmL = newSteer;
  *pwmR = -newSteer;
}

void driveAndSteer(int32_t *pwmL, int32_t *pwmR) {
  int32_t newSteer = map(steer, -512, 512, -maxSteerSpeed, maxSteerSpeed);
  int32_t newAccel = map(accel, -512, 512, -maxSpeed, maxSpeed);

  int32_t pwmLeft = newAccel;
  int32_t pwmRight = newAccel;

  if (steer > 0) {
    pwmRight -= newSteer;
  } else {
    pwmLeft += newSteer;
  }

  *pwmL = map(pwmLeft, -maxSpeed, maxSpeed, 0, maxSpeed);
  *pwmR = map(pwmRight, -maxSpeed, maxSpeed, 0, maxSpeed);
}

void onConnectionEstablished() {
  client.publish("node/hi", nodeName);

  client.subscribe("joystick/axis", [](const String &topic, const String &payload) {
    Serial.println("received joystick axis: " + payload);

    // split received data by \t
    int i;
    char delimiter[] = "\t";
    char *p;
    char string[128];
    String words[4];

    payload.toCharArray(string, sizeof(string));
    i = 0;
    p = strtok(string, delimiter);
    while (p && i < 4) {
      words[i] = p;
      p = strtok(NULL, delimiter);
      ++i;
    }

    steer = words[0].toInt();
    accel = -words[3].toInt();
  });

  Serial.println("mqtt connected");
}

void loop() {
  client.loop();

  int32_t pwmL = 0;
  int32_t pwmR = 0;

  if (accel == 0) {
    spotTurn(&pwmL, &pwmR);
  } else {
    driveAndSteer(&pwmL, &pwmR);
  }

  if (pwmL > 0) {
    ledcWrite(motorLPin1, abs(pwmL));
    ledcWrite(motorLPin2, 0);
  } else {
    ledcWrite(motorLPin1, 0);
    ledcWrite(motorLPin2, abs(pwmL));
  }

  if (pwmR > 0) {
    ledcWrite(motorRPin1, abs(pwmR));
    ledcWrite(motorRPin2, 0);
  } else {
    ledcWrite(motorRPin1, 0);
    ledcWrite(motorRPin2, abs(pwmR));
  }
}
