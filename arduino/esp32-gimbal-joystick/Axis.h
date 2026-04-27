#ifndef AXIS_H
#define AXIS_H

#include "Wire.h"
#include "AS5600.h"

class Axis {

  private:
    static uint8_t count;

    uint8_t id;
    String name;
    int value;
    bool connected;
    TwoWire* i2c;
    AS5600* as5600;

  public:
    Axis();
    Axis(String _name);
    void begin(uint8_t sda_pin, uint8_t scl_pin);
    void tick();
    void print_raw();
    int getValue() const { return value; }
};

#endif