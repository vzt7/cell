/**
 * 覆写 addEventListener 方法
 * 并通过 Event.isTrusted 判断是否执行事件
 */

// https://css-tricks.com/capturing-all-events/

const isDebug = () => location.hash.includes('eventBorder');
const setDebugerBorder = (node, eventHandler) => {
  if (node && node.nodeType === Node.ELEMENT_NODE) {
    node.style.border = '2px solid pink';
    node.title = eventHandler.toString();
  }
}

const init = () => {
  const listenerCount = {};
  const eventCount = {};
  const isDebugEnv = isDebug();

  const listener = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function (eventName, eventHandler) {

    if (isDebugEnv) {
      setDebugerBorder(this, eventHandler);
    }

    listenerCount[eventName] = (listenerCount[eventName] || 0) + 1;
    listener.call(this, eventName, function (event) {
      eventCount[eventName] = (eventCount[eventName] || 0) + 1;
      const isTrusted = event.isTrusted;
      // console.log(eventName, isTrusted, event.target);
      if (isTrusted) {
        eventHandler(event);
      } else {
        event.preventDefault();
        event.stopPropagation();
        console.error(`[addEventListener] script action: ${eventName}`);
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
