export class Pool<T> {
  public list: T[];
  private max: number;

  constructor(max: number = 30) {
    this.list = [];
    this.max = max;
  }

  public create(fn: () => T) {
    let item: T;
    if (this.list.length > 0) {
      item = this.list.shift();
    } else {
      item = fn();
    }
    return item;
  }

  public recyle(item: T) {
    if (this.list.includes(item)) return;

    if (this.list.length <= this.max) {
      this.list.push(item);
    }
  }
}