import { Partical, IFactory } from "micro-particalsystem";
import * as PIXI from "pixi.js";
import particalPNG from "./assets/circle.svg";

class PixiPartical extends Partical<PIXI.Sprite> {
  protected createElement(): void {
    const texture = PIXI.Texture.from(particalPNG);
    this.el = new PIXI.Sprite(texture);
    this.el.anchor.set(0.5);
  }

  protected resetElement(): void {
    this.el.x = 0;
    this.el.y = 0;
    this.el.scale.set(1)
  }

  protected updateElement(): void {
    this.el.position.set(this.x, this.y);
    this.el.scale.set(this.scale);
  }
}

class PixiFactory extends IFactory<PixiPartical, PIXI.Container> {
  constructor(public container: PIXI.Container) {
    super(container);
  }

  newPartical(): PixiPartical {
    return new PixiPartical();
  }

  addToStage(obj: PIXI.Sprite): void {
    this.container.addChild(obj);
  }

  removeFromStage(obj: PIXI.Sprite): void {
    this.container.removeChild(obj);
  }

  removeAll(): void {
    this.container.removeChildren();
  }

}

export { PixiPartical, PixiFactory };