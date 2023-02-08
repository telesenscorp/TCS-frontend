import _ from "lodash";
import { Fragment, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useSearchParams } from "react-router-dom";
import { CardsTree } from "../components";
import { Get } from "../configuration/server";
import { filterQuery } from "../utils";
import Blog from "./Blog";
const levels = ["root", "first", "second", "third", "fourth", "fifth", "sixth"];
export default function ServicesTree({ root, variants = [] }) {
  const ID = useId();
  const { mobileBrowser, contentVersion } = useSelector(({ layout }) => layout);
  const treeRef = useRef(null);
  const blogRef = useRef(null);
  let location = useLocation();
  let [sP, setSearchParams] = useSearchParams({});
  const { locale } = useSelector(({ user }) => user);
  const data = useRef({
    root: { heading: "", products: [], selected: null, parentItem: null },
    first: { heading: "", products: [], selected: null, parentItem: null },
    second: { heading: "", products: [], selected: null, parentItem: null },
    third: { heading: "", products: [], selected: null, parentItem: null },
    fourth: { heading: "", products: [], selected: null, parentItem: null },
    fifth: { heading: "", products: [], selected: null, parentItem: null },
    sixth: { heading: "", products: [], selected: null, parentItem: null },
    currentPath: "",
    depth: 0,
  });
  const [r, setRefresh] = useState(0);
  const refresh = () => setRefresh(_.now());
  const [nextProps, setNextProps] = useState({ blog: null, depth: 0 });
  const onChange = (dimension, item) => {
    const { pointer, secName, id } = item;
    const nextDimension = dimension + 1;
    //setting the card selector
    data.current[levels[dimension]].selected = id;
    //check if the card is ending
    if (/^:end/.test(pointer)) {
      //the ending pattern is :end:id
      const to = pointer.split(":").reverse()[0];
      Get(["posts/post-id", to], (res) => {
        levels.forEach((e, i) => {
          if (i >= nextDimension) {
            data.current[e] = { heading: "", products: [], selected: null, parentItem: null };
          }
        });
        setNextProps({ depth: nextDimension, blog: { ...res, content: JSON.parse(res.content) } });
      });
    } else {
      levels.forEach((e, i) => {
        //updating the card list with the new list
        if (i === nextDimension) {
          data.current[e] = { heading: secName, products: variants.filter((e) => e.parent === pointer), selected: null, parentItem: item };
        }
        //clearing the open lists beneath the current level
        if (i > nextDimension) {
          data.current[e] = { heading: "", products: [], selected: null, parentItem: null };
        }
      });
      setNextProps({ depth: nextDimension, blog: null });
    }
    //updating the url
    const post = levels
      .map((n) => data.current[n].selected)
      .filter((v) => v !== null)
      .join("_");
    data.current.currentPath = post;
    refresh();
    setSearchParams({ post, lng: locale }, { replace: true });
  };
  const getStyles = (e) => {
    try {
      return root[e];
    } catch (error) {
      return { bg: "white", color: "black" };
    }
  };
  useLayoutEffect(() => {
    const query = filterQuery(location.search);
    if (query?.post !== data.current.currentPath) {
      let hasBlog;
      const Paths = query?.post?.split("_") || [null];
      levels.forEach((e, i) => {
        data.current[e] =
          i > 0
            ? { heading: "", products: [], selected: null, parentItem: null }
            : {
                heading: root?.root.heading || "",
                products: variants.filter((e) => e.parent === ":root"),
                selected: Paths[0],
                parentItem: {
                  secTitle: root?.root.secTitle || "",
                },
              };
      });
      const len = Paths.length + 1;
      if (len > 1) {
        for (let i = 1; i < len; i++) {
          let prev, current;
          variants.forEach((v) => {
            if (v.id === Paths[i - 1]) {
              prev = v;
            }
            if (v.id === Paths[i]) {
              current = v;
            }
          });
          data.current[levels[i]] = {
            heading: prev?.secName || "",
            products: variants.filter((e) => e.parent === prev?.pointer),
            selected: Paths[i],
            parentItem: prev,
          };
          if (i === len - 2 && /^:end/.test(current?.pointer)) {
            hasBlog = true;
            const to = current?.pointer.split(":").reverse()[0];
            Get(["posts/post-id", to], (res) => {
              setNextProps({ depth: len - 1, blog: { ...res, content: JSON.parse(res.content) } });
            });
          }
        }
      }
      if (!hasBlog) setNextProps({ depth: len - 1, blog: null });
      refresh();
    }
  }, [location.search, contentVersion]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const query = filterQuery(location.search);
    try {
      if (nextProps.blog) {
        setTimeout(() => blogRef.current.scrollIntoView({ block: "start" }), mobileBrowser ? 1000 : 500);
      } else if (query?.post) {
        setTimeout(
          () => {
            treeRef.current.children[nextProps.depth].scrollIntoView({ block: "start" });
          },
          mobileBrowser ? 1000 : 500
        );
      }
    } catch (error) {
      console.warn(error);
    }
  }, [nextProps, r, location.search]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const query = filterQuery(location.search);
    if (query?.lng !== locale) {
      setSearchParams({ lng: locale }, { replace: true });
    }
    refresh();
  }, [locale, contentVersion]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Fragment>
      <section id={ID} className="width-wrapper">
        <div ref={treeRef} className="services-tree">
          {levels.map((e, i) =>
            data.current[e].products?.length > 0 ? (
              <CardsTree
                key={e}
                {...data.current[e]}
                options={{
                  current: getStyles(e),
                  next: getStyles(levels[i + 1]),
                }}
                onChange={(v) => onChange(i, v)}
              />
            ) : null
          )}
        </div>
      </section>
      <div ref={blogRef}>{nextProps.blog ? <Blog {...nextProps.blog} /> : null}</div>
    </Fragment>
  );
}
