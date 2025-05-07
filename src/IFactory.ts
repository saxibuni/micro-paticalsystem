export class IFactory<T, C> {

  constructor(public container: C) {
    this.container = container;
  }

  /**
   * 实例化粒子对象
   */
  newPartical(): T {
    return new Object() as T;
  }

  /**
   * 粒子对象节点添加到舞台中
   */
  addToStage(obj: C) { }

  /**
   * 从舞台中移除粒子对象节点
   */
  removeFromStage(obj: C) { }

  /**
   * 从舞台中移除所有粒子对象节点
   */
  removeAll() { }
}