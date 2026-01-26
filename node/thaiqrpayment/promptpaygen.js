const QRCode = require("qrcode");
const crc16 = require("crc/crc16ccitt");
require("dotenv").config();

// ref thai qr specification
// https://www.bot.or.th/content/dam/bot/fipcs/documents/FPG/2562/ThaiPDF/25620084.pdf

/**
 * @param {string} payString payment string excluding 'tag 63'
 * @param {string} filename
 */
function generateQr(payString, filename) {
  payString = `${payString}6304`;
  const crc = crc16(payString).toString(16);
  const crc4Digit = ("0000" + crc).slice(-4);
  const final = `${payString}${crc4Digit.toUpperCase()}`;

  console.log("generate qr: ", final);
  const encoder = new TextEncoder();
  const bytes = encoder.encode(final);
  QRCode.toFile(`output/${filename}.png`, [
    { data: new Uint8ClampedArray(bytes), mode: "byte" },
  ]);
}

/**
 * @param {string} nationalId 13 digit
 * @param {string} amount
 */
function payToNationalId(nationalId, amount) {
  const recipient = `0213${nationalId}`;
  genPromptPay(recipient, amount, "nationalid");
}

/**
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
  const b = "A000000677010111"; // constant for merchant present code
  const c = "5802";
  const d = "TH54";

  // make it 'xx' forexample 4 becomes '04' ref https://stackoverflow.com/questions/8513032/less-than-10-add-0-to-number
  let e = ("0" + amount.length).slice(-2);
  const f = "5303";
  const g = "764";
  const combine = `${a}${b}${recipient}${c}${d}${e}${amount}${f}${g}`;
  generateQr(combine, `promptpaygen-${fileSuffix}`);
}

/**
 * @param {string} amount
 * @param {string} info
 */
function payToMerchant(amount, info) {
  const a = "000201010211";

  // merchant identifier
  const merchantId = `0016A000000677010112011501075370008820502196Q310060J02851011JH03${info.length}${info}`;
  const b = `30${merchantId.length}${merchantId}`;

  const c = "5303764";

  // amount
  const amountLength = ("0" + amount.length).slice(-2);
  const d = `54${amountLength}${amount}`;

  const e = "5802TH";

  // additional data template
  const f = "622407200000IIoV07pAebtA1hf1";

  // gencrc
  const combine = `${a}${b}${c}${d}${e}${f}`;

  generateQr(combine, "promptpaygen-merchant");
}

// input
const amount = "3.00";
payToPhone(process.env.PHONE_NUMBER, amount);
payToNationalId(process.env.NATIONAL_ID, amount);
payToMerchant(amount, "welcome-to-thailand");
