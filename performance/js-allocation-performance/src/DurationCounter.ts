const REPEAT = 1e4;

export class DurationCounter {
  job: () => void;
  durations: number[] = [];

  constructor(job: () => void) {
    this.job = job;
  }

  getAverageDurations() {
    return this.durations.reduce((a, b) => a + b) / this.durations.length;
  }

  trigger() {
    const startTime = new Date().getTime();
    for (let i = 0; i < REPEAT; ++i) this.job();
    const endTime = new Date().getTime();
    this.addDuration(endTime - startTime);
  }

  addDuration(newValue: number) {
    if (this.durations.length > 300) {
      this.durations.shift();
    }
    this.durations.push(newValue);
  }
}
