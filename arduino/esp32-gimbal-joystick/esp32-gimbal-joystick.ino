// Hardware
// 1. ESP32S3
// 2. AS5600 x4
// Onboard RBG LED is at pin 21

#include "AS5600.h"
#include "Gimbal.h"
#define LED_PIN 21

Gimbal left = Gimbal("left");

void setup() {
  Serial.begin(9600);
  Serial.println("joystick started");
  left.begin(12, 13, 10, 11);

  rgbLedWrite(LED_PIN, 0, 255, 0);

  delay(1000);
}


void loop() {
  delay(1000);
  left.tick();
  left.print_raw();
}
