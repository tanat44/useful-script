const uint8_t motorLPin1 = 3; 
const uint8_t motorLPin2 = 4;
const uint8_t motorRPin1 = 5;
const uint8_t motorRPin2 = 6;

int count = 0;

void setup() {
  Serial.begin(115200);
  Serial.println("hello");
  ledcAttach(motorLPin1, 5000, 8);
  ledcAttach(motorLPin2, 5000, 8);
  ledcAttach(motorRPin1, 5000, 8);
  ledcAttach(motorRPin2, 5000, 8);
}

void loop() {
  if (count % 2 == 0) {
    ledcWrite(motorLPin1, 255);
    ledcWrite(motorLPin2, 0);
    ledcWrite(motorRPin1, 255);
    ledcWrite(motorRPin2, 0);
  } else {
    ledcWrite(motorLPin1, 0);
    ledcWrite(motorLPin2, 255);
    ledcWrite(motorRPin1, 0);
    ledcWrite(motorRPin2, 255);
  }

  Serial.println("hello " + String(count++));
  sleep(1);
}
