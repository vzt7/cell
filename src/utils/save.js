const path = require('path');
const fs = require('fs');

const relPath = path.resolve('dist');

const saveToDist = (subPath, data) => {
  console.log('save to dist:');
  try {
    const distPath = `${relPath}/${subPath}`;
    fs.writeFile(distPath, data, (err) => {
      if (err) throw err;
      console.log(`[ok] write file: ${distPath}`);
    });
  } catch(err) {
    throw new Error(err);
  }
}


module.exports = saveToDist;
