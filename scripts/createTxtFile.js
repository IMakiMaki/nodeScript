const { writeFile } = require("../utils/fs");
const { getRandomInt } = require("../utils/index");
const { getUnicodeArray } = require("../utils/unicode");

const { downloadsPath } = require("../local/index");

const data = new Uint8Array(Buffer.from(createFileStr(1000000 / 3)));
writeFile(`${downloadsPath}/文件.txt`, data)
  .then(() => {
    console.log(`文件已被保存\n目录:${downloadsPath}/文件.txt`);
  })
  .catch((err) => {
    throw err;
  });

/**
 * 创建文本字符串
 * @param {Number} lines 需要的行数
 * @param {Number} strLength 每一行字符串长度
 * @param {Array<Number>} codeArr Unicode编码范围数组
 * @returns {String}
 */
function createFileStr(lines, strLength = 32, codeArr = getUnicodeArray(["a-z", "0-9"])) {
  return Array.from({ length: lines })
    .map(() => {
      return Array.from({ length: strLength })
        .map(() => {
          const randomIndex = getRandomInt(0, codeArr.length - 1);
          const randomStr = String.fromCharCode(codeArr[randomIndex]);
          return randomStr;
        })
        .join("");
    })
    .join("\n");
}
