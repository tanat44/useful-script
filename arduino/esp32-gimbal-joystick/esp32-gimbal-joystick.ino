// Hardware
// 1. ESP32S3
// 2. AS5600 x4
// Onboard RBG LED is at pin 21

#include <BleGamepad.h>  // Library ESP32-BLE-Gamepad
#include "Const.h"
#include "AS5600.h"
#include "Joystick.h"
#include "ModeSelection.h"

Joystick* joystick;
BleGamepad bleGamepad = BleGamepad("t44's joystick", "tanat44", 100);
ModeSelection* modeSelection;

void setup() {
  Serial.begin(115200);

  joystick = new Joystick();
  joystick->begin(12, 13, 10, 11, 3, 2, 5, 4);
  rgbLedWrite(LED_PIN, 255, 0, 0);

  bleGamepad.begin();

  modeSelection = new ModeSelection(joystick);

  delay(1000);
}


void loop() {
  static uint32_t lastTime1 = 0;
  static uint32_t lastTime2 = 0;

  if (modeSelection->getMode() == Mode::UNKNOWN) {
    modeSelection->tick();
    return;
  }

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
    if (modeSelection->getMode() == Mode::AIRPLANE) {
      bleGamepad.setAxes(values[0], values[1], 0, values[2], values[3]);  //(X, Y, Z, RX, RY, RZ)
    } else if (modeSelection->getMode() == Mode::CAR) {
      bleGamepad.setAxes(values[0], values[3], 0, 0, 0);
    }
  }
}

void slowLoop() {
  joystick->printRaw();
  if (bleGamepad.isConnected()) {
    if (modeSelection->getMode() == Mode::AIRPLANE) {
      rgbLedWrite(LED_PIN, 0, 255, 0);
    } else if (modeSelection->getMode() == Mode::CAR) {
      rgbLedWrite(LED_PIN, 0, 0, 255);
    }
  } else {
    rgbLedWrite(LED_PIN, 255, 0, 0);
    Serial.println("ble: not connected");
  }
}
