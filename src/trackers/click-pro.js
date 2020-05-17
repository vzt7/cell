/**
 * 直接置空对应 dom 的 click 方法
 */

// Event.isTrusted


const getContainerEl = () => document.querySelector('#courseLearn-inner-box');

// 选择题容器 class
const resetClickFunc = (node, proxyClick = () => {}) => {
  if (node.click) {
    node.click = proxyClick;
  }
  if (node.children) {
    return Array.from(node.children).map(childNode => resetClickFunc(childNode));
  }
};

// 禁用掉下面方法
// https://stackoverflow.com/questions/34853588/how-to-trigger-an-istrusted-true-click-event-using-javascript
const antiDebugger = () => {
  if (!window.chrome) {
    return setTimeout(antiDebugger, 1000);
  }
  Object.defineProperty(window.chrome, 'debugger', {
    writable: false,
    configurable: false,
    get: () => undefined,
  });
};

const init = (count = 100) => {
  const el = getContainerEl();
  if (el) {
    return setTimeout(init, count > 30 ? 200 : 800);
  }
  //
}


module.exports = {
  init,
}
