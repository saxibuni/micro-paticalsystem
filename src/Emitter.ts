import { Pool } from "./Pool";
import Partical, { IBounds, IParticalOptions } from "./Partical";
import { shareTicker, shareTicker as ticker } from "./Ticker";
import IFactory from "./IFactory";

export class Emitter<T extends Partical, C>  {
  protected pool: Pool<T>;
  protected bounds: IBounds;
  protected particals: T[] = [];
  protected factory: IFactory<T, C>;
  protected particalOptions: IParticalOptions;

  protected maxCount: number; //粒子最多有多少个

  protected throttle: number;
  protected updateCounter: number = 0; 
  protected hasStop: boolean;

  constructor(options: IEmitterOptions<T, C>) {
    this.pool = new Pool<T>(options.poolSize);
    this.bounds = options.bounds;
    this.factory = options.factory;
    this.particalOptions = options.particalOptions;
    this.maxCount = options.maxCount;
    this.throttle = options.throttle || 1;

    ticker.add(this.update, this);
    this.hasStop = false;
  }

  protected update() {
    this.particals.forEach(p => p.update());

    for (let len = this.particals.length, i = len - 1; i >= 0; i--) {
      let p = this.particals[i];
      if (!this.checkInStage(p)) {
        this.removePartical(p);
      }
    }

    this.createPartical();
    this.updateCounter++;
  }

  protected createPartical(){
    if (this.updateCounter % this.throttle != 0) return;
    if (this.particals.length == this.maxCount) return;

    let p = this.pool.create(() => this.factory.newPartical());
    p.reset(this.particalOptions);
    this.particals.push(p);

    this.factory.addToStage(p.el);
  }

  protected removePartical(partical: T) {
    let idx = this.particals.indexOf(partical);
    this.particals.splice(idx, 1);

    this.pool.recyle(partical);

    this.factory.removeFromStage(partical.el);
  }

  protected checkInStage(partical: T) {
    let { x, y, width, height } = this.bounds;

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
   * 停止粒子发射器
   */
  public stop() {
    ticker.remove(this.update, this);
    this.hasStop = true;
  }

  public resume() {
    if (!this.hasStop) return;
    ticker.add(this.update, this);
    this.hasStop = false;
  }

  /**
   * 销毁粒子发射器
   */
  public destroy() {
    this.stop();

    this.factory.removeAll();
    this.updateCounter = 0;
    this.particals = [];
    this.pool.list = [];
  }

}

interface IEmitterOptions<T, C> {
  poolSize?: number;
  maxCount?: number;
  bounds?: IBounds;
  factory?: IFactory<T, C>;
  particalOptions?: IParticalOptions;
  throttle?: number;
}