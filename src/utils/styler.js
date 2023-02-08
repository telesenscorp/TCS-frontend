const styler = (styles = []) => {
  let res = [];
  styles.forEach((style) => {
    if (typeof style === "string") {
      res.push(style);
    } else if (typeof style === "object") {
      for (const [key, value] of Object.entries(style)) {
        if (value) res.push(key);
      }
    }
  });
  return res.join(" ");
};
export default styler;
