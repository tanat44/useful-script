#ifndef MODESELECTION_H
#define MODESELECTION_H

#include <cstdint>
#include "Const.h"

enum Mode {
  UNKNOWN,
  PASSTHROUGH,
  SLAVE
};

class ModeSelection {
private:
  uint8_t count;
  Mode mode;
  void blink();
  void chooseMode();

public:
  ModeSelection(Mode defaultMode);
  void tick();
  Mode getMode();
};

#endif