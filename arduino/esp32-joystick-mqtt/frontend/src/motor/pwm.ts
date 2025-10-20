import { mqttClient } from "../mqtt";
import { TOPIC_MOTOR_PWM } from "../topic";

const pwmDom = document.getElementById("pwmOption");
const pwmValues = [
  -255, -200, -150, -100, -50, -20, -10, 0, 10, 20, 50, 100, 150, 200, 255,
];
for (const value of pwmValues) {
  const button = document.createElement("button");
  button.innerText = value.toString();
  pwmDom.appendChild(button);
  button.onclick = () => {
    mqttClient.publish(TOPIC_MOTOR_PWM, value.toString());
  };
}
const motorStop = document.getElementById("motorStop");
motorStop.onclick = () => {
  mqttClient.publish(TOPIC_MOTOR_PWM, "0");
};

document.onkeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    mqttClient.publish(TOPIC_MOTOR_PWM, "0");
  }
};
