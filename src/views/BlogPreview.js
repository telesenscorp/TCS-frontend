import React, { useId } from "react";
import Text from "../components/Text";
import styler from "../utils/styler";

export const InnerBlog = ({ title, desc, label, color = "black", bg }) => {
  return (
    <div id="inner-blog-section" className="container inner-blog-preview">
      <div className="side f3 flex-column">
        <Text color={color}>{label}</Text>
      </div>
      <div className="side f7 flex column">
        <Text type="H3" color={color} italic>
          {title}
        </Text>
        <Text color={color}>{desc}</Text>
      </div>
    </div>
  );
};
const BlogPreview = ({ title, subTitle, desc, label, author, url, to, theme, createdAt, authorRole, bg = "", color = "black" }) => {
  const ID = useId();
  // const { mobileBrowser } = useSelector(({ layout }) => layout);
  return (
    <section id={ID} className="width-wrapper">
      <div className={`blog-preview frc bg-${bg}`}>
        <div className="container">
          <div className="side f3 flex column">
            <Text type="Sub2" color={color}>
              {label}
            </Text>
          </div>
          <div className="side f7 flex column">
            <Text type="H3" color={color} italic className={styler([{ spacer: subTitle || desc }])}>
              {title}
            </Text>
            <Text color={color}>{subTitle}</Text>
            <Text color={color} force>{desc}</Text>
          </div>
          <div className="f2" />
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
