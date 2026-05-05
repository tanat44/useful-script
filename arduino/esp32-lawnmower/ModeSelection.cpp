#include "Arduino.h"
#include "Const.h"
#include "ModeSelection.h"

#define SELECT_THRESHOLD 2800
#define WAIT_CYCLE 5

ModeSelection::ModeSelection(Mode defaultMode)
  : mode(defaultMode), count(0) {
  if (mode != Mode::UNKNOWN) {
    chooseMode();
  }
}

void ModeSelection::chooseMode() {
  if (mode == Mode::SLAVE) {
    Serial.println("mode: slave");
    rgbLedWrite(LED_PIN, 0, 0, 255);
  } else if (mode == Mode::PASSTHROUGH) {
    Serial.println("mode: passthrough");
    rgbLedWrite(LED_PIN, 0, 255, 0);
  }
}

void ModeSelection::tick() {
  if (mode != Mode::UNKNOWN) {
    return;
  }

  Serial.println("use left stick to choose mode");
  blink();

  static int value = 0;
  value = analogRead(ACCEL_IN_PIN);

  if (value > SELECT_THRESHOLD) {
    mode = Mode::SLAVE;
  } else if (count > WAIT_CYCLE) {
    mode = Mode::PASSTHROUGH;
  }
}

Mode ModeSelection::getMode() {
  return mode;
}

void ModeSelection::blink() {
  ++count;
  rgbLedWrite(LED_PIN, 255, 255, 255);
  delay(300);
  rgbLedWrite(LED_PIN, 0, 0, 0);
  delay(300);
}