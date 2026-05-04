#include "Const.h"
#include "ModeSelection.h"

uint16_t accel;
uint16_t steer;
ModeSelection* modeSelection;

void setup() {
  Serial.begin(115200);
  
  modeSelection = new ModeSelection();
  ledcAttach(ACCEL_OUT_PIN, 12000, 8);
  ledcAttach(STEER_OUT_PIN, 12000, 8);
  analogReadResolution(12);

  rgbLedWrite(RGB_BUILTIN, 0, 255, 0);
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
  delay(10);
}


void fastLoop() {
  // input
  accel = analogRead(ACCEL_IN_PIN);
  steer = analogRead(STEER_IN_PIN);

  // output
  if (modeSelection->getMode() == Mode::PASSTHROUGH) {
    ledcWrite(ACCEL_OUT_PIN, accel >> 4);
    ledcWrite(STEER_OUT_PIN, steer >> 4);
  }
}

void slowLoop() {
  Serial.print("accel = ");
  Serial.print(accel);
  Serial.print("\tsteer = ");
  Serial.print(steer);
  Serial.println();
}
