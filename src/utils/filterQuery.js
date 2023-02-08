export default function filterQuery(query) {
  let regex = /[?&]([^=#]+)=([^&#]*)/g,
    params = {},
    match;
  while ((match = regex.exec(query))) {
    params[match[1]] = match[2];
  }
  return params;
}
