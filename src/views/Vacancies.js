import _ from "lodash";
import { useId, useLayoutEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { VacanciesBarFull, VacanciesBarMobile, Vacancy } from "../components/vacancies";
export default function Vacancies({
  bg = "white",
  color = "navy-green",
  labelColor = "just-grey",
  contrast = "black",
  vacancies = [],
  vacancyForm,
}) {
  const ID = useId();
  const ref = useRef(null);
  const [visible, setVisible] = useState(-1);
  const [list, setList] = useState(_.cloneDeep(vacancies));
  const [tagList, setTagList] = useState({ list: {}, sec: [], selected: [], num: [] });
  const [r, refresh] = useState(0);
  const { mobileBrowser, contentVersion } = useSelector(({ layout }) => layout);
  const { locale } = useSelector(({ user }) => user);
  const handleFilter = () => {
    const selected = tagList.selected.filter((v) => v !== "");
    let newList = _.cloneDeep(vacancies).filter(({ tags }) => {
      let matches = 0;
      tags.forEach(({ name, value }) => {
        if (selected.includes(value)) matches++;
        if (value) tagList.list[name][value] = 0;
      });
      return selected.length === matches;
    });
    newList.forEach(({ tags }) => {
      tags.forEach(({ name, value }) => {
        if (tagList.sec.includes(name)) {
          tagList.list[name][value]++;
        }
      });
    });
    setVisible(-1);
    setList(newList);
  };
  useLayoutEffect(() => {
    setVisible(-1);
    setList(_.cloneDeep(vacancies));
    tagList.sec = [];
    tagList.list = [];
    tagList.num = [];
    vacancies.forEach(({ tags }) => {
      tags.forEach(({ name, value }) => {
        if (tagList.sec.includes(name)) {
          if (tagList.list[name][value]) {
            tagList.list[name][value]++;
          } else {
            tagList.list[name][value] = 1;
          }
        } else if (name) {
          tagList.sec.push(name);
          tagList.list[name] = { [value]: 1 };
        }
      });
    });
    tagList.selected = Array(tagList.sec.length).fill("");
    refresh(r + 1);
    // setTagList({ list: {}, sec: [], selected: [], num: [] });
  }, [contentVersion, locale]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <section id={ID} className="width-wrapper">
      <div className={`vacancies-root bg-${bg}`}>
        <div className="container">
          {mobileBrowser ? (
            <VacanciesBarMobile onFilter={handleFilter} {...{ tagList, contrast, color }} len={vacancies.length} />
          ) : (
            <VacanciesBarFull
              onFilter={() => {
                setVisible(-1);
                setTimeout(handleFilter, 1000);
              }}
              {...{ tagList, contrast, color }}
            />
          )}
          <div ref={ref} className="vacancies-list">
            {list.map(({ title, heading, requirements }, i) => (
              <Vacancy
                key={title + i}
                visible={i === visible}
                onClick={(v) => {
                  setVisible(visible === i ? -1 : i);
                  if (visible !== i) {
                    const ratio = window.devicePixelRatio === 1.25 ? 1.25 : 1;
                    window.scrollTo(0, ref.current.offsetTop / ratio + i * v);
                  }
                }}
                {...{ color, title, heading, requirements, vacancyForm, labelColor }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
