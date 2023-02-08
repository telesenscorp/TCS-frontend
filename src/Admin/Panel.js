import _ from "lodash";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { USER } from "../common/constants";
import { Snackbar } from "../components";
import Text from "../components/Text";
import { authUpdate } from "../configuration/redux/Auth.slice";
import { layoutUpdate } from "../configuration/redux/Layout.slice";
import { Lang, settingsAddLocale, settingsRemoveLocale, settingsReset, settingsUpdate } from "../configuration/redux/Settings.slice";
import { Del, Get, Post, Put, UploadBackup } from "../configuration/server";
import { Sections } from "../content/res";
import "../styles/Admin.scss";
import { uploadFile } from "../utils";
import { CollapsePicker } from "./common";
import GalleryModal from "./common/GalleryModal";
import TopBar from "./common/TopBar";
import Forms from "./forms";
import Mail from "./Mail";
import EntityBox from "./modules/EntityBox";
import SectionDrag from "./modules/SectionDrag";
import Posts from "./Posts";
import Settings from "./Settings";
const Label = ({ label }) => (
  <Text color="black" bold mv="12">
    {label}
  </Text>
);
const Panel = () => {
  const tabRef = useRef(null);
  const postRef = useRef(null);
  const dispatch = useDispatch();
  const { role, refreshToken } = useSelector(({ auth }) => auth);
  const { language, fixedSideBar } = useSelector(({ layout }) => layout);
  const { localeList, cookies, locale, routeID } = useSelector(({ settings }) => settings);
  const { drag } = useSelector(({ panel }) => panel);
  const [entity, setEntity] = useState({ section: "BlogPreview", props: Sections.BlogPreview });
  const [page, setPage] = useState("Home");
  const [r, setRefresh] = useState(0);
  const refresh = () => setRefresh(_.now());
  const [state] = useState({
    ids: [],
    routes: [],
    pages: { Home: [] },
    defaults: {},
    lastPage: [],
  });
  const fetchContent = () => {
    Get(["content", language], (res) => {
      let r = [],
        p = {},
        hasSettings;
      res.forEach((e) => {
        if (e.route === "telesens-settings") {
          hasSettings = true;
          let res = JSON.parse(e.content);
          if (!res.localeList?.find(({ value }) => value === language)) {
            res.localeList.push({ ...Lang[language] });
          }
          dispatch(settingsReset({ routeID: e.id, ...res }));
        } else {
          r.push({ label: e.route, value: e.route, id: e.id });
          p[e.route] = JSON.parse(e.content);
        }
      });

      state.routes = _.sortBy(r, (v) => v.value);
      state.pages = p;
      if (!hasSettings) {
        Post("createContent", { route: "telesens-settings", content: JSON.stringify({ cookies, localeList }), language }, (e) =>
          dispatch(settingsUpdate({ routeID: e.id }))
        );
      }
      refresh();
    });
  };
  const handleSend = () => {
    if (page) {
      const { id } = state.routes.find((e) => e.label === page);
      Put(["content", id], { route: page, content: JSON.stringify(state.pages[page].filter((e) => !e?.virgin)), language });
    }
  };
  const modify = (section, value) => {
    state.pages[page][section].props = value;
    if (state.pages[page][section]?.virgin) {
      delete state.pages[page][section].virgin;
    }
    refresh();
  };
  const onDelete = (idx) => {
    if (state.pages[page].length === 1) return;
    state.pages[page].splice(idx, 1);
    refresh();
  };
  const onAdd = (idx) => {
    state.pages[page].splice(idx + 1, 0, {
      ...entity,
      virgin: true,
      props: { ...entity.props, visibilityOptions: { tablet: false, mobile: false, desktop: false, laptop: false } },
    });
    refresh();
  };
  const onMove = (index, dir) => {
    try {
      if ((index === 0 && dir < 0) || (index === state.pages[page].length - 1 && dir > 0)) {
        return null;
      }
      const section = state.pages[page][index];
      onDelete(index);
      state.pages[page].splice(index + dir, 0, section);
      refresh();
    } catch (err) {
      console.error(err);
    }
  };
  const onUseDefault = (index) => {
    const { section } = state.pages[page][index];
    if (state?.defaults?.[section]) {
      state.pages[page][index] = JSON.parse(JSON.stringify(state.defaults[section]));
      refresh();
    }
  };
  const onSetAsDefault = (index) => {
    const { section, props } = state.pages[page][index];
    const copyProps = JSON.parse(JSON.stringify(props));
    if (state.defaults) {
      state.defaults[section] = { section, props: copyProps };
    } else {
      state.defaults = {};
      state.defaults[section] = { section, props: copyProps };
    }
    refresh();
  };
  const onToggleVisibility = (index, opt) => {
    state.pages[page][index].props.visibilityOptions = opt;
    refresh();
  };
  const createPage = (v) => {
    Post("createContent", { route: v, content: JSON.stringify([{ section: "Header", props: Sections.Header }]), language }, (e) => {
      state.routes.push({ label: e.route, value: e.route, id: e.id });
      state.pages[e.route] = JSON.parse(e.content);
      refresh();
    });
  };
  const deletePage = (i) => {
    Del(["content", "single", state.routes[i].id], () => {
      fetchContent();
    });
  };

  const onImport = () => {
    uploadFile((res) => {
      try {
        const parsed = JSON.parse(res);
        // save all data to server
        let backup = {};
        Promise.all([Get("content"), Get("allPosts"), Get("allMails")]).then((res) => {
          const [content, posts, mails] = res;
          backup.content = content;
          const file = new File([JSON.stringify({ content, posts, mails })], "backup.json", { type: "text/plain" });
          UploadBackup(
            file,
            (res) => {
              if (res) {
                const requests = [];
                // remove routes
                Del(["content", "all"], () => {
                  // remove posts
                  Del(["posts", "all"], () => {
                    // add new routes
                    if (parsed?.content) {
                      requests.push(Post("createContents", parsed.content));
                    }
                    // edit posts
                    if (parsed?.posts) {
                      requests.push(
                        Post(
                          "createPosts",
                          parsed.posts.map(({ id, postId, ...props }) => {
                            return { ...props, postId: postId ? postId : id };
                          })
                        )
                      );
                    }
                    Promise.all(requests)
                      .then(() => {
                        fetchContent();
                        postRef.current.fetchContent();
                      })
                      .catch((err) => {
                        console.error(err);
                      });
                  });
                });
              }
            },
            (err) => {
              console.error(err);
            }
          );
        });
      } catch (error) {
        console.error(error);
      }
    });
  };
  const onAddLanguage = (value) => {
    const buffer = _.cloneDeep(localeList);
    if (!locale.includes(value)) {
      buffer.push(Lang[value] || { label: value, value });
      if (routeID) dispatch(settingsAddLocale({ routeID, localeList: buffer, cookies, language }));
    }
  };
  const onRemoveLanguage = (value) => {
    const buffer = _.cloneDeep(localeList);
    if (locale.length > 1) {
      buffer.splice(
        buffer.findIndex((e) => e.value === value),
        1
      );
      if (routeID) dispatch(settingsRemoveLocale({ routeID, localeList: buffer, cookies, language }));
    }
  };
  useEffect(() => {
    Post("whoAmI", { token: refreshToken }, (v) => {
      dispatch(authUpdate(v));
    });
    if (role !== USER) {
      Get("allFiles", (gallery) => {
        dispatch(authUpdate({ gallery }));
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    fetchContent();
    setPage("");
  }, [language]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="admin">
      <TopBar
        onSwitch={(v) => {
          tabRef.current.style.transform = `translateX(-${v}00vw)`;
          document.documentElement.style.setProperty("--offset", v + "00vw");
        }}
        onSave={handleSend}
        onImport={onImport}
      />
      <div ref={tabRef} className="admin-tabs">
        <div className="admin-tab">
          <div className="flex-row">
            <div className={`body-box ${drag.active ? "hand" : ""}`}>
              <EntityBox selected={entity.section} onSelect={(v) => setEntity({ section: v, props: Sections[v] })} />
              {/* <div
                className="pointy"
                onClick={() => {
                  if (state.lastPage.length > 0) {
                    state.pages[page] = state.lastPage;
                    state.lastPage = [];
                    refresh();
                  } else {
                    state.lastPage = state.pages[page];
                  }
                }}>
                <Label label={page} />
              </div> */}
              <Label label={page} />
              <SectionDrag onMove={onMove} onAdd={onAdd} />
              {state.pages?.[page]?.map(({ section, props, virgin }, i) => (
                <Forms
                  key={"s-" + i}
                  name={section}
                  options={{
                    ...Sections[section],
                    ...props,
                    virgin,
                    index: i,
                    modify,
                    containerMethods: { onDelete, onAdd, onMove, onUseDefault, onSetAsDefault, onToggleVisibility },
                  }}
                />
              ))}
            </div>
            <div className={`bar ${fixedSideBar ? "fixate" : ""}`}>
              <div className="head">
                <Label label="Routes" />
                <CollapsePicker
                  name="page"
                  list={state.routes}
                  selected={page}
                  onSelect={(e) => {
                    if (page !== "" && window.confirm("if you wish to save the changes made press ok")) {
                      handleSend();
                    } else {
                      fetchContent();
                    }
                    setPage(e);
                  }}
                  onRemove={deletePage}
                  onAdd={createPage}
                  canEdit
                />
                <Label label="language" />
                <CollapsePicker
                  name="locale"
                  list={localeList}
                  selected={language}
                  onAdd={onAddLanguage}
                  onRemove={onRemoveLanguage}
                  onSelect={(value) => dispatch(layoutUpdate({ language: value }))}
                  canEdit
                />
              </div>
            </div>
          </div>
        </div>
        <div className="admin-tab">
          <Posts ref={postRef} />
        </div>
        <div className="admin-tab">
          <Settings />
        </div>
        <div className="admin-tab">
          <Mail />
        </div>
      </div>
      <GalleryModal />
      <Snackbar admin />
    </div>
  );
};
export default Panel;
