export class Partical<T extends any> {
  /**
   * 运动角度
   */
  protected angle: number;

  /**
   * 运动速度
   */
  protected speedStep: number;

  /**
   * 缩放速度
   */
  protected scaleStep: number;

  /**
   * 速度向量
   */
  protected velocity: IPoint;

  /**
   * 加速度向量
   */
  protected acceleration: IPoint;

  /**
   * 粒子产生区域
   */
  protected spawnRegion: IBounds;

  /**
   * 粒子节点x轴坐标值
   */
  public x: number;

  /**
   * 粒子节点y轴坐标值
   */
  public y: number;

  /**
   * 粒子节点缩放值
   */
  public scale: number = 1;

  /**
   * 粒子对象节点
   */
  public el: T;

  constructor() {
    this.createElement();
  }

  /**
   * 创建粒子对象节点
   */
  protected createElement() {}

  /**
   * 重置粒子对象节点
   */
  protected resetElement() {}

  /**
   * 更新粒子对象节点
   */
  protected updateElement() {}

  public update() {
    this.velocity.x += this.acceleration.x;
    this.velocity.y += this.acceleration.y;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.scale += this.scaleStep;

    this.updateElement();
  }

  /**
   * 重置粒子对象属性参数
   */
  public reset(options: IParticalOptions) {
    this.angle = this.getRandomValue(options.angle);
    this.speedStep = this.getRandomValue(options.speedStep);
    this.acceleration = options.acceleration || { x: 0, y: 0 };
    this.velocity = {
      x: this.speedStep * Math.cos(this.angle),
      y: this.speedStep * Math.sin(this.angle)
    }
    this.scaleStep = this.getRandomValue(options.scaleStep);
    this.scale = 1
    this.spawnRegion = options.spawnRegion || {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    }

    let { x, y } = this.spawnPoint;
    this.x = x;
    this.y = y;

    this.resetElement();
    this.updateElement();
  }

  private getRandomValue(range: IRange = { min: 0, max: 0 }) {
    let { min, max } = range;
    let value = min + (max - min) * Math.random();
    return value;
  }

  protected get spawnPoint() {
    let { x, y, width, height } = this.spawnRegion;

    return {
      x: x + Math.random() * width,
      y: y + Math.random() * height
    }
  }

}

export interface IParticalOptions {
  /**
   * 运动角度范围
   */
  angle?: IRange;

  /**
   * 初始运动速度范围
   */
  speedStep?: IRange;

  /**
   * 缩放增量范围
   */
  scaleStep?: IRange;

  /**
   * 加速度范围
   */
  acceleration?: IPoint;

  /**
   * 粒子产生的区域
   */
  spawnRegion?: IBounds;
}

export interface IPoint {
  x: number;
  y: number;
}

export interface IBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface IRange {
  min: number;
  max: number;
}