// 从svg文件内读取内容来创建jsx文件
const { readDir, writeFile } = require("../utils/fs");
const { readFileSync } = require("fs");
const path = require("path");
const { downloadsPath } = require("../local/index");

/**
 * 将文件名转化为合法的js变量名
 * @param {string} name 输入的字符串
 * @returns 变量名
 */
const fileName2ConstName = (name) => {
  if (typeof name !== "string") {
    throw "error";
  }
  let retName = "";
  const constName = name
    .trim() // 首位空格去除
    .replace(/[^A-Za-z_$\d]/g, "-") // 分词
    .replace(/^[^A-Za-z_$]/, ""); // 将不符合Js变量规范的字符全部清除
  if (!constName.includes("-")) {
    retName = `${constName[0].toLowerCase()}${constName.slice(1)}`;
  } else {
    const words = constName.split("-").filter((word) => !!word);
    retName = words.reduce((prev, current, index) => {
      return `${prev}${
        index === 0 ? current.toLowerCase() : current[0].toUpperCase() + current.slice(1)
      }`;
    }, "");
  }
  try {
    // try转换后的变量名是否符合规则 其实应该不会有漏网之🐟了 保险起见
    eval(`var ${retName}`);
    console.log(`'${name}' => '${retName}'`);
  } catch {
    throw `Convert error, file name '${name}(be converted to '${constName}')' can not be converted to a js variable`;
  }
  return retName;
};

/**
 * 生成jsx
 * @param {string} name 组件名
 * @param {string} elementStr 读取的svg内容
 * @param {boolean} isTsx 是否生成tsx
 * @returns {string} 输出组件定义字符串
 */
const createJsxStr = (name, elementStr, isTsx) => {
  return isTsx
    ? `export const ${name} = (props) => {return (<div>${elementStr}</div>)}`
    : `export const ${name} = (props) => {return (<div>${elementStr}</div>)}`;
};

/**
 * 读取文件夹内的.svg文件，输出jsx组件
 * @param {string} dir 文件夹路径
 * @param {boolean} isTsx 是否为tsx
 * @returns 文件都已经有了 没什么好返回的了
 */
const genSvgJsx = async (dir, isTsx = false) => {
  const directory = path.resolve(process.cwd(), dir);
  const files = await readDir(directory);
  // 过滤出Svg
  const svgFiles = files.filter((file) => /.svg$/.test(file));
  // 同步读取文件名以及文件内容
  const dataArray = svgFiles.reduce((prev, fileName) => {
    // 得到转化后的变量名
    const reg = new RegExp(/(.*).svg$/);
    const constName = fileName2ConstName(fileName.match(reg)[1]);
    if (prev[constName]) {
      console.error(
        `Duplicated name - '${fileName}'(will be converted to '${constName}'),the last one will replace the previous one.`
      );
    }
    return {
      ...prev,
      [constName]: readFileSync(path.join(directory, fileName)).toString("utf-8"),
    };
  }, {});
  const strArray = Object.keys(dataArray).map((key) => createJsxStr(key, dataArray[key], isTsx));
  writeFile(`${downloadsPath}/svgIcon.js`, strArray.join("\n"))
    .then(() => {
      console.log(`文件已被保存\n目录:${downloadsPath}/svgIcon.js`);
    })
    .catch((err) => {
      throw err;
    });
};

genSvgJsx("./zondicons/", true);
