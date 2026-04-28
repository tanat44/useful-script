#ifndef MODESELECTION_H
#define MODESELECTION_H

#include "Const.h"
#include "Joystick.h"

enum Mode {
  UNKNOWN,
  AIRPLANE,
  CAR
};

class ModeSelection {
  private: 
    Mode mode;
    Joystick* joystick;
    void blink();

  public:
    ModeSelection(Joystick* joystick);
    void tick();
    Mode getMode();
};

#endif