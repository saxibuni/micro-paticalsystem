export default class IFactory<T, C> {

  constructor(public container: C) {
    this.container = container;
  }

  newPartical(): T {
    return new Object() as T;
  }

  addToStage(obj: C) { }

  removeFromStage(obj: C) { }

  removeAll() { }
}