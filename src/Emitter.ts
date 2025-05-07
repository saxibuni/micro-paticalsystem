import { Pool } from "./Pool";
import Partical, { IBounds, IParticalOptions } from "./Partical";
import { shareTicker as ticker } from "./Ticker";
import IFactory from "./IFactory";

export class Emitter<T extends Partical<any>, C>  {
  /**
   * 粒子对象池
   */
  protected pool: Pool<T>;

  /**
   * 粒子舞台边界，矩形区域
   */
  protected bounds: IBounds;
  
  /**
   * 粒子对象数组
   */
  protected particals: T[] = [];
  
  /**
   * 粒子对象工厂，用于添加粒子对象到舞台中，移除粒子对象到舞台中
   */
  protected factory: IFactory<T, C>;

  /**
   * 粒子对象参数
   */
  protected particalOptions: IParticalOptions;

  /**
   * 舞台中最大粒子数量，舞台中粒子数量超过该值时，则不在产生粒子
   */
  protected maxCount: number;

  /**
   * 粒子发射器节流参数，该值越大，产生粒子的速度越慢
   */
  protected throttle: number;

  /**
   * 粒子发射器边界内边距，会扩大舞台边界区域，以解决粒子发射器边界问题
   * 解决粒子中心点移动到bounds设置的边界外面时，但是整个粒子并没有离开bounds边界就回收粒子的问题
   */
  protected padding: [number, number, number, number];

  /**
   * 是否手动发射粒子
   */
  protected isManual: boolean = false;
  
  /**
   * 粒子发射器更新计数器，用于节流
   */
  private updateCounter: number = 0; 
  
  /**
   * 是否暂停了粒子系统
   */
  private hasPause: boolean = false;

  
  constructor(options: IEmitterOptions<T, C>) {
    this.pool = new Pool<T>(options.poolSize);
    this.bounds = options.bounds;
    this.factory = options.factory;
    this.particalOptions = options.particalOptions;
    this.maxCount = options.maxCount;
    this.throttle = options.throttle || 1;
    this.padding  = options.padding || [0, 0, 0, 0];
    this.isManual = !!options.isManual;

    ticker.add(this.render, this);
    this.hasPause = false;
  }

  /**
   * 渲染方法，用于更新粒子系统状态
   */
  protected render() {
    this.particals.forEach(p => p.update());

    for (let len = this.particals.length, i = len - 1; i >= 0; i--) {
      let p = this.particals[i];
      if (!this.checkInStage(p)) {
        this.removePartical(p);
      }
    }

    if (!this.isManual) {
      this.createPartical();
      this.updateCounter++;
    }
  }

  /**
   * 创建粒子对象
   */
  public createPartical(){
    if (this.updateCounter % this.throttle != 0) return;
    if (this.particals.length == this.maxCount) return;

    let p = this.pool.create(() => this.factory.newPartical());
    p.reset(this.particalOptions);
    this.particals.push(p);

    this.factory.addToStage(p.el);
  }

  /**
   * 从舞台中移除粒子对象
   */
  protected removePartical(partical: T) {
    let idx = this.particals.indexOf(partical);
    this.particals.splice(idx, 1);

    this.pool.recyle(partical);

    this.factory.removeFromStage(partical.el);
  }

  /**
   * 检查是粒子否在舞台内
   */
  protected checkInStage(partical: T) {
    let { x, y, width, height } = this.bounds;
    y -= this.padding[0]
    width += this.padding[1] * 2
    height += this.padding[2] * 2
    x -= this.padding[3]

    if (partical.x > x && partical.x < width + x && partical.y > y && partical.y < y + height) return true
    return false
  }

  /**
   * 更新发射器参数
   * @param {IEmitterOptions<T, C>} options
   */
  public updateEmitterOptions(options: IEmitterOptions<T, C>) {
    this.throttle = options.throttle || this.throttle;
    this.bounds = options.bounds || this.bounds;

    this.particalOptions = Object.assign(this.particalOptions, options.particalOptions);
  }

  /**
   * 暂停粒子系统
   */
  public pause() {
    ticker.remove(this.render, this);
    this.hasPause = true;
  }

  /**
   * 恢复粒子系统
   */
  public resume() {
    if (!this.hasPause) return;
    ticker.add(this.render, this);
    this.hasPause = false;
  }

  /**
   * 销毁粒子发射器
   */
  public destroy() {
    this.pause();

    this.factory.removeAll();
    this.updateCounter = 0;
    this.particals = [];
    this.pool.list = [];
  }

}

export interface IEmitterOptions<T, C> {
  /**
   * 是否手动发射粒子
   */
  isManual?: boolean
  
  /**
   * 粒子对象池大小
   */
  poolSize?: number;
  
  /**
   * 最大粒子数量
   */
  maxCount?: number;

  /**
   * 粒子舞台边界，矩形区域
   */
  bounds?: IBounds;

  /**
   * 粒子发射器边界内边距，会扩大舞台边界区域，以解决粒子发射器边界问题
   * 解决粒子中心点移动到bounds设置的边界外面时，但是整个粒子并没有离开bounds边界就回收粒子的问题
   */
  padding?: [number, number, number, number];
  
  /**
   * 粒子对象工厂，用于添加粒子对象到舞台中，移除粒子对象到舞台中
   */
  factory?: IFactory<T, C>;
  
  /**
   * 粒子发射器节流参数，该值越大，产生粒子的速度越慢
   */
  particalOptions: IParticalOptions;
  
  /**
   * 粒子发射器节流参数，该值越大，产生粒子的速度越慢
   */
  throttle?: number;
}