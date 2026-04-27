// Hardware
// 1. ESP32S3
// 2. AS5600 x4
// Onboard RBG LED is at pin 21

#include <BleGamepad.h>  // Library ESP32-BLE-Gamepad
#include "AS5600.h"
#include "Joystick.h"
#define LED_PIN 21

BleGamepad bleGamepad = BleGamepad("t44's joystick", "tanat44", 100);
Joystick* joystick;

void setup() {
  Serial.begin(115200);

  joystick = new Joystick();
  joystick->begin(12, 13, 10, 11, 3, 2, 5, 4);
  rgbLedWrite(LED_PIN, 255, 0, 0);

  bleGamepad.begin();

  delay(1000);
}


void loop() {
  static uint32_t lastTime1 = 0;
  static uint32_t lastTime2 = 0;

  // every 30 ms
  if (millis() - lastTime1 > 30) {
    lastTime1 = millis();
    fastLoop();
  } 

  // every 1000ms
  if (millis() - lastTime2 > 1000) {
    lastTime2 = millis();
    slowLoop();
  }
}

void fastLoop() {
  joystick->tick();
  if (bleGamepad.isConnected()) {
    int16_t values[4];
    joystick->getValues(values);
    bleGamepad.setAxes(values[0], values[1], values[2], values[3]);  //(X, Y, Z, RX, RY, RZ)
  } 
}

void slowLoop() {
  joystick->printRaw();
  if (bleGamepad.isConnected()) {
    rgbLedWrite(LED_PIN, 0, 255, 0);
  } else {
    rgbLedWrite(LED_PIN, 255, 0, 0);
    Serial.println("ble: not connected");
  }
}
