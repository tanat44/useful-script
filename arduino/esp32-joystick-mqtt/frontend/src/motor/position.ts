import { mqttClient } from "../mqtt";
import { TOPIC_MOTOR_POS, TOPIC_MOTOR_POS_PID_REQ } from "../topic";
import { updateSetPos } from "./oscillation";

const positionDom = document.getElementById("positionOption");
const positionValue = [-2, -1, 0, 0.25, 0.5, 0.75, 1, 2];
for (const value of positionValue) {
  const button = document.createElement("button");
  button.innerText = value.toString();
  positionDom.appendChild(button);
  button.onclick = () => {
    setMotorPos(value);
  };
}
const positionPidRefresh = document.getElementById("positionPidRefresh");
positionPidRefresh.onclick = () => {
  mqttClient.publish(TOPIC_MOTOR_POS_PID_REQ, "");
};

export const setMotorPos = (pos: number) => {
  const rawValue = pos * 4096;
  updateSetPos(rawValue);
  mqttClient.publish(TOPIC_MOTOR_POS, rawValue.toString());
};
