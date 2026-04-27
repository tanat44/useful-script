#ifndef JOYSTICK_H
#define JOYSTICK_H

#include "Gimbal.h"

class Joystick{
  private:
    Gimbal* left;
    Gimbal* right;
    int16_t mapToBleValue(int16_t value);

  public:
    Joystick();
    void begin(uint8_t lh_sda_pin, uint8_t lh_scl_pin, uint8_t lv_sda_pin, uint8_t lv_scl_pin, uint8_t rh_sda_pin, uint8_t rh_scl_pin, uint8_t rv_sda_pin, uint8_t rv_scl_pin);
    void tick();
    /**
    Output values from left and right gimbals. Expect int16_t array of length 4. Value range from 0-32767
    */
    void getValues(int16_t* out_values);
    void printRaw();
};

#endif