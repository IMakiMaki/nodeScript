// 从svg文件内读取内容来创建jsx文件
const { readDir, writeFile } = require("./utils/fs");
const { readFileSync } = require("fs");
const path = require("path");
const { downloadsPath } = require("./local/index");

const SVG_DIR = path.join(__dirname, "./zondicons/");

// 生成camelCase风格的变量名
const fileName2ConstName = (name) => {
  if (typeof name !== "string") {
    throw "error";
  }
  let retName = "";
  // 去除文件名中的空格 & 首位的数字
  const fileName = name.replace(/\s/g, "").replace(/^\d/, "");
  if (!fileName.includes("-")) {
    retName = `${fileName[0].toLowerCase()}${fileName.slice(1)}`;
  } else {
    const words = fileName.split("-");
    retName = words.reduce((prev, current, index) => {
      return `${prev}${
        index === 0 ? current.toLowerCase() : current[0].toUpperCase() + current.slice(1)
      }`;
    }, "");
  }
  try {
    // try转换后的变量名是否符合规则
    eval(`var ${retName}`);
  } catch {
    throw `Convert error, file name '${name}' can not be converted to a js variable`;
  }
  return retName;
};

// 生成jsx
const createJsxStr = (name, elementStr) => {
  return `export const ${name} = () => {return (<div>${elementStr}</div>)}`;
};

const genSvgJsx = async () => {
  const files = await readDir(SVG_DIR);
  // 过滤出Svg
  const svgFiles = files.filter((file) => /.svg$/.test(file));
  // 同步读取文件名以及文件内容
  const dataArray = svgFiles.reduce((prev, fileName) => {
    // 得到转化后的变量名
    const constName = fileName2ConstName(fileName.split(".")[0]);
    if (prev[constName]) {
      console.error(
        `Duplicated name - '${fileName}'(will be converted to '${constName}'),the last one will replace the previous one.`
      );
    }
    return {
      ...prev,
      [constName]: readFileSync(path.join(SVG_DIR, fileName)).toString("utf-8"),
    };
  }, {});
  const strArray = Object.keys(dataArray).map((key) => createJsxStr(key, dataArray[key]));
  writeFile(`${downloadsPath}/svgIcon.js`, strArray.join("\n"))
    .then(() => {
      console.log(`文件已被保存\n目录:${downloadsPath}/svgIcon.js`);
    })
    .catch((err) => {
      throw err;
    });

  return strArray;
};

genSvgJsx();
