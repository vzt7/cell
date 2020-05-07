const MAX_ABNORMAL_CLICK_COUNT = 3;

const pos = [];
const clickTracker = {
  record: (data) => {
    if (pos.length >= MAX_ABNORMAL_CLICK_COUNT) {
      pos.shift();
    }
    pos.push(data);
    console.log(pos);
  },
  check: () => {
    for(let i = 0; i < pos.length; i ++ ) {
      const currPos = pos[i];
      const compareArr = [];
      for(let j = i; j < pos.length - i; j ++ ) {
        const isValidClick =
          currPos.x >= currPos.targetX1 &&
          currPos.x <= currPos.targetX2 &&
          currPos.y >= currPos.targetY1 &&
          currPos.y <= currPos.targetY2;
        const isSamePos = pos[j].x === currPos.x && pos[j].y === currPos.y;
        if (!isSamePos) break;
        compareArr.push({
          isValidClick,
          isSamePos,
        });
      }
      console.log(compareArr);
      // 超过指定阈值且含有异常点击时
      if (compareArr.length >= MAX_ABNORMAL_CLICK_COUNT && compareArr.find(item => !item.isValidClick)) {
        console.warn('点击异常', pos);
        return true;
      }
    }
    return false;
  },
  handler: (event) => {
    const e = event || window.event;
    const targetPos = e.target && e.target.getBoundingClientRect();
    clickTracker.record({
      x: e.clientX,
      y: e.clientY,
      targetX1: targetPos.left,
      targetY1: targetPos.top,
      targetX2: targetPos.left + targetPos.width,
      targetY2: targetPos.top + targetPos.height,
    });
    clickTracker.check();
  },
  init: () => {
    if (window) {
      window.addEventListener('click', clickTracker.handler);
    } else {
      setTimeout(() => initTracker(), 1500);
    }
  },
};

clickTracker.init();
