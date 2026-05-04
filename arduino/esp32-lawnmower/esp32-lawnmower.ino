
#define RGB_BUILTIN 21
#define ACCEL_IN_PIN 6
#define ACCEL_OUT_PIN 5

uint16_t accel;

void setup() {
  Serial.begin(115200);
  ledcAttach(ACCEL_OUT_PIN, 12000, 8);
  analogReadResolution(12);
}

void loop() {
  // input
  accel = analogRead(ACCEL_IN_PIN);

  Serial.print("accel = ");
  Serial.print(accel);
  Serial.println();

  // output
  ledcWrite(ACCEL_OUT_PIN, accel >> 4);
  rgbLedWrite(RGB_BUILTIN, accel, 0, 0);
  delay(300);
}
