import { useEffect, useState } from "react";
import { Get } from "../configuration/server";
import Blog from "./Blog";
const Post = ({ id, bg }) => {
  const [content, setContent] = useState(null);
  useEffect(() => {
    Get(["posts/post-id", id], (res) => {
      setContent({ ...res, content: JSON.parse(res.content) });
    });
  }, [id]);
  return content ? <Blog {...content} /> : <div style={{ height: "100vh" }} />;
};
export default Post;
