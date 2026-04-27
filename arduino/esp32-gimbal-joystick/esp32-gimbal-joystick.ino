// Hardware
// 1. ESP32S3
// 2. AS5600 x4
// Onboard RBG LED is at pin 21

#include "AS5600.h"
#include "Joystick.h"
// #include "Gimbal.h"
#define LED_PIN 21

Joystick* joystick;

void setup() {
  Serial.begin(9600);
  // left.begin(12, 13, 10, 11);

  joystick = new Joystick();
  joystick->begin(12, 13, 10, 11, 3, 2, 5, 4);
  rgbLedWrite(LED_PIN, 0, 255, 0);

  delay(1000);
}


void loop() {
  delay(1000);
  joystick->tick();
  joystick->print();
  // left.tick();
  // left.print_raw();
}
