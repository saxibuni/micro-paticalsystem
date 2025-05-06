export default class Partical {
  protected angle: number; //运动角度
  protected speedStep: number; //运动速度
  protected scaleStep: number; //缩放速度
  protected velocity: IPoint; //速度向量
  protected acceleration: IPoint; //加速度向量
  protected spawnRegion: IBounds; //粒子产生区域

  public x: number;
  public y: number;
  public scale: number = 1;

  public el: any;

  constructor() {
    this.createElement();
  }

  protected createElement() {}
  protected resetElement() {}
  protected updateElement() {}

  public update() {
    this.velocity.x += this.acceleration.x;
    this.velocity.y += this.acceleration.y;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.scale += this.scaleStep;

    this.updateElement();
  }

  public reset(options: IParticalOptions) {
    this.angle = this.getRandomValue(options.angle);
    this.speedStep = this.getRandomValue(options.speedStep);
    this.acceleration = options.acceleration || { x: 0, y: 0 };
    this.velocity = {
      x: this.speedStep * Math.sin(this.angle),
      y: -this.speedStep * Math.cos(this.angle) //大部分坐标系统Y轴方向是向下的
    }
    this.scaleStep = this.getRandomValue(options.scaleStep);
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
  angle?: IRange;
  speedStep?: IRange;
  scaleStep?: IRange;
  acceleration?: IPoint;
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