// 禁用 chrome.debugger
// https://stackoverflow.com/questions/34853588/how-to-trigger-an-istrusted-true-click-event-using-javascript

const isChrome = navigator && navigator.userAgent.includes('Chrome');
const antiChromeDebugger = () => {
  if (!window.chrome) {
    return isChrome && setTimeout(antiDebugger, 1000);
  }
  if (window.chrome.debugger) {
    Object.defineProperty(window.chrome, 'debugger', {
      writable: false,
      configurable: false,
      get: () => undefined,
    });
  }
};

module.exports = {
  antiChromeDebugger
};
