const { getIntArray } = require("./index");

const UNICODE_MAP = new Map([
  ["a-z", getIntArray(97, 122)],
  ["0-9", getIntArray(48, 57)],
]);

/**
 * 返回unicode编码的数组
 * @param {String | String[]} key 需要的字符集key或者key List
 * @returns {Number[]}
 */
function getUnicodeArray(key) {
  if (typeof key === "string") {
    return UNICODE_MAP.get(key) || [];
  } else if (Array.isArray(key) && key.every((k) => typeof k === "string")) {
    return key.reduce((prev, next) => {
      if (UNICODE_MAP.has(next)) {
        return [...prev, ...UNICODE_MAP.get(next)];
      } else {
        return prev;
      }
    }, []);
  } else {
    throw "function getUnicodeArray must receive string or string[]";
  }
}

module.exports = {
  getUnicodeArray,
};
