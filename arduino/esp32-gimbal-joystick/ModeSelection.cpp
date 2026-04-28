#include "ModeSelection.h"

#define SELECT_THRESHOLD 800

ModeSelection::ModeSelection(Joystick* _joystick)
  : joystick(_joystick), mode(Mode::UNKNOWN) {
}

void ModeSelection::tick() {
  if (mode != Mode::UNKNOWN) {
    delay(100);
    return;
  }

  Serial.println("use right stick horizontal to choose mode");
  blink();
  joystick->tick();
  int16_t values[4];
  joystick->getRaw(values);

  // use right gimbal - horizontal to choose mode
  // push to left = car
  // push to right = airplane
  int16_t trigger = values[2];

  if (trigger > SELECT_THRESHOLD) {
    mode = Mode::CAR;
    Serial.println("mode: car");
  } else if (trigger < -SELECT_THRESHOLD) {
    mode = Mode::AIRPLANE;
    Serial.println("mode: airplane");
  }
}

Mode ModeSelection::getMode() {
  return mode;
}

void ModeSelection::blink() {
  rgbLedWrite(LED_PIN, 255, 255, 255);
  delay(300);
  rgbLedWrite(LED_PIN, 0, 0, 0);
  delay(300);
}