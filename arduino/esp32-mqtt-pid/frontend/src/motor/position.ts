import { mqttClient } from "../mqtt";
import { updateSetPos } from "../oscillation";
import { TOPIC_MOTOR_POS, TOPIC_MOTOR_POS_PID_REQ } from "../topic";

const positionDom = document.getElementById("positionOption");
const positionValue = [-2, -1, 0, 0.25, 0.5, 0.75, 1, 2];
for (const value of positionValue) {
  const button = document.createElement("button");
  button.innerText = value.toString();
  positionDom.appendChild(button);
  button.onclick = () => {
    const rawValue = value * 4096;
    updateSetPos(rawValue);
    mqttClient.publish(TOPIC_MOTOR_POS, rawValue.toString());
  };
}
const positionPidRefresh = document.getElementById("positionPidRefresh");
positionPidRefresh.onclick = () => {
  mqttClient.publish(TOPIC_MOTOR_POS_PID_REQ, "");
};

export const updatePosPid = (content: string) => {
  const values = content.split("\t");
  const kp = values[0];
  const ki = values[1];
  const kd = values[2];

  (document.getElementById("positionKp") as HTMLInputElement).value = kp;
  (document.getElementById("positionKi") as HTMLInputElement).value = ki;
  (document.getElementById("positionKd") as HTMLInputElement).value = kd;
};
