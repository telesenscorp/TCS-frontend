const toPath = (v = "", s = 1) => Array(s).fill("../").join("") + v;
export default toPath;
