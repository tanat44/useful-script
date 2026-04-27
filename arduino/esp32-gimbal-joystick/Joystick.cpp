#include "Joystick.h"

Joystick::Joystick() {
  left = new Gimbal("left");
  right = new Gimbal("right");
}

void Joystick::begin(uint8_t lh_sda_pin, uint8_t lh_scl_pin, uint8_t lv_sda_pin, uint8_t lv_scl_pin, uint8_t rh_sda_pin, uint8_t rh_scl_pin, uint8_t rv_sda_pin, uint8_t rv_scl_pin) {
  Serial.println("joystick: begin");

  // left gimbal
  left->begin(lh_sda_pin, lh_scl_pin, lv_sda_pin, lv_scl_pin);
  left->configH(326, 1365, true);
  left->configV(522, 1722, false);

  // right gimbal
  right->begin(rh_sda_pin, rh_scl_pin, rv_sda_pin, rv_scl_pin);
  right->configH(-1178, -2242, true);
  right->configV(-485, -1664, true);
}

void Joystick::tick() {
  left->tick();
  right->tick();
}

void Joystick::print() {
  left->printRaw();
  Serial.print(" ");
  right->printRaw();
  Serial.println();
}