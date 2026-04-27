#ifndef JOYSTICK_H
#define JOYSTICK_H

#include "Gimbal.h"

class Joystick{
  private:
    Gimbal* left;
    Gimbal* right;

  public:
    Joystick();
    void begin(uint8_t lh_sda_pin, uint8_t lh_scl_pin, uint8_t lv_sda_pin, uint8_t lv_scl_pin, uint8_t rh_sda_pin, uint8_t rh_scl_pin, uint8_t rv_sda_pin, uint8_t rv_scl_pin);
    void tick();
    void print();
};

#endif