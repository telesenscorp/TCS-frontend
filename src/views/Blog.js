import { useId } from "react";
import { useSelector } from "react-redux";
import { Image, TextModule, WidgetList } from "../components";
import Text from "../components/Text";
import { BookmarkList } from "../components/WidgetList";
import {content as translator} from "../common/translator.js"
import { formatDate } from "../utils";

const BlogMobile = ({ title, label, author, img, theme, createdAt, authorRole, content, bg = "soft-blue", color = "black" }) => {
  const ID = useId();
  const { locale } = useSelector(({ user }) => user);
  return (
    <section data={ID} id="blog-section" className={`blog-view-mob bg-${bg}`}>
      <div className="flex-col blog-content">
        <Text type="H-mob" mb={32} color={color}>
          {title}
        </Text>
        {content.map((props, i) => (
          <TextModule key={"k-" + i} {...props} />
        ))}
      </div>
      {author ? (
        <div className="blog-author">
          {img ? <Image lazy url={img} label={title} /> : null}
          <div className="details">
            <Text mb={2} className="semi-bold" color={color}>
              {author}
            </Text>
            <Text mb={8} type="Button" color={color}>
              {authorRole}
            </Text>
            <Text type="Cap" color="light-grey">
              {formatDate(createdAt, locale)}
            </Text>
          </div>
        </div>
      ) : null}
      {theme.map((v, i) => (
        <WidgetList className="mob-widget" key={"w-" + i} list={v.content.split(",")} label={v.label} />
      ))}
    </section>
  );
};
const BlogFull = ({ title, label, author, img, theme, createdAt, authorRole, content = [], bg = "soft-blue", color = "black" }) => {
  const ID = useId();
  const { locale } = useSelector(({ user }) => user);
  const getHeight = () => {
    if (window.location.pathname !== "/privacy-policy") return 0;
    if (!content.filter(({ type }) => type === "head").length) return 0;
    const sh = window.innerHeight || document.documentElement.clientHeight;
    const fh = document.getElementsByTagName("footer")[0]?.clientHeight;
    const mcs = document.getElementsByClassName("module-container");
    const lh = mcs.length ? mcs[mcs.length - 1].clientHeight : 0;
    return sh - (fh || 0) - lh - 60;
  };
  return (
    <section data={ID} id="blog-section" className={`blog-view frc bg-${bg}`}>
      <div className="container">
        <div className="blog-side-bar">
          {img ? <Image lazy className="mb12" url={img} label={title} /> : null}
          {author ? <Text mb={12} type="Sub2" color={color} children={[author]} /> : null}
          {authorRole ? <Text mb={12} color={color} children={[authorRole]} /> : null}
          {author ? <Text mb={12} type="Body2" color="light-grey" children={[formatDate(createdAt, locale)]} /> : null}
          <BookmarkList list={content.filter(({ type }) => type === "head").map((v) => v?.anchorName)} label={translator.bookmarks[locale]} />
          {theme.map((v, i) => (
            <WidgetList className="blog-widget" key={"w-" + i} list={v.content.split(",")} label={v.label} />
          ))}
        </div>
        <div className="flex-col blog-content">
          <Text type="H3" mb={32} color={color} italic>
            {title}
          </Text>
          {content.map((props, i) => (
            <TextModule key={"k-" + i} {...props} />
          ))}
          <div className="block-spacer" style={{ height: `${getHeight()}px` }} />
        </div>
      </div>
    </section>
  );
};
export default function Blog(props) {
  const parseIt = () => {
    try {
      if (Array.isArray(props.theme)) {
        return props.theme;
      }
      return JSON.parse(props.theme);
    } catch (error) {
      return [];
    }
  };
  const theme = parseIt();
  const { mobileBrowser, screenWidth } = useSelector(({ layout }) => layout);
  return mobileBrowser ? <BlogMobile {...props} theme={theme} sw={screenWidth} /> : <BlogFull {...props} theme={theme} />;
}
