import colorList from "../Admin/constants/colorList";

export default function parseHtml(content = "", caution, links = []) {
  let parsedContent = "";
  let tagged = false;
  let tagger = "";
  const classes = {
    U: " underlined",
    B: " bold",
    I: " italic",
    C: (v) => " color-" + colorList[Number(v)],
    S: (v) => " " + FontList[v],
    L: () => " ",
  };
  let c = ""; //char
  let att = "";
  let isLink = false;
  let link = "";
  for (let i = 0; i < content.length; i++) {
    c = content[i];
    att = content.substring(i + 1, i + 3);
    if (tagged) {
      if (c === ">" || c === "/") {
        parsedContent += c === "/" ? c : `${isLink ? link : "span"} class='inh ${tagger}'>`;
        tagged = false;
        isLink = false;
        tagger = "";
      } else {
        switch (c) {
          case "C":
            tagger += classes[c](att);
            i += 2;
            break;
          case "S":
            tagger += classes[c](att);
            i += 2;
            break;
          case "L":
            isLink = true;
            tagger += "Link";
            link = `a href='${links[Number(att[0] || 0)]}' target="_blank"`;
            break;
          default:
            tagger += classes[c] ? classes[c] : "";
            break;
        }
      }
    } else {
      if (c === "<") {
        tagged = true;
      }
      parsedContent += c;
    }
  }
  if (tagger.length > 0) {
    parsedContent += "</span>";
  }
  return caution ? { parsedContent, safe: tagger.length < 1, tag: `<span class='inh${tagger}'>` } : parsedContent;
}
export const doubleParse = (content, links) => {
  let mid = Math.ceil(content.length / 2);
  let left = parseHtml(content.slice(0, mid), true, links);
  let right = parseHtml((left.safe ? "" : left.tag) + content.slice(mid), false, links);
  return [left.parsedContent, right];
};

const FontList = {
  H1: "H1",
  H2: "H2",
  H3: "H3",
  H4: "H4",
  H5: "H5",
  H6: "H6",
  S1: "Sub",
  S2: "Sub2",
  B1: "Body",
  B2: "Body2",
  Bu: "Button",
  Ca: "Cap",
  Ov: "Overline",
};
