
const eventCounter = (function() {
  const listenerCount = {};
  const eventCount = {};
  const addListenerCount = (eventName, eventHandler) => {
    listenerCount[eventName] = (listenerCount[eventName] || 0) + 1;
  };
  const addEventCount = (eventName, eventHandler) => {
    eventCount[eventName] = (eventCount[eventName] || 0) + 1;
  };
  const getListenerCount = () => listenerCount;
  const getEventCount = () => eventCount;
  return {
    addListenerCount,
    addEventCount,
    getListenerCount,
    getEventCount,
  }
})();

module.exports = eventCounter;
