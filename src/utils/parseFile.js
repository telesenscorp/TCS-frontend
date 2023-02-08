import { File_URL } from "../common/constants";
export default function parseFile(url) {
  return File_URL + url;
}
const steps = [" 480w", " 1200w"];
export function parseMultiFile(urls = []) {
  return urls.map((f, i) => (!!f ? parseFile(f) + steps[i] : "")).join(", ");
}
