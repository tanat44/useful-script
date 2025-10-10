// Hardware
// 1. ESP32S3
// 2. AS5600  (pin7=sda, pin8=scl)
// 3. L298N (pin9, pin10)
// Onboard RBG LED is at pin 21

#include "AS5600.h"

AS5600 as5600;

const int freq = 5000;
const int resolution = 8;

// PIN SETTING
const int motorPin1 = 9;
const int motorPin2 = 10;
const int ledPin = 21;

void setup() {
  Serial.begin(9600);
  Serial.println();
  Serial.println(__FILE__);
  Serial.print("AS5600_LIB_VERSION: ");
  Serial.println(AS5600_LIB_VERSION);
  Serial.println();

  Wire.begin(7, 8);  // pin7 for sensor sda, pin8 for sensor scl

  as5600.begin(4);                         //  set direction pin.
  as5600.setDirection(AS5600_CLOCK_WISE);  //  default, just be explicit.

  Serial.println(as5600.getAddress());

  int b = as5600.isConnected();
  Serial.print("Connect: ");
  Serial.println(b);

  ledcAttach(motorPin1, freq, resolution);
  ledcAttach(motorPin2, freq, resolution);

  delay(1000);
}


void loop() {
  static uint32_t lastTime = 0;

  //  update every 100 ms. should be enough up to ~200 RPM
  if (millis() - lastTime < 100) {
    lastTime = millis();
    return;
  }

  int value = as5600.getCumulativePosition();
  int rev = as5600.getRevolutions();
  uint8_t pwm = abs((int)(value / 4096.0 * 255));

  // print output
  Serial.print(value);
  Serial.print("\t");
  Serial.print(pwm);
  Serial.println();

  // control motor
  if (value > 0) {
    ledcWrite(motorPin1, pwm);
    ledcWrite(motorPin2, 0);
    rgbLedWrite(ledPin, 0, pwm, 0);
  } else {
    ledcWrite(motorPin1, 0);
    ledcWrite(motorPin2, pwm);
    rgbLedWrite(ledPin, pwm, 0, 0);
  }
}
