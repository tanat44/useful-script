const QRCode = require("qrcode");
const crc16 = require("crc/crc16ccitt");

// original
const asciiString =
  "00020101021129370016A000000677010111011300669245317755802TH54076000.00530376463049B3B";

// try matching check crc16
const withoutCrc =
  "00020101021130710016A000000677010112011501075370008820502196Q310060J02851011JH0305TANUT53037645406555.005802TH622407200000IIoV07pAebtA1hf16304";
const crcResult = crc16(withoutCrc).toString(16);
console.log("crc result", crcResult);
const promptPayCode = `${withoutCrc}${crcResult.toUpperCase()}`;
const encoder = new TextEncoder();
const bytes = encoder.encode(promptPayCode);
QRCode.toFile("output/crcgen-test.png", [
  { data: new Uint8ClampedArray(bytes), mode: "byte" },
]);
