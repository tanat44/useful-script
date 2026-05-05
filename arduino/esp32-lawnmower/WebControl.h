#ifndef WEBCONTROL_H
#define WEBCONTROL_H

#include <WebServer.h>
#include "Command.h"

class WebControl {
private:
  static WebServer *server;
  static Command command;
  static int lastTime;
  static void handleRoot();
  static void handleNotFound();
  static void handleLawnMover();
  static float processInput(const String &text);
  void resetCommand();

  bool ready;

public:
  WebControl();
  void setup();
  void tick();
  bool isReady() const {
    return ready;
  }
  Command getCommand();
};

#endif