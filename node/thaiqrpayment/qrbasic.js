const QRCode = require("qrcode");

const asciiString = "Hello, World!";
const encoder = new TextEncoder();
const bytes = encoder.encode(asciiString);
QRCode.toFile("output/qrbasic.png", [
  { data: new Uint8ClampedArray(bytes), mode: "byte" },
]);
