const path = require('path');
const fs = require('fs');
const scriptPath = path.resolve('scripts');
const saveFile = require('../utils/save');

const getBanUrl = (code) => {
  const userScriptComments = code.toString().match(/@\w*\s*([\*|https?]*?:.+)/g);
  const list = userScriptComments.filter(row => row.match(/@require|@namespace/));
  return list;
}

const getBanList = () => {
  const fileNames = fs.readdirSync(scriptPath);
  const list = fileNames
    .filter(fileName => fileName.startsWith('script-code-'))
    .map(fileName => {
      console.log(`[ing] parse script code ... [file name : ${fileName}]`)
      const scriptCode = fs.readFileSync(`${scriptPath}/${fileName}`, 'utf-8');
      const result = getBanUrl(scriptCode.toString());
      return result;
    })
    .reduce((res, curr) => {
      res.push(...curr);
      return res;
    }, []);
  const banList = [...new Set(list)];
  saveFile('ban.json', JSON.stringify(banList));
  return banList;
}

// getBanList();

module.exports = getBanList;
