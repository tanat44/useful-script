import { sameDay } from "./utils/date.js";
import * as fs from "fs";
import * as readline from "readline";

export async function countCharactersInLog(filePath, date) {
  if (date) date = new Date(date);
  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let countChars = 0;
  let countError = 0;

  for await (const line of rl) {
    try {
      const json = JSON.parse(line);
      const logDate = new Date(json.timestamp);
      if (date) {
        if (sameDay(date, logDate)) {
          countChars += line.length;
        }
      } else {
        countChars += line.length;
      }
    } catch {
      countError += 1;
    }
  }

  if (countError > 0)
    console.warn(`path ${filePath} has ${countError} parse errors`);

  return countChars;
}
