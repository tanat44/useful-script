import { Chart } from "chart.js/auto";
import { updateRawPosition } from "./oscillation";

export type EncoderData = {
  time: number;
  raw: number;
  vel: number;
  acc: number;
};

export const updateEncoderData = (text: string) => {
  const elements = text.split("\t");
  const raw = parseInt(elements[0]);
  const thisData: EncoderData = {
    time: time++,
    raw,
    vel: parseInt(elements[1]),
    acc: parseInt(elements[2]),
  };

  updateRawPosition(raw);
  if (running) updateChart(thisData);
};

let time = 0;
let running = true;
const data: EncoderData[] = [];

const pauseButton = document.getElementById("encoderChartPause");
pauseButton.onclick = () => {
  if (running) pauseButton.innerText = "resume";
  else pauseButton.innerText = "pause";
  running = !running;
};

const chart = new Chart(
  document.getElementById("encoderPlot") as HTMLCanvasElement,
  {
    type: "line",
    data: {
      labels: data.map((row) => row.time),
      datasets: [
        {
          label: "raw",
          data: data.map((row) => row.raw),
        },
        {
          label: "vel",
          data: data.map((row) => row.vel),
        },
        {
          label: "acc",
          data: data.map((row) => row.acc),
        },
      ],
    },
  }
);

const updateChart = (newData: EncoderData) => {
  if (chart.data.labels.length > 30) {
    chart.data.labels.shift();
    chart.data.datasets.forEach((dataset) => {
      dataset.data.shift();
    });
  }

  chart.data.labels.push(newData.time);
  chart.data.datasets.forEach((dataset) => {
    if (dataset.label === "raw") dataset.data.push(newData.raw);
    else if (dataset.label === "vel") dataset.data.push(newData.vel);
    else if (dataset.label === "acc") dataset.data.push(newData.acc);
  });

  chart.update();
};
