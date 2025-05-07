import { Emitter } from 'micro-particalsystem';
import { DomFactory, DomPartical } from './DomManager';
import './index.scss';

const container = document.querySelector<HTMLElement>('.app');
const factory = new DomFactory(container);

let currentEmitter: Emitter<DomPartical, HTMLElement> = null
function createSnowEffect() {
  const snowEmitter = new Emitter<DomPartical, HTMLElement>({
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
  const boomEmitter = new Emitter<DomPartical, HTMLElement>({
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
  const fireworksEmitter = new Emitter<DomPartical, HTMLElement>({
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

document.querySelector('.tool').addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  currentEmitter?.destroy()

  switch(target.id) {
    case 'snow':
      currentEmitter = createSnowEffect()
      break;
    case 'boom':
      currentEmitter = createBoomEmitter()
      break;
    case 'fireworks':
      currentEmitter = createFireworksEmitter()
      break;
  }
});

