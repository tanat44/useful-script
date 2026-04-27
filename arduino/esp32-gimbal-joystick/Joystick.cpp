#include "Joystick.h"

Joystick::Joystick() {
  left = new Gimbal("left");
  right = new Gimbal("right");
}

void Joystick::begin(uint8_t lh_sda_pin, uint8_t lh_scl_pin, uint8_t lv_sda_pin, uint8_t lv_scl_pin, uint8_t rh_sda_pin, uint8_t rh_scl_pin, uint8_t rv_sda_pin, uint8_t rv_scl_pin){
  Serial.println("joystick: begin");
  left->begin(lh_sda_pin, lh_scl_pin, lv_sda_pin, lv_scl_pin);
  left->begin(rh_sda_pin, rh_scl_pin, rv_sda_pin, rv_scl_pin);
}

void Joystick::tick() {
  left->tick();
  right->tick();
}

void Joystick::print() {
  left->print_raw();
  Serial.print(" ");
  right->print_raw();
  Serial.println();
}