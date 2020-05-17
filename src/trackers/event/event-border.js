
const setEventBorder = (node, eventName, eventHandler) => {
  if (node && node.nodeType === Node.ELEMENT_NODE) {
    node.style.border = '2px solid pink';
    node.title = `[${eventName}] ${eventHandler.toString()}`;
  }
}

module.exports = {
  setEventBorder,
};
