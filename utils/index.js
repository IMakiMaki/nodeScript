/**
 * 返回一个指定范围的随机数
 * @param {Number} min 最小值
 * @param {Number} max 最大值
 * @returns {Number}
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 返回一个指定范围的整数数组
 * @param {Number} min 最小值
 * @param {Number} max 最大值
 * @returns {Number}
 */
function getIntArray(min = 0, max) {
  return Array.from({ length: max - min + 1 }).reduce((prev, next, index) => {
    return [...prev, index + min];
  }, []);
}

module.exports = {
  getRandomInt,
  getIntArray,
};
