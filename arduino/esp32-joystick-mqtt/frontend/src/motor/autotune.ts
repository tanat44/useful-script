import { getTime } from "../util";
import { OscillationResult, waitForStable } from "./oscillation";
import { setMotorPos } from "./position";
import { getPidValue, setPositionPid } from "./positionpid";

type AutoTuneResult = {
  target: number;
  success: boolean;
  detail: OscillationResult | null;
};

document.getElementById("kpRangeRun").onclick = async () => {
  const from = parseFloat(
    (document.getElementById("kpRangeFrom") as HTMLInputElement).value
  );
  const to = parseFloat(
    (document.getElementById("kpRangeTo") as HTMLInputElement).value
  );
  const step = parseFloat(
    (document.getElementById("kpRangeStep") as HTMLInputElement).value
  );

  for (let i = from; i <= to; i += step) {
    await setPositionPid({ kp: i, ki: 0, kd: 0 });
    await testOscillation();
  }
};

export const testOscillation = async () => {
  // show info
  const parent = document.getElementById("autoTuneResult");
  const dom = document.createElement("div");
  const pid = getPidValue();
  dom.innerText = `started autotune at ${getTime()} pid = ${pid.kp.toFixed(
    2
  )}, ${pid.ki.toFixed(2)}, ${pid.kd.toFixed(2)}`;
  parent.appendChild(dom);

  const targets = [-1, 1];
  for (const target of targets) {
    setMotorPos(target);
    const result: AutoTuneResult = {
      target,
      success: false,
      detail: null,
    };

    try {
      result.detail = await waitForStable(10000);
      result.success = true;
    } catch {
      result.success = false;
    }
    showResult(result);
  }
};

const showResult = (result: AutoTuneResult) => {
  const parent = document.getElementById("autoTuneResult");
  const dom = document.createElement("div");
  let detail = "";
  if (result.detail) {
    detail = `duration: ${(result.detail.durationMs / 1000).toFixed(
      1
    )} cycles: ${result.detail.oscillation}`;
  }
  dom.innerText = `target: ${result.target} ${detail}`;
  dom.className = result.success ? "success" : "fail";
  parent.appendChild(dom);
};
