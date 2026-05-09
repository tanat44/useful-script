#include "Const.h"
#include "ModeSelection.h"
#include "WebControl.h"

#define DEFAULT_MODE Mode::UNKNOWN

uint8_t lastAccel = 128;
uint8_t lastSteer = 128;
uint8_t lastLift = 128;
uint8_t lastEngine = 128;
uint8_t accel = 128;
uint8_t steer = 128;
uint8_t lift = 128;
uint8_t engine = 128;
uint16_t liftRead = 0;
uint16_t engineRead = 0;

ModeSelection *modeSelection;
WebControl *webControl;

void setup() {
  Serial.begin(115200);

  modeSelection = new ModeSelection(DEFAULT_MODE);
  ledcAttach(ACCEL_OUT_PIN, 12000, 8);
  ledcAttach(STEER_OUT_PIN, 12000, 8);
  ledcAttach(LIFT_OUT_PIN, 12000, 8);
  ledcAttach(ENGINE_OUT_PIN, 12000, 8);
  analogReadResolution(12);
}

void loop() {
  static uint32_t lastTime1 = 0;
  static uint32_t lastTime2 = 0;

  ledcWrite(ACCEL_OUT_PIN, accel);
  ledcWrite(STEER_OUT_PIN, steer);
  ledcWrite(LIFT_OUT_PIN, lift);
  ledcWrite(ENGINE_OUT_PIN, engine);

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
  delay(2);
}


void fastLoop() {

  // output
  if (modeSelection->getMode() == Mode::PASSTHROUGH) {
    accel = analogRead(ACCEL_IN_PIN) >> 4;
    steer = analogRead(STEER_IN_PIN) >> 4;
    liftRead = analogRead(LIFT_IN_PIN);
    engineRead = analogRead(ENGINE_IN_PIN);

    if (liftRead > SWITCH_HIGH_THRES) {
      lift = 255;
    } else if (liftRead < SWITCH_LOW_THRES) {
      lift = 0;
    } else {
      lift = 128;
    }
    if (engineRead > SWITCH_HIGH_THRES) {
      engine = 255;
    } else if (engineRead < SWITCH_LOW_THRES) {
      engine = 0;
    } else {
      engine = 128;
    }
  } else if (modeSelection->getMode() == Mode::SLAVE) {
    if (webControl == NULL) {
      webControl = new WebControl();
      webControl->setup();
    } else if (webControl->isReady()) {
      webControl->tick();
      Command command = webControl->getCommand();
      accel = (uint8_t)(command.accel * 127) + 128;
      steer = (uint8_t)(command.steer * 127) + 128;
      lift = (uint8_t)(command.lift * 127) + 128;
      engine = (uint8_t)(command.engine * 127) + 128;
    }
    printCommand();
  }
}

void slowLoop() {
  // do nothing
}

void printCommand() {
  static bool changed;
  changed = false;
  if (accel != lastAccel) {
    changed = true;
    lastAccel = accel;
  }
  if (steer != lastSteer) {
    changed = true;
    lastSteer = steer;
  }
  if (lift != lastLift) {
    changed = true;
    lastLift = lift;
  }
  if (engine != lastEngine) {
    changed = true;
    lastEngine = engine;
  }
  if (changed) {
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
}
