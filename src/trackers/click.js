/**
 * 监听 mouse click - 通过[点击元素位置信息]及[光标位置]判断是否为正常点击
 */
const MAX_ABNORMAL_CLICK_COUNT = 1;
const MAX_RECORD_LEN = 7;


// 选择题容器 class
const panelClassName = 'j-choicebox';
// 是否为选择题 item label
const isLabelNode = (node, count = 10) =>
  node &&
  count > 0 && (
    (node.nodeName === 'LABEL' && node.className.includes('u-tbl') && node) ||
    isLabelNode(node.parentNode, count - 1)
  );
// 是否为选择题 item ipnut
const isInputNode = (node) =>
  node &&
  node.nodeName === 'INPUT' &&
  node.className.includes('u-tbi') &&
  node;


// tracker
const clickTracker = {
  queue: [],
  record: (data) => {
    if (clickTracker.queue.length >= MAX_RECORD_LEN) {
      clickTracker.queue.shift();
    }
    clickTracker.queue.push(data);
    console.log('ALL: ', clickTracker.queue);
  },
  unrecord: (itemIndex = 0) => {
    clickTracker.queue.splice(itemIndex, 1);
  },
  check: () => {
    const checkedQueue = clickTracker.queue.map(data => {
      const isValidClick =
        data.x >= data.targetX1 - 1 &&
        data.x <= data.targetX2 + 1 &&
        data.y >= data.targetY1 - 1 &&
        data.y <= data.targetY2 + 1;
      return {
        isValidClick,
        ...data,
      }
    });
    // 含有异常点击且超过指定阈值时
    const abnormalArr = checkedQueue.filter(data => !data.isValidClick);
    if (abnormalArr.length >= MAX_ABNORMAL_CLICK_COUNT) {
      // 从记录队列中移除
      abnormalArr.forEach(data => {
        const index = clickTracker.queue.findIndex(item => item === data.item);
        clickTracker.unrecord(index);
      });
      // 执行回调
      const cb = clickTracker.callback;
      if (Object.prototype.toString.call(cb) === '[object Function]') {
        cb.call(window, abnormalArr);
      }
      // 支持批量回调
      if (Array.isArray(cb)) {
        cb.forEach(c => c.call(window, abnormalArr));
      }
      return true;
    }
    return false;
  },
  handler: (event) => {
    const e = event || window.event;

    // 某些特殊情况过滤掉
    if (!clickTracker.presetFitler(e)) {
      return;
    }

    const targetPos = e.target && e.target.getBoundingClientRect();
    const posData = {
      x: e.clientX,
      y: e.clientY,
      targetX1: targetPos.left,
      targetY1: targetPos.top,
      targetX2: targetPos.right,
      targetY2: targetPos.bottom,
    };
    const validData = Object.values(posData).every(val => val >= 0); // 点击时鼠标移出 client 放开会出现负数
    if (!validData) return;

    clickTracker.record({
      ...posData,
      target: e.target,
    });
    clickTracker.check();
  },
  // handler 过滤
  presetFitler: (e) => {

    const isClickOnQuizDoingPanel = e.path.find(el => el && el.className && el.className.includes(panelClassName));
    if (!isClickOnQuizDoingPanel) return false;

    const styles = window.getComputedStyle(e.target);
    if (e.target.style.display === 'none' || styles.display === 'none') {
      return false;
    }

    const prevTrackerItem = clickTracker.queue[clickTracker.queue.length - 1];
    const prevTarget = prevTrackerItem && prevTrackerItem.target;
    // 点击 label 会触发两次，第二次为 input
    const labelNode = prevTarget && isLabelNode(prevTarget);
    if (prevTarget && labelNode && isInputNode(e.target)) {
      const labelForId = labelNode.getAttribute('for');
      if (labelForId === e.target.id) {
        // 正常点击时的特殊情况：
        // 由上一次点击 label 会触发对应 input click，不做记录
        return false;
      }
    }

    return true;
  },
  // 点击异常时触发
  callback: (abnormalArr) => {
    console.warn('点击异常', abnormalArr);
    abnormalArr.forEach(item => {
      const el = item.target;
      if (isInputNode(el) && el.checked === true) {
        el.checked = false;
        console.log('reset input checked');
      }
      console.log(item.target);
    });
  },
  init: () => {
    window.addEventListener('click', clickTracker.handler);
  },
  reset: () => {
    window.removeEventListener('click', clickTracker.handler);
  },
};

clickTracker.init();

module.exports = clickTracker;
