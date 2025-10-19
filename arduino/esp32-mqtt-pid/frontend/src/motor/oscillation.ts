import { EncoderData } from "../encoder";
import { EVENT_ENCODER_DATA, EVENT_MOTOR_OSCILLATE } from "../event";

let target: number = 0;
let count: number = 0;
let isOver: boolean | undefined = undefined;

export const updateSetPos = (value: number) => {
  target = value;
  count = 0;
  isOver = undefined;
};

document.addEventListener(EVENT_ENCODER_DATA, (e: CustomEvent) => {
  updatePosition(e.detail as EncoderData);
});

const updatePosition = (value: EncoderData) => {
  if (isOver === undefined) {
    isOver = value.raw > target;
    return;
  }

  if (value.raw > target && !isOver) {
    ++count;
    isOver = true;
    document.dispatchEvent(new CustomEvent(EVENT_MOTOR_OSCILLATE));
  } else if (value.raw < target && isOver) {
    ++count;
    isOver = false;
    document.dispatchEvent(new CustomEvent(EVENT_MOTOR_OSCILLATE));
  }

  const dom = document.getElementById("oscillationCount");
  dom.innerText = count.toString();
};

let lastValue: number | undefined = undefined;

export type OscillationResult = {
  durationMs: number;
  oscillation: number;
};

export const waitForStable = (maxWaitMs: number) => {
  return new Promise<OscillationResult>((resolve, reject) => {
    let timeout: NodeJS.Timeout = null;
    const startTime = Date.now();
    const onEncoderData = (e: CustomEvent) => {
      const update = e.detail as EncoderData;
      const newValue = update.raw;
      if (!lastValue) {
        lastValue = newValue;
        return;
      }

      const delta = Math.abs(newValue - target);

      if (newValue === lastValue && delta < 200) {
        document.removeEventListener(EVENT_ENCODER_DATA, onEncoderData);
        clearTimeout(timeout);
        resolve({
          durationMs: Date.now() - startTime,
          oscillation: count,
        });
      }
      lastValue = newValue;
    };

    document.addEventListener(EVENT_ENCODER_DATA, onEncoderData);

    timeout = setTimeout(() => {
      document.removeEventListener(EVENT_ENCODER_DATA, onEncoderData);
      reject();
    }, maxWaitMs);
  });
};
