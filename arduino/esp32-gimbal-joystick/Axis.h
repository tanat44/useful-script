#ifndef AXIS_H
#define AXIS_H

#include "ESP32_SoftWire.h"
#include "AS5600.h"

class Axis {

private:
  static uint8_t count;

  uint8_t id;
  String name;
  int16_t raw;
  int16_t min;
  int16_t max;
  int16_t zeroRange;
  int16_t offset;
  bool connected;
  bool centering;
  AS5600* as5600;
  SoftWire* i2c;  // For Hardware I2C, Use Wire::TwoWire instead. Hardware is limited to 2 channels

public:
  Axis();
  Axis(String _name);
  void begin(uint8_t sda_pin, uint8_t scl_pin);
  void tick();
  void printRaw();
  void setMinMax(int16_t _min, int16_t _max, bool _centering);
  void setZeroRange(int16_t value);
  void setCenterOffset(int16_t value);
  int16_t getRaw();
  int16_t getValue();
};

#endif