import { File_URL } from "../common/constants";
const parse = (v) => {
  try {
    return JSON.parse(v);
  } catch (error) {
    return {};
  }
};
export default function imgURL(url, style) {
  const styles = { ...parse(style) };
  if (url) styles.backgroundImage = `url(${File_URL + url})`;
  return styles;
}
