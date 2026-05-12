import Chart from "chart.js/auto";

let chart: Chart | undefined = undefined;

export function createChart(data: object[], xLabel: string, yLabels: string[]) {
  if (chart) {
    chart.destroy();
  }
  const ctx = document.getElementById("chartCanvas") as HTMLCanvasElement;
  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: data.map((row: any) => row[xLabel]),
      datasets: yLabels.map((label) => ({
        label,
        data: data.map((row: any) => row[label]),
      })),
    },
  });
}
