import { IFactory, Partical } from "micro-particalsystem";

class DomPartical extends Partical<HTMLElement>  { 
  protected createElement() {
    this.el = document.createElement("div");
    this.el.className = "partical snow";
  }

  protected resetElement() {
    this.el.style.transform = ``;
  }

  protected updateElement() {
    this.el.style.transform = `translate3d(${this.x}px,${this.y}px, 0) scale(${this.scale})`;
  }
}


class DomFactory extends IFactory<DomPartical, HTMLElement> {
  constructor(public container: HTMLElement) {
    super(container);
  }
  newPartical(): DomPartical {
    return new DomPartical();
  }

  addToStage(obj: HTMLElement): void {
    this.container.appendChild(obj);
  }

  removeFromStage(obj: HTMLElement): void {
    this.container.removeChild(obj);
  }
  removeAll() {
    this.container.innerHTML = "";
  }
}

export {  DomPartical, DomFactory }