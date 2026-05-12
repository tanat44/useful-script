import { Object3D, Quaternion } from "three";
import { DurationCounter } from "./DurationCounter";
import "./style.css";
import { download } from "./utils";

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
let csvData = "time,c1,c2,gain\n";

setInterval(() => {
  const c1 = counter1.getAverageDurations();
  const c2 = counter2.getAverageDurations();
  sumGain += c1 / c2;
  ++count;
  const gain = sumGain / count;
  csvData += `${count},${c1},${c2},${gain}\n`;
  console.log(
    "counter1",
    c1.toFixed(2),
    "counter2",
    c2.toFixed(2),
    "total gain",
    gain.toFixed(2),
  );
}, 1000);

function downloadCsv() {
  download(csvData, "hello.csv", "csv");
}

document.addEventListener("mousemove", mouseMove);
document
  .getElementById("downloadButton")
  ?.addEventListener("click", downloadCsv);
