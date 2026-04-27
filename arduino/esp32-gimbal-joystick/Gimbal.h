#ifndef GIMBAL_H
#define GIMBAL_H

#include "Axis.h"

class Gimbal {
  private:
    String name;
    Axis* h;
    Axis* v;

  public:
    Gimbal(String name);
    void begin(uint8_t h_sda_pin, uint8_t h_scl_pin, uint8_t v_sda_pin, uint8_t v_scl_pin);
    void tick();
    void print_raw();
};

#endif