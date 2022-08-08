const express = require('express');
const { createServer } = require('http');
const WebSocket = require('ws');

const app = express();
const port = 5001;

const server = createServer(app);
const wss = new WebSocket.Server({ server });

// const StorageManager = require('./StorageManager/StorageManager')
// const Box = require('./StorageManager/Box');
// var storageManager = new StorageManager()
// storageManager.addBox(new Box(1, 'fruit'))
// storageManager.addBox(new Box(2, 'iphone'))
// storageManager.startEmulation()
// storageManager.addSubscriber(ws)

wss.on('connection', function (ws) {
  const uid = getUniqueID()
  console.log("client joined", uid);
  ws.uid = uid

  ws.on('message', function (data) {
    if (typeof (data) === "string") {
      // client sent a string
      console.log("string received from client -> '" + data + "'");
    } else {
      console.log("binary received from client -> " + Array.from(data).join(", ") + "");
    }
  });

  ws.on('close', function () {
    console.log("client left");
  });
});

server.listen(port, function () {
  console.log(`Listening on http://localhost:${port}`);
});

const getUniqueID = function () {
  function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4();
};


  // // send "hello world" interval
  // const textInterval = setInterval(() => ws.send("hello world!"), 100);

  // // send random bytes interval
  // const binaryInterval = setInterval(() => ws.send(crypto.randomBytes(8).buffer), 110);