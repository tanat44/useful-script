const int freq = 5000;
const int resolution = 8;

// PIN SETTING
const int motor1Pin2 = 27;
const int motor1Pin1 = 25;
const int motor2Pin1 = 32;
const int motor2Pin2 = 12;
const int pwmValue = 180;
int value = 0;

void setup() {
  Serial.begin(115200);
  Serial.println("hello");

  ledcAttach(motor1Pin1, freq, resolution);
  ledcAttach(motor1Pin2, freq, resolution);
  ledcAttach(motor2Pin1, freq, resolution);
  ledcAttach(motor2Pin2, freq, resolution);
}


void loop() {
  static uint32_t lastTime = 0;
  if (millis() - lastTime < 2000) return;
  lastTime = millis();

  // print output
  Serial.println(value);

  // control motor
  if (value % 2 == 0) {
    ledcWrite(motor1Pin1, pwmValue);
    ledcWrite(motor1Pin2, 0);
    ledcWrite(motor2Pin1, pwmValue);
    ledcWrite(motor2Pin2, 0);
  } else {
    ledcWrite(motor1Pin1, 0);
    ledcWrite(motor1Pin2, pwmValue);
    ledcWrite(motor2Pin1, 0);
    ledcWrite(motor2Pin2, pwmValue);
  }

  ++value;
}
