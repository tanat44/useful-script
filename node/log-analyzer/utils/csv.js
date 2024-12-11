import * as fs from "fs";

export async function writeCsv(filename, header, data) {
  let text = header.join(",") + "\n";
  data.forEach((row) => {
    const values = [];
    Object.entries(row).forEach(([key, value]) => {
      values.push(value);
    });
    text += values.join(",") + "\n";
  });
  await fs.promises.writeFile(filename, text, "utf8");
}
