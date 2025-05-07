import { Emitter } from '@/Emitter';
import { PixiFactory, PixiPartical } from './PixiManager';
import * as PIXI from 'pixi.js';
import "./index.scss"


// 创建 PIXI 应用
const app = new PIXI.Application<HTMLCanvasElement>({
  width: 800,
  height: 600,
  backgroundAlpha: 0,
  view: document.getElementById('canvas') as HTMLCanvasElement
});
// debug
globalThis.__PIXI_APP__ = app;


// 创建粒子容器
const particleContainer = new PIXI.Container();
app.stage.addChild(particleContainer);
app.stage.eventMode = 'static';
app.stage.hitArea = app.screen;

// 创建工厂对象
const factory = new PixiFactory(particleContainer);

// 当前粒子发射器
let currentEmitter: Emitter<PixiPartical, PIXI.Container> | null = null;

function createSnowEffect() {
  const snowEmitter = new Emitter<PixiPartical, PIXI.Container>({
    poolSize: 200,
    maxCount: 200,
    padding: [100, 100, 100, 100],
    bounds: {
      x: 0,
      y: 0,
      width: 800,
      height: 600
    },
    factory,
    particalOptions: {
      angle: { min: Math.PI / 2, max: Math.PI / 2 },
      speedStep: { min: 1, max: 2 },
      scaleStep: { min: 0, max: 0.01 },
      acceleration: { x: 0, y: 0.02 },
      spawnRegion: {
        x: 0,
        y: -50,
        width: 800,
        height: 0
      }
    },
    throttle: 2
  });

  return snowEmitter
}

function createBoomEmitter() {
  const boomEmitter = new Emitter<PixiPartical, PIXI.Container>({
    poolSize: 200,
    maxCount: 200,
    padding: [50, 50, 50, 50],
    bounds: {
      x: 0,
      y: 0,
      width: 800,
      height: 600
    },
    factory,
    particalOptions: {
      angle: { min: 0, max: Math.PI * 2 },
      speedStep: { min: 1, max: 2 },
      scaleStep: { min: 0, max: 0.01 },
      spawnRegion: {
        x: 400,
        y: 300,
        width: 0,
        height: 0
      }
    },
  });

  return boomEmitter
}

function createFireworksEmitter() {
  const fireworksEmitter = new Emitter<PixiPartical, PIXI.Container>({
    poolSize: 100,
    maxCount: 100,
    padding: [50, 50, 50, 50],
    bounds: {
      x: 0,
      y: 0,
      width: 800,
      height: 600
    },
    factory,
    particalOptions: {
      angle: { min: -Math.PI * 0.65, max: -Math.PI * 0.35 },
      speedStep: { min: 6, max: 8 },
      acceleration: { x: 0, y: 0.06 },
      spawnRegion: {
        x: 400,
        y: 620,
        width: 0,
        height: 0
      }
    },
    throttle: 2
  });
  
  return fireworksEmitter;
}

function createMouseFollowEmitter() {
  const boomEmitter = new Emitter<PixiPartical, PIXI.Container>({
    poolSize: 200,
    maxCount: 200,
    padding: [50, 50, 50, 50],
    bounds: {
      x: 0,
      y: 0,
      width: 800,
      height: 600
    },
    factory,
    particalOptions: {
      angle: { min: Math.PI / 2, max: Math.PI / 2 },
      speedStep: { min: 1, max: 2 },
      scaleStep: { min: 0, max: 0.01 },
      acceleration: { x: 0, y: 0.05 },
      spawnRegion: {
        x: 400,
        y: 300,
        width: 0,
        height: 0
      }
    },
    throttle: 3
  });

  return boomEmitter
}

// 取消鼠标跟随句柄
let cancelMouseFollowFn: Function;
// 鼠标跟随
function mouseFollow() {
  const mousemoveFn = (event: PIXI.FederatedMouseEvent) => { 
    currentEmitter.updateEmitterOptions({
      particalOptions: {
        spawnRegion: {
          x: event.clientX,
          y: event.clientY,
          width: 0,
          height: 0
        }
      }
    })
  }
  app.stage.addEventListener('pointermove', mousemoveFn)

  return () => { 
    app.stage.removeEventListener('pointermove', mousemoveFn)
    cancelMouseFollowFn = null;
  }
}


// 取消鼠标点击句柄
let cancelMouseClickFn: Function = null;

function mouseClick() {
  const mouseclickFn = (event: PIXI.FederatedMouseEvent) => { 
    currentEmitter.updateEmitterOptions({
      particalOptions: {
        spawnRegion: {
          x: event.clientX,
          y: event.clientY,
          width: 0,
          height: 0
        }
      }
    })
    Array.from({ length: 15 }).forEach(() => {
      currentEmitter.createPartical()
    })
  }
  app.stage.addEventListener('pointertap', mouseclickFn)

  return () => { 
    app.stage.removeEventListener('pointertap', mouseclickFn)
    cancelMouseFollowFn = null;
  }
}
function createMouseClickEmitter() {
  const boomEmitter = new Emitter<PixiPartical, PIXI.Container>({
    poolSize: 200,
    maxCount: 200,
    padding: [50, 50, 50, 50],
    bounds: {
      x: 0,
      y: 0,
      width: 800,
      height: 600
    },
    factory,
    particalOptions: {
      angle: { min: 0, max: Math.PI * 2 },
      speedStep: { min: 1, max: 3 },
      spawnRegion: {
        x: 400,
        y: 300,
        width: 0,
        height: 0
      }
    },
    isManual: true
  });

  return boomEmitter
}

// 修改事件监听器以适应 PIXI 渲染循环
document.querySelector('.tool').addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  currentEmitter?.destroy();
  cancelMouseFollowFn?.();
  cancelMouseClickFn?.();

  switch(target.id) {
    case 'snow':
      currentEmitter = createSnowEffect();
      break;
    case 'boom':
      currentEmitter = createBoomEmitter();
      break;
    case 'fireworks':
      currentEmitter = createFireworksEmitter();
      break;
    case 'mousefollow':
      currentEmitter = createMouseFollowEmitter();
      cancelMouseFollowFn = mouseFollow();
      break;
    case 'mouseclick':
      currentEmitter = createMouseClickEmitter();
      cancelMouseClickFn = mouseClick();
      break;
  }
});

