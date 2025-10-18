import mqtt from "mqtt";

const NODE_ID = "myesp";
const TOPIC_INFO = `${NODE_ID}/info`;
const TOPIC_ERROR = `${NODE_ID}/info`;
const TOPIC_ENCODER = `${NODE_ID}/encoder/1`;
const TOPIC_MOTOR = `${NODE_ID}/motor/1`;
const TOPIC_MOTOR_PWM = `${NODE_ID}/motor/1/pwm`;
const TOPIC_MOTOR_POSITION = `${NODE_ID}/motor/1/pos`;

const TOPICS = [TOPIC_INFO, TOPIC_ERROR, TOPIC_ENCODER];

const client = mqtt.connect("mqtt://192.168.178.53:9001", {
  clientId: "pid-frontend",
  username: "hello",
  password: "test",
});

client.on("connect", async () => {
  client.publish("node/hi", "Hello from PID frontend");
  await client.subscribe(TOPICS);
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

client.on("message", (topic: string, message: Buffer) => {
  const content = message.toString();
  if (topic === TOPIC_INFO) {
    addContent("infoContent", content);
  } else if (topic === TOPIC_ERROR) {
    addContent("errorContent", content);
  } else if (topic === TOPIC_ENCODER) {
    addContent("encoderContent", content);
  }
});

// pwm
const pwmDom = document.getElementById("pwmOption");
const pwmValues = [
  -255, -200, -150, -100, -50, -20, -10, 0, 10, 20, 50, 100, 150, 200, 255,
];
for (const value of pwmValues) {
  const button = document.createElement("button");
  button.innerText = value.toString();
  pwmDom.appendChild(button);
  button.onclick = () => {
    client.publish(TOPIC_MOTOR_PWM, value.toString());
  };
}

// position
const positionDom = document.getElementById("positionOption");
const positionValue = [-2, -1, 0, 0.25, 0.5, 0.75, 1, 2];
for (const value of positionValue) {
  const button = document.createElement("button");
  button.innerText = value.toString();
  positionDom.appendChild(button);
  button.onclick = () => {
    client.publish(TOPIC_MOTOR_POSITION, (value * 4096).toString());
  };
}
