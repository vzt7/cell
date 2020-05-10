
const isQuiz = () => location.hash.startsWith('/learn/quiz');

const init = () => {
  const el = document.querySelector('.j-quizPool');
  if (!el) {
    return setTimeout(init, 200);
  }

  const mutationObserver = new MutationObserver((list, ob) => {
      list.forEach(el => {
          el.addedNodes.forEach(node => {
              console.log(11, node);
          });
      });
  });

  mutationObserver.observe(el, { childList: true, subtree: true });
  window.addEventListener('hashchange', () => {
    if (isQuiz()) {
      mutationObserver.disconnect();
    } else {
      mutationObserver.observe(el, { childList: true, subtree: true });
    }
  }, false);

}

init();
