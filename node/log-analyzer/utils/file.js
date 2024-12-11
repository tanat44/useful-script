import * as fs from "fs";
import * as path from "path";

export function isFile(path) {
  return fs.lstatSync(path).isFile();
}

export function listFiles(inputPath) {
  if (isFile(inputPath)) return [inputPath];

  // path is folder
  const fileNames = [];
  const files = fs.readdirSync(inputPath);
  for (const file of files) {
    const thisPath = path.join(inputPath, file);
    if (isFile(thisPath)) fileNames.push(thisPath);
    else fileNames.push(...listFiles(thisPath));
  }
  return fileNames;
}
