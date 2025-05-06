
// Date.now
if (!(Date.now && Date.prototype.getTime)) {
  Date.now = function now() {
    return new Date().getTime();
  };
}

// performance.now
if (!(globalThis.performance && globalThis.performance.now)) {
  var startTime = Date.now();

  if (!globalThis.performance) {
    globalThis.performance = {};
  }

  globalThis.performance.now = function () {
    return Date.now() - startTime;
  };
}

// requestAnimationFrame
var lastTime = Date.now();

if (!globalThis.requestAnimationFrame) {
  var ONE_FRAME_TIME = 16;
  globalThis.requestAnimationFrame = function (callback) {
    if (typeof callback !== 'function') {
      throw new TypeError(callback + 'is not a function');
    }

    var currentTime = Date.now();
    var delay = ONE_FRAME_TIME + lastTime - currentTime;

    if (delay < 0) {
      delay = 0;
    }

    lastTime = currentTime;

    return setTimeout(function () {
      lastTime = Date.now();
      callback(globalThis.performance.now());
    }, delay);
  };
}

if (!globalThis.cancelAnimationFrame) {
  globalThis.cancelAnimationFrame = function (id) {
    return clearTimeout(id);
  };
}