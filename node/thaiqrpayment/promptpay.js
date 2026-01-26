const QRCode = require("qrcode");

// original string generate from https://promptpay.io/
const asciiString =
  "00020101021129370016A000000677010111011300669245317755802TH54076000.00530376463049B3B";
const encoder = new TextEncoder();
const bytes = encoder.encode(asciiString);
QRCode.toFile("output/promptpay.png", [
  { data: new Uint8ClampedArray(bytes), mode: "byte" },
]);
