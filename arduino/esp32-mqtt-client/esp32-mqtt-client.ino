/*
  SimpleMQTTClient.ino
  The purpose of this exemple is to illustrate a simple handling of MQTT and Wifi connection.
  Once it connects successfully to a Wifi network and a MQTT broker, it subscribe to a topic and send a message to it.
  It will also send a message delayed 5 seconds later.
*/

#include "EspMQTTClient.h"
#include "AS5600.h"

// mqtt
const char *wifi = "Ziggo41AA8C624";
const char *wifiPass = "Jj12345678";
const char *serverIp = "192.168.178.53";
const char *serverUser = "hello";
const char *serverPass = "test";
const char *nodeName = "myesp";

// sensor1
AS5600 sensor1;
const uint8_t sensor1Pin1 = 7;
const uint8_t sensor1Pin2 = 8;

EspMQTTClient client(
  wifi,
  wifiPass,
  serverIp,
  serverUser,
  serverPass,
  nodeName,
  1883);

void setup() {
  Serial.println("started");
  Serial.begin(115200);

  // sensor1
  Wire.begin(sensor1Pin1, sensor1Pin2);     // pin7 for sensor sda, pin8 for sensor scl
  sensor1.begin(4);                         //  set direction pin.
  sensor1.setDirection(AS5600_CLOCK_WISE);  //  default, just be explicit.

  // mqtt
  client.enableDebuggingMessages();                    // Enable debugging messages sent to serial output
  client.enableHTTPWebUpdater();                       // Enable the web updater. User and password default to values of MQTTUsername and MQTTPassword. These can be overridded with enableHTTPWebUpdater("user", "password").
  client.enableOTA();                                  // Enable OTA (Over The Air) updates. Password defaults to MQTTPassword. Port is the default OTA port. Can be overridden with enableOTA("password", port).
  client.enableLastWillMessage("node/bye", nodeName);  // You can activate the retain flag by setting the third parameter to true
}

// This function is called once everything is connected (Wifi and MQTT)
// WARNING : YOU MUST IMPLEMENT IT IF YOU USE EspMQTTClient
void onConnectionEstablished() {
  // Subscribe to "mytopic/test" and display received message to Serial
  client.subscribe("mytopic/test", [](const String &payload) {
    Serial.println(payload);
  });

  // Subscribe to "mytopic/wildcardtest/#" and display received message to Serial
  client.subscribe("mytopic/wi ldcardtest/#", [](const String &topic, const String &payload) {
    Serial.println("(From wildcard) topic: " + topic + ", payload: " + payload);
  });

  client.publish("node/join", nodeName);

  // Execute delayed instructions
  client.executeDelayed(5 * 1000, []() {
    client.publish("mytopic/wildcardtest/test123", "This is a message sent 5 seconds later");
  });
}

void loop() {
  // fast loop
  client.loop();

  // 500ms loop
  static uint32_t lastTime = 0;
  if (millis() - lastTime < 500) return;
  lastTime = millis();

  // publish sensor1 value
  int32_t value = sensor1.getCumulativePosition();
  char topic[30] = "";
  strcat(topic, nodeName);
  strcat(topic, "/sensor1/value");
  Serial.printf("%s\t%d\n", topic, value);
  client.publish(topic, String(value));
}
