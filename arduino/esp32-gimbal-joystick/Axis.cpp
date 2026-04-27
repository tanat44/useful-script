#include "Axis.h"

// equivalent to -1024 to 1024
const float OUTPUT_RANGE = 1024;

uint8_t Axis::count = 0;

Axis::Axis(String _name)
  : name(_name) {
  id = Axis::count++;
  i2c = new SoftWire();  // i2c = new TwoWire(id);
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
  raw = as5600->getCumulativePosition();
}

void Axis::setMinMax(int16_t _min, int16_t _max) {
  min = _min;
  max = _max;
}

void Axis::setZeroRange(int16_t value) {
  zeroRange = value;
}

void Axis::setCenterOffset(int16_t value) {
  offset = value;
}

int16_t Axis::getRaw() {
  return raw;
}

int16_t Axis::getValue() {
  // clamp value
  int16_t rawClamped = raw;
  if (min < max) {
    if (raw < min) rawClamped = min;
    else if (raw > max) rawClamped = max;
  } else {
    if (raw > min) rawClamped = min;
    else if (raw < max) rawClamped = max;
  }

  // convert to range [0,1]
  float value = ((float)rawClamped - min) / (max - min);

  // convert to range [-range, range]
  value = (value * 2 - 1) * OUTPUT_RANGE;

  // offset
  int16_t output = (int16_t)value;
  output += offset;

  // deadzone
  if (abs(output) < zeroRange) output = 0;

  return output;
}

void Axis::printRaw() {
  Serial.print(name);
  Serial.print(": ");
  Serial.println(raw);
}