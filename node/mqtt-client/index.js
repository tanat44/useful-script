const mqtt = require("mqtt");

const protocol = "mqtt";
const host = "localhost";
const port = "1883";
const clientId = `node-client-${Math.floor(Math.random() * 100)}`;
const connectUrl = `${protocol}://${host}:${port}`;
const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: "hello",
  password: "test",
  reconnectPeriod: 1000,
});

console.log("Connecting...");

function subscribeToTopic(topic) {
  client.subscribe(topic, { qos: 0 }, (error) => {
    if (error) {
      console.error("Subscribe error:", error);
    } else {
      console.log(`Subscribed to topic: ${topic}`);
    }
  });
}

client.on("connect", () => {
  console.log("Connected", new Date().toISOString());
  subscribeToTopic("node/join");
});

client.on("message", (topic, message) => {
  if (topic === "node/join") {
    const node = message.toString();
    console.log(`join: ${node}`);
    subscribeToTopic(`${node}/#`);
  } else {
    console.log(`${topic}: ${message.toString()}`);
  }
});

// read keybaord input
var stdin = process.stdin;
if (process.stdin.isTTY) {
  process.stdin.setRawMode(true);
}
stdin.resume();
stdin.setEncoding("utf8");
stdin.on("data", function (key) {
  if (key === "=\n") {
    console.log("speed up");
  } else if (key === "-\n") {
    console.log("slow down");
  }
});
