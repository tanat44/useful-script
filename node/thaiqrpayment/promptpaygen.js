const QRCode = require("qrcode");
const crc16 = require("crc/crc16ccitt");
require("dotenv").config();

/**
 *
 * @param {string} nationalId 13 digit
 * @param {string} amount
 */
function payToNationalId(nationalId, amount) {
  const recipient = `0213${nationalId}`;
  genPromptPay(recipient, amount, "nationalid");
}

/**
 *
 * @param {string} phoneNumber
 * @param {string} amount
 */
function payToPhone(phoneNumber, amount) {
  phoneNumber = phoneNumber.substr(1);
  const recipient = `01130066${phoneNumber}`;
  genPromptPay(recipient, amount, "phone");
}

/**
 * @param {string} recipient 15 digit
 * @param {string} amount
 * @param {string} fileSuffix
 */
function genPromptPay(recipient, amount, fileSuffix) {
  // constant
  const a = "00020101021129370016";
  const b = "A000000677010111";
  const c = "5802";
  const d = "TH54";

  // make it 'xx' forexample 4 becomes '04' ref https://stackoverflow.com/questions/8513032/less-than-10-add-0-to-number
  let e = ("0" + amount.length).slice(-2);
  const f = "5303";
  const g = "764";
  const h = "6304";
  const combine = `${a}${b}${recipient}${c}${d}${e}${amount}${f}${g}${h}`;
  const crcResult = crc16(combine).toString(16);

  // generate promptpay qr
  const payString = `${combine}${crcResult.toUpperCase()}`;
  console.log("result", payString);
  const encoder = new TextEncoder();
  const bytes = encoder.encode(payString);
  QRCode.toFile(`output/promptpay-${fileSuffix}.png`, [
    { data: new Uint8ClampedArray(bytes), mode: "byte" },
  ]);
}

// input
const phoneNumber = process.env.PHONE_NUMBER;
const amount = "2.00";
payToPhone(phoneNumber, amount);
payToNationalId(process.env.NATIONAL_ID, amount);
