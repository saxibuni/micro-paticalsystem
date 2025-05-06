import "./RequestAnimationFramePolyfill";

export class Ticker {
  private listeners: IListeners[] = [];

  constructor() {
    this.initTicker();
  }

  private initTicker() {
    let ticker = () => {
      this.listeners.forEach(listener => {
        let { fn, context } = listener;
        fn.call(context);
      });
      globalThis.requestAnimationFrame(ticker);
    }

    ticker();
  }

  public add(fn: Function, context: any) {
    this.listeners.push({
      fn,
      context
    });
  }

  public remove(fn: Function, context: any) {
    for (let i = 0, len = this.listeners.length; i < len; i++) {
      let listener = this.listeners[i];
      if (fn === listener.fn && context === listener.context) {
        this.listeners.splice(i, 1);
        break;
      }
    }
  }
}

interface IListeners {
  fn: Function;
  context: any;
}

let shareTicker = new Ticker();

export { shareTicker };
export default Ticker;