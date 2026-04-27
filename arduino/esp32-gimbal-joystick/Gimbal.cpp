#include "Gimbal.h"
#include "Axis.h"

Gimbal::Gimbal(String _name): name(_name) {
  h = new Axis(name + "_h");
  v = new Axis(name + "_v");
}

void Gimbal::begin(uint8_t h_sda_pin, uint8_t h_scl_pin, uint8_t v_sda_pin, uint8_t v_scl_pin){
  h->begin(h_sda_pin, h_scl_pin);
  v->begin(v_sda_pin, v_scl_pin);
}

void Gimbal::tick() {
  h->tick();
  v->tick();
}

void Gimbal::print_raw() {
  Serial.print(name);
  Serial.print(": (");
  Serial.print(h->getValue());
  Serial.print(", ");
  Serial.print(v->getValue());
  Serial.print(")");
}