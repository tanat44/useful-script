import { Object3D, Quaternion } from "three";
import { DurationCounter } from "./DurationCounter";
import "./style.css";
import { download } from "./utils";
import { createChart } from "./chart";

const object = new Object3D();

const counter1 = new DurationCounter(() => {
  const q = new Quaternion();
  q.set(23, 45, 3, 23);
  object.setRotationFromQuaternion(q);
});

const globalQ = new Quaternion();
const counter2 = new DurationCounter(() => {
  globalQ.set(23, 45, 3, 23);
  object.setRotationFromQuaternion(globalQ);
});

function mouseMove(e: MouseEvent) {
  counter1.trigger();
  counter2.trigger();
}

let sumGain = 0;
let count = 0;
let data: any[] = [];
let csvData = "time,c1,c2,gain\n";

setInterval(() => {
  const c1 = counter1.getAverageDurations();
  const c2 = counter2.getAverageDurations();
  sumGain += c1 / c2;
  ++count;
  const gain = sumGain / count;

  // csv
  csvData += `${count},${c1},${c2},${gain}\n`;

  // chart
  const dataRow: any = {};
  dataRow.time = count;
  dataRow.c1 = c1;
  dataRow.c2 = c2;
  dataRow.gain = gain;
  data.push(dataRow);

  // console
  console.log(
    "counter1",
    c1.toFixed(2),
    "counter2",
    c2.toFixed(2),
    "total gain",
    gain.toFixed(2),
  );
  updateChart();
}, 1000);

function downloadCsv() {
  download(csvData, "hello.csv", "csv");
}

function updateChart() {
  createChart(data, "time", ["c1", "c2", "gain"]);
}

document.addEventListener("mousemove", mouseMove);
document
  .getElementById("downloadButton")
  ?.addEventListener("click", downloadCsv);
document
  .getElementById("updateChartButton")
  ?.addEventListener("click", updateChart);
