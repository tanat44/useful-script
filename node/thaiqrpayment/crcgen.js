const QRCode = require("qrcode");
const crc16 = require("crc/crc16ccitt");

// original
const asciiString =
  "00020101021129370016A000000677010111011300669245317755802TH54076000.00530376463049B3B";

// try matching check crc16
const withoutCrc =
  "00020101021129370016A000000677010111011300669245317755802TH54076000.0053037646304";
const crcResult = crc16(withoutCrc).toString(16);
console.log("crc result", crcResult);
const promptPayCode = `${withoutCrc}${crcResult.toUpperCase()}`;
const encoder = new TextEncoder();
const bytes = encoder.encode(promptPayCode);
QRCode.toFile("output/crcgen-test.png", [
  { data: new Uint8ClampedArray(bytes), mode: "byte" },
]);
