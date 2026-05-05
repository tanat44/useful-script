#include "Const.h"
#include "ModeSelection.h"

uint16_t accel;
uint16_t steer;
uint16_t lift;
uint16_t engine;
ModeSelection* modeSelection;

void setup() {
  Serial.begin(115200);

  modeSelection = new ModeSelection();
  ledcAttach(ACCEL_OUT_PIN, 12000, 8);
  ledcAttach(STEER_OUT_PIN, 12000, 8);
  ledcAttach(LIFT_OUT_PIN, 12000, 8);
  ledcAttach(ENGINE_OUT_PIN, 12000, 8);
  analogReadResolution(12);
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
  lift = analogRead(LIFT_IN_PIN);
  engine = analogRead(ENGINE_IN_PIN);

  // output
  if (modeSelection->getMode() == Mode::PASSTHROUGH) {
    ledcWrite(ACCEL_OUT_PIN, accel >> 4);
    ledcWrite(STEER_OUT_PIN, steer >> 4);
    if (lift > SWITCH_HIGH_THRES) {
      ledcWrite(LIFT_OUT_PIN, 255);
    } else if (lift < SWITCH_LOW_THRES) {
      ledcWrite(LIFT_OUT_PIN, 0);
    } else {
      ledcWrite(LIFT_OUT_PIN, 128);
    }
    if (engine > SWITCH_HIGH_THRES) {
      ledcWrite(ENGINE_OUT_PIN, 255);
    } else if (engine < SWITCH_LOW_THRES) {
      ledcWrite(ENGINE_OUT_PIN, 0);
    } else {
      ledcWrite(ENGINE_OUT_PIN, 128);
    }
  }
}

void slowLoop() {
  Serial.print("accel = ");
  Serial.print(accel);
  Serial.print("\tsteer = ");
  Serial.print(steer);
  Serial.print("\tlift = ");
  Serial.print(lift);
  Serial.print("\tengine = ");
  Serial.print(engine);
  Serial.println();
}
