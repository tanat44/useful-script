import { mqttClient } from "../mqtt";
import { TOPIC_MOTOR_POS, TOPIC_MOTOR_POS_PID_REQ } from "../topic";

export type Pid = {
  kp: number;
  ki: number;
  kd: number;
};

const setupPidInput = (domId: string, type: string) => {
  const input = document.getElementById(domId) as HTMLInputElement;
  input.onkeydown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      mqttClient.publish(`${TOPIC_MOTOR_POS}/${type}`, input.value);
    }
  };
};

const pid: Pid = {
  kp: 0,
  ki: 0,
  kd: 0,
};

export const updatePosPid = (content: string) => {
  const values = content.split("\t");
  pid.kp = parseFloat(values[0]);
  pid.ki = parseFloat(values[1]);
  pid.kd = parseFloat(values[2]);

  (document.getElementById("positionKp") as HTMLInputElement).value =
    pid.kp.toString();
  (document.getElementById("positionKi") as HTMLInputElement).value =
    pid.ki.toString();
  (document.getElementById("positionKd") as HTMLInputElement).value =
    pid.kd.toString();
};

export const getPidValue = (): Pid => {
  return {
    kp: pid.kp,
    ki: pid.ki,
    kd: pid.kd,
  };
};

setupPidInput("positionKp", "kp");
setupPidInput("positionKi", "ki");
setupPidInput("positionKd", "kd");

export const setPositionPid = async (newPid: Pid) => {
  await mqttClient.publish(`${TOPIC_MOTOR_POS}/kp`, newPid.kp.toFixed(2));
  await mqttClient.publish(`${TOPIC_MOTOR_POS}/ki`, newPid.ki.toFixed(2));
  await mqttClient.publish(`${TOPIC_MOTOR_POS}/kd`, newPid.kd.toFixed(2));
  await requestPid();
  pid.kp = newPid.kp;
  pid.ki = newPid.ki;
  pid.kd = newPid.kd;
};

export const requestPid = async () => {
  await mqttClient.publish(TOPIC_MOTOR_POS_PID_REQ, "");
};
