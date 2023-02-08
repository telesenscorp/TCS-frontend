import _ from "lodash";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postsUpdate } from "../configuration/redux/Auth.slice";
import { Del, Get, Post, Put } from "../configuration/server";
import { styler } from "../utils";
import Blog from "../views/Blog";
import { CollapsePicker, FormInput, Gallery } from "./common";
import ContainerPost from "./common/ContainerPost";
import { Block, Head, Image, Inserter, Paragraph, File, Link, LinkedImage } from "./post";

const parseJson = (data) => {
  try {
    return JSON.parse(data);
  } catch (error) {
    return [
      { label: "", content: "" },
      { label: "", content: "" },
      { label: "", content: "" },
    ];
  }
};
const Posts = (props, ref) => {
  const initialData = { author: "", authorRole: "", title: "", label: "", language: "en", theme: "", img: "", content: [] };
  const initialThemes = {
    visible: false,
    list: [
      { label: "", content: "" },
      { label: "", content: "" },
      { label: "", content: "" },
    ],
  };
  const content = useRef([]);
  const dispatch = useDispatch();
  const { fixedSideBar } = useSelector(({ layout }) => layout);
  const persisted = useRef(initialData);
  const [posts, setPosts] = useState([]);
  const [previewToggle, setPreviewToggle] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [themes, setThemes] = useState(initialThemes);
  const [state, setState] = useState({
    author: "",
    authorRole: "",
    title: "",
    label: "",
    language: "en",
    theme: "",
    img: "",
  });
  const [r, setRefresh] = useState(0);
  const onModify = (v) => {
    setState({ ...state, ...v });
  };
  const addBlock = (opt, i) => {
    if (opt) {
      content.current.splice(i + 1, 0, opt);
    } else {
      content.current.splice(i, 1);
    }
    setRefresh(_.now());
  };
  const onChange = (v, i) => {
    content.current[i] = { ...content.current[i], ...v };
    setRefresh(_.now());
  };
  const onMove = (v, i) => {
    try {
      if ((i === 0 && v < 0) || (i === content.current.length - 1 && v > 0)) {
        return null;
      }
      const section = content.current[i];
      content.current.splice(i, 1);
      content.current.splice(i + v, 0, section);
    } catch (err) {
      console.error(err);
    }
    setRefresh(_.now());
  };
  const onChangeTheme = (v, f, i) => {
    themes.list[i][f] = v;
    setRefresh(_.now());
  };
  const fetchContent = (firstTime) => {
    Get("allPosts", (res) => {
      const sortedPosts = res.sort((a, b) => a.postId - b.postId);
      setPosts(sortedPosts);
      if (firstTime === true && sortedPosts.length > 0) {
        // setSelectedPost(sortedPosts[sortedPosts.length - 1]?.id);
      }
      dispatch(postsUpdate(sortedPosts));
    });
  };
  const deletePost = (i, v) => {
    Del(["posts", "single", v], fetchContent);
  };
  const createPost = (v) => {
    // generate postId
    const postIds = posts.filter(({postId}) => !isNaN(Number(postId))).map(({ postId }) => Number(postId));
    const lostPostId = postIds.length > 0 ? Math.max(...postIds) : null;
    const postId = lostPostId ? lostPostId + 1 : null;
    Post("createPost", { ...initialData, theme: JSON.stringify(initialThemes.list), label: v, content: "[]", postId }, fetchContent);
  };
  const onCopy = () => {
    persisted.current = { ...state, content: content.current };
  };
  const onPaste = () => {
    const newState = _.cloneDeep(persisted.current);
    content.current = newState.content;
    delete newState.content;
    setState(newState);
  };
  const onReset = () => {
    const newState = { ...initialData };
    content.current = newState.content;
    delete newState.content;
    setState(newState);
    setThemes(initialThemes);
  };
  const trimAnchorName = (v) => {
    return v.map((item) => {
      if (item.type === "head") {
        return { ...item, anchorName: item.anchorName.trim() };
      }
      return item;
    });
  };
  const onSave = () => {
    if (selectedPost) {
      Put(
        ["/posts", selectedPost],
        { ...state, theme: JSON.stringify(themes.list), content: JSON.stringify(trimAnchorName(content.current)) },
        fetchContent
      );
    }
  };
  const onPreview = () => {
    setPreviewToggle(!previewToggle);
  };
  const onAddWidget = () => {
    setThemes({ ...themes, visible: !themes.visible });
  };
  const isEmpty = (arr) => arr?.every(({ label, content }) => !label.length && !content.length);
  // get postId by id
  const getPostIdById = (id) => {
    return posts.find((item) => item.id === id)?.postId;
  };

  useImperativeHandle(ref, () => ({ fetchContent }));
  useEffect(() => {
    fetchContent(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    try {
      const post = posts.find((v) => v.id === selectedPost);
      if (post) {
        content.current = JSON.parse(post.content);
        const { author, authorRole, title, label, theme, img, language } = post;
        themes.list = parseJson(theme);
        themes.visible = !isEmpty(themes.list);
        setState({ author, authorRole, title, label, language, theme, img });
      }
    } catch (err) {}
  }, [selectedPost, posts]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="flex-row posts-tab">
      <button onClick={() => {}}>hi</button>
      <div className="body-box">
        <div>
          <ContainerPost
            {...{ onCopy, onPaste, onSave, onPreview, onAddWidget, onReset, postId: getPostIdById(selectedPost), preview: previewToggle }}>
            <div className={previewToggle ? "hidden" : ""}>
              <section className="section-divider row">
                <FormInput label="label" value={state.label} onChange={(v) => onModify({ label: v })} />
                <FormInput label="author" value={state.author} onChange={(v) => onModify({ author: v })} />
                <FormInput label="author role" value={state.authorRole} onChange={(v) => onModify({ authorRole: v })} />
                <div className="language-picker">
                  <div
                    className={styler(["language-tab pointy flex center", { active: state.language === "en" }])}
                    onClick={() => onModify({ language: "en" })}>
                    <span className="cant-select">EN</span>
                  </div>
                  <div
                    className={styler(["language-tab pointy flex center", { active: state.language === "ua" }])}
                    onClick={() => onModify({ language: "ua" })}>
                    <span className="cant-select">UA</span>
                  </div>
                </div>
                <Gallery value={state.img} onChange={(v) => onModify({ img: v })} />
              </section>
              <section className={styler(["section-divider", { "hidden-widget": !themes.visible }])}>
                {themes?.list?.map(({ label, content }, i) => (
                  <div key={"N-" + i} className="frc">
                    <div className="f1">
                      <FormInput
                        label="widget label"
                        value={label}
                        onChange={(v) => onChangeTheme(v, "label", i)}
                        placeholder="like Domains"
                      />
                    </div>
                    <div className="f3">
                      <FormInput
                        label="widget list"
                        value={content}
                        onChange={(v) => onChangeTheme(v, "content", i)}
                        placeholder="Domain1,Domain2,Domain3,..."
                      />
                    </div>
                  </div>
                ))}
              </section>
              <section className="section-divider">
                <FormInput label="title" value={state.title} onChange={(v) => onModify({ title: v })} />
                <Inserter handler={(v) => addBlock(v, -1)} first />
              </section>
              {content.current.map((props, i) => {
                switch (props.type) {
                  case "head":
                    return (
                      <Head
                        key={props.type + i}
                        {...props}
                        handler={(v) => addBlock(v, i)}
                        onChange={(v) => onChange(v, i)}
                        onMove={(v) => onMove(v, i)}
                      />
                    );
                  case "paragraph":
                    return (
                      <Paragraph
                        key={props.type + i}
                        {...props}
                        handler={(v) => addBlock(v, i)}
                        onChange={(v) => onChange(v, i)}
                        onMove={(v) => onMove(v, i)}
                      />
                    );
                  case "image":
                    return (
                      <Image
                        key={props.type + i}
                        {...props}
                        handler={(v) => addBlock(v, i)}
                        onChange={(v) => onChange(v, i)}
                        onMove={(v) => onMove(v, i)}
                      />
                    );
                  case "file":
                    return (
                      <File
                        key={props.type + i}
                        {...props}
                        handler={(v) => addBlock(v, i)}
                        onChange={(v) => onChange(v, i)}
                        onMove={(v) => onMove(v, i)}
                      />
                    );
                  case "link":
                    return (
                      <Link
                        key={props.type + i}
                        {...props}
                        handler={(v) => addBlock(v, i)}
                        onChange={(v) => onChange(v, i)}
                        onMove={(v) => onMove(v, i)}
                      />
                    );
                    case "linkedImage":
                    return (
                      <LinkedImage
                        key={props.type + i}
                        {...props}
                        handler={(v) => addBlock(v, i)}
                        onChange={(v) => onChange(v, i)}
                        onMove={(v) => onMove(v, i)}
                      />
                    );
                  default:
                    return (
                      <Block
                        key={props.type + i}
                        {...props}
                        handler={(v) => addBlock(v, i)}
                        onChange={(v) => onChange(v, i)}
                        onMove={(v) => onMove(v, i)}
                      />
                    );
                }
              })}
            </div>
            <div className={previewToggle ? "" : "hidden"}>
              <Blog {...state} theme={themes.list} content={content.current} />
            </div>
          </ContainerPost>
        </div>
      </div>
      <div className={`bar${fixedSideBar ? " fixate" : ""}`}>
        <div className="head">
          <CollapsePicker
            name="post"
            valueKey="id"
            list={posts}
            onAdd={createPost}
            onRemove={deletePost}
            selected={selectedPost}
            onSelect={setSelectedPost}
            canSearch
            canFilter
            canEdit
            showID
          />
        </div>
      </div>
    </div>
  );
};
export default forwardRef(Posts);
