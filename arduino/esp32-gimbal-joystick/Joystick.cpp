#include "Joystick.h"

Joystick::Joystick() {
  left = new Gimbal("left");
  right = new Gimbal("right");
}

void Joystick::begin(uint8_t lh_sda_pin, uint8_t lh_scl_pin, uint8_t lv_sda_pin, uint8_t lv_scl_pin, uint8_t rh_sda_pin, uint8_t rh_scl_pin, uint8_t rv_sda_pin, uint8_t rv_scl_pin) {
  Serial.println("joystick: begin");

  // left gimbal
  left->begin(lh_sda_pin, lh_scl_pin, lv_sda_pin, lv_scl_pin);
  left->configH(326, 1365, true, 60, 30);
  left->configV(522, 1722, false, 0, 0);

  // right gimbal
  right->begin(rh_sda_pin, rh_scl_pin, rv_sda_pin, rv_scl_pin);
  right->configH(-1178, -2242, true, 60, 18);
  right->configV(-485, -1664, true, 20, 5);
}

void Joystick::tick() {
  left->tick();
  right->tick();
}

void Joystick::getValues(int16_t* out_values){
  out_values[0] = mapToBleValue(left->getValueH());
  out_values[1] = mapToBleValue(left->getValueV());
  out_values[2] = mapToBleValue(right->getValueH());
  out_values[3] = mapToBleValue(right->getValueV());
}

void Joystick::printRaw() {
  left->printRaw();
  Serial.print(" ");
  right->printRaw();
  Serial.println();
}

int16_t Joystick::mapToBleValue(int16_t value){
  if (value > 1024) value = 1024;
  else if (value < -1024) value = -1024;
  int16_t output = (value + 1024) * 16;
  return output;
}