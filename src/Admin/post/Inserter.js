import React from "react";
const defaults = {
  head: { type: "head", bg: "", color: "", content: "", anchorName: "" },
  image: { type: "image", bg: "", color: "", content: { img1: "", img2: "", img3: "" } },
  paragraph: {
    type: "paragraph",
    bg: "",
    color: "",
    content: "",
    padding: false,
    sideBySide: false,
    align: "left",
    sidePad: false,
    links: [],
  },
  block: {
    type: "block",
    bg: "",
    color: "",
    content: { head: "", paragraph: "" },
    padding: false,
    sideBySide: false,
    align: "left",
    sidePad: false,
    links: [],
  },
  file: {
    type: "file",
    color: "",
    content: { heading: "", name: "", url: ""},
  },
  link: {
    type: "link",
    color: "",
    content: { to: "" },
  },
  linkedImage: { type: "linkedImage", bg: "", color: "", content: { img1: "", img2: "", img3: "", to: "" } },
};
const buttons = [
  { type: "head", label: "Bookmark" },
  { type: "paragraph", label: "Paragraph" },
  { type: "block", label: "Block" },
  { type: "image", label: "Image" },
  { type: "file", label: "File" },
  { type: "link", label: "Link" },
  { type: "linkedImage", label: "LinkedImage" },
];
export default function Inserter({ handler, first }) {
  return (
    <div>
      <div className="inserter frc">
        {buttons.map(({ type, label }) => (
          <div key={label} className="insert-button pointy" onClick={() => handler(defaults[type])}>
            <p>{label}</p>
          </div>
        ))}
        {!first ? (
          <div
            className="insert-button rem pointy"
            onClick={() => {
              handler();
            }}>
            <p>Remove</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
