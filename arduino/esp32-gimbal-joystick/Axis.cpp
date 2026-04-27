#include "Axis.h"

uint8_t Axis::count = 0;

Axis::Axis()
  : name("undefined") {}

Axis::Axis(String _name)
  : name(_name) {
  id = Axis::count++;
  // i2c = new TwoWire(id);
  i2c = new SoftWire();
  as5600 = new AS5600(i2c);
}

void Axis::begin(uint8_t sda_pin, uint8_t scl_pin) {
  Serial.print(name);
  i2c->begin(sda_pin, scl_pin);
  as5600->begin();
  as5600->setDirection(AS5600_CLOCK_WISE);
  if (as5600->isConnected()) {
    Serial.print(": connected pin(");
    Serial.print(sda_pin);
    Serial.print(",");
    Serial.print(scl_pin);
    Serial.println(")");
    connected = true;
  } else {
    Serial.println(": not connected");
  }
}

void Axis::tick() {
  if (!connected) return;
  value = as5600->getCumulativePosition();
}

void Axis::print_raw() {
  Serial.print(name);
  Serial.print(": ");
  Serial.println(value);
}