#ifndef AXIS_H
#define AXIS_H

#include "ESP32_SoftWire.h"
// #include "Wire.h"
#include "AS5600.h"

class Axis {

private:
  static uint8_t count;

  uint8_t id;
  String name;
  int value;
  bool connected;
  AS5600* as5600;
  SoftWire* i2c;  // For Hardware I2C, Use Wire::TwoWire instead. Hardware is limited to 2 channels

public:
  Axis();
  Axis(String _name);
  void begin(uint8_t sda_pin, uint8_t scl_pin);
  void tick();
  void print_raw();
  int getValue() const {
    return value;
  }
};

#endif