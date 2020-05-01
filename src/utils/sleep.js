
const sleep = async (seconds) => {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, seconds);
  });
}

module.exports = sleep;
