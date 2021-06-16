module.exports = {
  promiseFy(func, args) {
    if (typeof func !== "function") {
      throw "promiseFy can only receive function";
    }
    return new Promise((resolve, reject) => {
      func(...args, (err, res) => {
        if (!err) {
          resolve(res);
        } else {
          reject(err);
        }
      });
    });
  },
};
