import mqtt from "mqtt";
import { updateEncoderData } from "./encoder";
import { updatePosPid } from "./motor/position";
import {
  TOPICS,
  TOPIC_ENCODER,
  TOPIC_ERROR,
  TOPIC_INFO,
  TOPIC_MOTOR_POS_PID,
  TOPIC_MOTOR_POS_PID_REQ,
} from "./topic";

export const mqttClient = mqtt.connect("mqtt://192.168.178.53:9001", {
  clientId: "pid-frontend",
  username: "hello",
  password: "test",
});

mqttClient.on("connect", async () => {
  await mqttClient.subscribe(TOPICS);

  // publish on connect
  await mqttClient.publish("node/hi", "Hello from PID frontend");
  mqttClient.publish(TOPIC_MOTOR_POS_PID_REQ, "");
});

function addContent(parentId: string, content: string) {
  const parent = document.getElementById(parentId);
  if (parent.childNodes.length > 5) {
    const first = parent.childNodes[0];
    parent.removeChild(first);
  }

  const contentDom = document.createElement("div");
  contentDom.innerText = content;
  parent.appendChild(contentDom);
}

mqttClient.on("message", (topic: string, message: Buffer) => {
  const content = message.toString();
  if (topic === TOPIC_INFO) {
    addContent("infoContent", content);
  } else if (topic === TOPIC_ERROR) {
    addContent("errorContent", content);
  } else if (topic === TOPIC_ENCODER) {
    // addContent("encoderContent", content);
    updateEncoderData(content);
  } else if (topic === TOPIC_MOTOR_POS_PID) {
    updatePosPid(content);
  }
});
