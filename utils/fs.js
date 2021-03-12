const { promiseFy } = require("./promisefy");
const fs = require("fs");

module.exports = {
  writeFile(...args) {
    return promiseFy(fs.writeFile, args);
  },
};
