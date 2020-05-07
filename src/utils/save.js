const path = require('path');
const fs = require('fs');

const relPath = path.resolve('scripts');

const saveFile = (subPath, data) => {
  const decodeSubPath = decodeURIComponent(subPath);
  console.log(`save to dist: ${decodeSubPath}`);
  try {
    const distPath = `${relPath}/${decodeSubPath}`;
    fs.writeFile(distPath, data, (err) => {
      if (err) throw err;
      console.log(`[ok] write file: ${distPath}`);
    });
  } catch(err) {
    throw new Error(err);
  }
}


module.exports = saveFile;
