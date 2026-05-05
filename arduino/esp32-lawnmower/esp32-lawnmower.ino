#include "Const.h"
#include "ModeSelection.h"
#include "WebControl.h"

#define DEFAULT_MODE Mode::SLAVE

uint16_t accel = 2048;
uint16_t steer = 2048;
uint16_t lift = 2048;
uint16_t engine = 2048;
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
  // read input
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
  } else if (modeSelection->getMode() == Mode::SLAVE) {
    if (webControl == NULL) {
      webControl = new WebControl();
      webControl->setup();
    } else if (webControl->isReady()) {
      webControl->tick();
      Command command = webControl->getCommand();
      accel = (uint16_t)(command.accel * 2048) + 2047;
      steer = (uint16_t)(command.steer * 2048) + 2047;
      lift = (uint16_t)(command.lift * 2048) + 2047;
      engine = (uint16_t)(command.engine * 2048) + 2047;
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
