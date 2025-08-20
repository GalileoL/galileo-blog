export class Semaphore {
  constructor(max) {
    this.max = max;
    this.count = 0;
    this.queue = [];
  }

  async acquire() {
    if (this.count < this.max) {
      this.count++;
      return;
    }
    await new Promise((res) => this.queue.push(res));
    this.count++;
  }

  release() {
    this.count--;
    if (this.queue.length > 0) {
      const next = this.queue.shift();
      if (next) next();
    }
  }
}
