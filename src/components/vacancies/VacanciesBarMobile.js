import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AccordingItem from "./AccordingItem";
import { getTitle } from "../../utils";


export default function VacanciesBarMobile({ tagList, contrast, color, onFilter, len }) {
  const [refresh, setRefresh] = useState(0);
  const { locale } = useSelector(({ user }) => user);
  useEffect(() => {
    setRefresh(refresh + 1);
  }, [tagList]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="vacancies-bar">
      {tagList.sec.map((v, listIndex) => (
        <AccordingItem
          name={v}
          key={"v" + listIndex}
          {...{ color, contrast }}
          list={Object.entries(tagList.list[v])}
          selectedTag={tagList.selected[listIndex] || getTitle(locale)}
          selectedNum={tagList.num[listIndex] || len}
          length={len}
          onSelect={(t, n, sel) => {
            tagList.selected[listIndex] = sel || t === getTitle(locale) ? "" : t;
            tagList.num[listIndex] = sel || t === getTitle(locale) ? 0 : n;
            onFilter();
          }}
        />
      ))}
    </div>
  );
}
