/**
 * 代理 addEventListener 方法
 * 并通过 Event.isTrusted 判断是否为用户操作
 */

// https://css-tricks.com/capturing-all-events/

const { antiChromeDebugger } = require('./anti-debugger');
const { setEventBorder } = require('./event-border');
const eventCounter = require('./event-counter');

const isDebug = () => location && location.href.includes('debug=true');

const init = () => {

  const isDebugEnv = isDebug();

  antiChromeDebugger();

  const listener = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function (eventName, eventHandler) {

    if (isDebugEnv) {
      setEventBorder(this, eventName, eventHandler);
      eventCounter.addListenerCount(eventName, eventHandler);
    }

    listener.call(this, eventName, function (event) {

      if (isDebugEnv) {
        eventCounter.addEventCount(eventName, eventHandler);
      }

      const isTrusted = event.isTrusted;
      if (isTrusted) {
        if (isDebugEnv && !['mousemove', 'pointermove', 'scroll'].includes(eventName)) {
          console.log(`[ok] is trusted user action : ${eventName}`);
        }
        eventHandler(event);
      } else {
        event.preventDefault();
        event.stopPropagation();
        if (isDebugEnv) {
          console.error(`[error] script action: ${eventName}`);
        }
        // window.close();
      }

    });
  };

  // const dispatch = EventTarget.prototype.dispatchEvent;
  // EventTarget.prototype.dispatchEvent = function (event) {
  //   const isTrusted = event.isTrusted;
  //   if (isTrusted) {
  //     dispatch(event);
  //   } else {
  //     console.warn(`[dispatchEvent] script action: ${eventName}`);
  //   }
  // };
}

init();
