const path = require('path');
const fs = require('fs');
const scriptPath = path.resolve('scripts');
const saveFile = require('../utils/save');

const getBanUrl = (code) => {
  const userScriptComments = code.toString().match(/@\w*\s*([\*|https?]*?:.+)/g);
  const list = userScriptComments.filter(row => row.match(/@require|@namespace/));
  return list;
}

const getHostBlackList = () => {
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

getHostBlackList();


// 获取脚本关键字
const esprima = require('esprima');
const astUtils = require('esprima-ast-utils');
const getKeyWordsBlackList = () => {
  const fileNames = fs.readdirSync(scriptPath);
  const scriptList = fileNames
    .filter(fileName => fileName.includes('399230')) // 目前只针对该脚本处理
    .map(fileName => {
      return fs.readFileSync(`${scriptPath}/${fileName}`);
    });
  const keyWords = scriptList
    .reduce((res, scriptCode) => {
      const ast = esprima.parseScript(scriptCode.toString());
      try {
        astUtils.traverse(ast, (node, parent, property, index, depth) => {
          if (node.type === 'CallExpression') {
            const args = node.arguments || [];
            const validWords = args.map(argNode => argNode.value).filter(val => val && typeof val === 'string' && val.match(/[\u4e00-\u9fa5]/));
            res.words.push(...validWords);
          }
        });
      } catch(err) {
        console.error(err);
      }
      return res;
    }, {});
  const result = [...new Set(keyWords)];
  saveFile('keyWords.json', JSON.stringify(result.map(str => encodeURIComponent(str))));
  return result;
}
// getKeyWordsBlackList();

module.exports = {
  getHostBlackList,
  getKeyWordsBlackList,
};
