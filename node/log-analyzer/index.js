import { countCharactersInLog } from "./count.js";
import { writeCsv } from "./utils/csv.js";
import { listFiles } from "./utils/file.js";
import * as path from "path";

/** this code will read .log file and only count characters from the line of specified log date */
const FOLDER_PATH = "C:\\Users\\a000084\\Downloads\\20240719\\20240719";
const LOG_DATE = "2024-07-19";

// MAIN
async function main() {
  const paths = listFiles(FOLDER_PATH);

  const countResult = [];
  let totalSize = 0;
  for (const filePath of paths) {
    const count = await countCharactersInLog(filePath, LOG_DATE);
    const filename = path.relative(FOLDER_PATH, filePath);
    const size = (count / 1024 / 1024).toFixed(2);
    totalSize += parseInt(size);
    countResult.push({ filename, size });
  }

  const header = ["filename", "size (MB)"];
  writeCsv("result.csv", header, countResult);

  console.log(`data = ${LOG_DATE}, total size (MB) = ${totalSize}`);
}

// RUN
main();
