import { Chart } from "chart.js";
import { EncoderData } from "../encoder";
import { EVENT_ENCODER_DATA } from "../event";
import { awaitDelay, downloadCsv } from "../util";
import { setPwm } from "./pwm";

const SETTLE_TIME = 3000; //ms
const COLLECT_TIME = 2000; //ms
let data: AnalysisData[] = [];

document.getElementById("pwmAnalysisRun").onclick = () => {
  const values = preparePwmValues();
  runPwm(values);
};

document.getElementById("pwmAnalysisDownload").onclick = () => {
  downloadCsv(data);
};

const preparePwmValues = () => {
  const max = parseInt(
    (document.getElementById("pwmAnalysisMax") as HTMLInputElement).value
  );
  const step = parseInt(
    (document.getElementById("pwmAnalysisStep") as HTMLInputElement).value
  );
  const values = [];

  //max to min
  for (let pwm = max; pwm > -255; pwm -= step) {
    if (pwm <= 0) {
      values.push(0);
      break;
    }
    values.push(pwm);
  }

  //reverse temp
  const temp = values.slice();
  for (let i = temp.length - 1; i >= 0; --i) {
    values.push(temp[i]);
  }
  return values;
};

const runPwm = async (pwmValues: number[]) => {
  data = [];
  const chart = createChart([]);

  for (const pwm of pwmValues) {
    setPwm(pwm);
    await awaitDelay(SETTLE_TIME);
    const velocity = await collectAverageVelocity();
    const dataPoint: AnalysisData = {
      pwm,
      velocity,
    };
    data.push(dataPoint);
    updateChart(chart, dataPoint);
  }
  setPwm(0);
};

const collectAverageVelocity = async () => {
  return new Promise<number>((resolve) => {
    let count = 0;
    let sum = 0;

    const onEncoderData = (e: CustomEvent) => {
      const data = e.detail as EncoderData;
      sum += data.vel;
      ++count;
    };

    document.addEventListener(EVENT_ENCODER_DATA, onEncoderData);

    setTimeout(() => {
      document.removeEventListener(EVENT_ENCODER_DATA, onEncoderData);
      resolve(sum / count);
    }, COLLECT_TIME);
  });
};

type AnalysisData = {
  pwm: number;
  velocity: number;
};

const createChart = (data: AnalysisData[]) => {
  const container = document.getElementById("pwmAnalysis");
  const hasCanvas = container.lastChild instanceof HTMLCanvasElement;
  if (hasCanvas) {
    container.removeChild(container.lastChild);
  }

  const canvas = document.createElement("canvas") as HTMLCanvasElement;
  container.appendChild(canvas);

  const chart = new Chart(canvas, {
    type: "line",
    data: {
      labels: data.map((row) => row.pwm),
      datasets: [
        {
          label: "vel",
          data: data.map((row) => row.velocity),
        },
      ],
    },
  });

  return chart;
};

const updateChart = (chart: Chart, newData: AnalysisData) => {
  chart.data.labels.push(newData.pwm);
  chart.data.datasets.forEach((dataset) => {
    if (dataset.label === "vel") dataset.data.push(newData.velocity);
  });

  chart.update();
};
