const original = [
  "navy-green",
  "dark-blend-a",
  "bright-green",
  "light-green",
  "navy-blue",
  "bright-blue",
  "light-blue",
  "soft-blue",
  "grey-blue",
  "midnight-blue",
  "light-grey",
  "grey",
  "yellow",
  "white",
  "black",
  "orange",
  "transparent",
];
const colorList = [...original, ...original.map((v) => "gu-" + v), ...original.map((v) => "gd-" + v)];
export default colorList;
