const char = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const chaArr = char.length;
export default function uniqueId(i = 0, dif = 0, prefix = "k") {
  let key = "";
  if (i > chaArr) {
    key = char[Math.floor(i / chaArr)];
  }
  return `${prefix}-${key + char[i] + char[dif] + "-" + i}`;
}
