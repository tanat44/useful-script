// Hardware
// 1. ESP32S3 2. AS5600
// Onboard RBG LED is at pin 21

#include "AS5600.h"

AS5600 as5600;

void setup()
{
  Serial.begin(9600);
  Serial.println();
  Serial.println(__FILE__);
  Serial.print("AS5600_LIB_VERSION: ");
  Serial.println(AS5600_LIB_VERSION);
  Serial.println();

  Wire.begin(7,8);    // pin7 for sensor sda, pin8 for sensor scl

  as5600.begin(4);  //  set direction pin.
  as5600.setDirection(AS5600_CLOCK_WISE);  //  default, just be explicit.

  Serial.println(as5600.getAddress());

  int b = as5600.isConnected();
  Serial.print("Connect: ");
  Serial.println(b);

  delay(1000);
}


void loop()
{
  static uint32_t lastTime = 0;

  //  set initial position
  as5600.getCumulativePosition();

  //  update every 100 ms
  //  should be enough up to ~200 RPM
  if (millis() - lastTime >= 100)
  {
    lastTime = millis();
    Serial.print(as5600.getCumulativePosition());
    Serial.print("\t");
    Serial.println(as5600.getRevolutions());
  }

  //  just to show how reset can be used
  if (as5600.getRevolutions() >= 10)
  {
    as5600.resetPosition();
  }

  float rot = as5600.getCumulativePosition() / 4096.0;

  rgbLedWrite(21, 0, rot * 255, 0);
}
