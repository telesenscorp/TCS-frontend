import React, { useContext } from "react";
import { ReactComponent as Star } from "../../assets/star.svg";
import PointerContext, { mouseEvents, types } from "../pointer/Context";
import Text from "../Text";

export default function VacanciesBarFull({ tagList, contrast, color, onFilter }) {
  const context = useContext(PointerContext);
  return (
    <div className="vacancies-bar">
      {tagList.sec.map((v, vi) => (
        <div key={"a" + vi} className="bar-filter">
          <Text type="Sub" color={contrast} mb="12">
            {v}
          </Text>
          {Object.entries(tagList.list[v]).map(([t, n], i) => {
            const isSelected = t === tagList.selected[vi];
            return (
              <div
                key={"b" + i}
                className="flex-row"
                onClick={() => {
                  tagList.selected[vi] = isSelected ? "" : t;
                  onFilter();
                }}
                {...mouseEvents(context, types.link)}>
                {isSelected ? <Star /> : null}
                <Text color={isSelected ? color : contrast} mb="12">
                  {`${t} (${n})`}
                </Text>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
