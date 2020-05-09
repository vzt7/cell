/**
 * 监听 DOM 变化 - 通过某些特征值判断是否为第三方脚本插入
 */

const blackList = require('../../scripts/keyWords.json').map(str => decodeURIComponent(str)).filter(str => str.length > 2);
const domWhiteList = {
  id: [
    ''
  ],
  class: [
    'j-selectlist',
    'ux-share_up',
    'timeSet',
    'fixed',
    'j-editArea',
    'j-label',
    'colordown',
    'down',
    'win-mask',
    'win-dialog',
    'ux-edu-h5pdf-fullWindow',
    'loading',
    ''
  ]
}

// const MAX_MATCH_KEYWORDS_COUNT = ~~(blackList.length / 2); // 取屏蔽列表中的一半作为阈值

const domTracker = {
  records: new Set(),
  getChildrenValue: (children, key, filterFunc = node => node) => {
    if (!children || children.length <= 0) return [];
    const validChildren = Array.from(children).filter(child => filterFunc(child));
    return validChildren.map(node => key ? node[key] : node).concat(...validChildren.map(node => domTracker.getChildrenValue(node.childNodes, key, filterFunc)));
  },
  // record: (data) => {
  //   this.records.add(data);
  //   console.log(`records: `, this.records);
  //   if (this.records.length >= MAX_MATCH_KEYWORDS_COUNT) {
  //     console.log('max overflow alert!!');
  //     const cb = this.callback;
  //     const validPage = location.hash.includes('#/learn/examlist') || location.hash.includes('#/learn/quiz');
  //     if (Object.prototype.toString.call(cb) === '[object Function]') {
  //       cb.call(window, this.records);
  //     }
  //   }
  // },
  init: () => {
    this.mutationObserver = new MutationObserver((list, ob) => {
      list.forEach(el => {
        if (el && el.addedNodes) {
          // text check
          const textNodes = domTracker.getChildrenValue(el.addedNodes, null, (node) => {
            return node.nodeName === '#text' && node.wholeText && blackList.includes(node.wholeText);
          });
          if (textNodes && textNodes.length > 0) {
            textNodes.map(node => {
              console.log(`remove dom by text: ${textNodes}`);
              node.parentNode.removeChild(node);
            });
          }

          // styles check
          const allNodes = domTracker.getChildrenValue(el.addedNodes);
          const isElement = node => !node.nodeName.startsWith('#');
          const isAbsolutePosition = node => {
            const styles = window.getComputedStyle(node);
            return styles.position === 'absolute' || styles.position === 'fixed';
          };
          const abnormalNodes = allNodes.filter(node => isElement(node) && isAbsolutePosition(node));
          if (abnormalNodes && abnormalNodes.length > 0) {
            abnormalNodes.map(node => {
              // domTracker.records(node);
              const styles = window.getComputedStyle(node);
              const isWhite = styles.class.split(' ').find(className => domWhiteList.class.includes(className));
              if (!isWhite && styles.zIndex > 999) {
                console.warn(`remove dom by styles: `, node);
                node.parentNode.removeChild(node);
              }
            });
          }
        }
      });
    });
    this.mutationObserver.observe(document.body, { childList: true, subtree: true });
  }
}

domTracker.init();

module.exports = domTracker;
