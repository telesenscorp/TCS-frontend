import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { ReactComponent as Tick } from "../../assets/tick.svg";
import { styler, getTitle } from "../../utils";
import Text from "../Text";
export default function AccordingItem({ list, color, contrast, name, selectedNum, selectedTag, onSelect, length }) {
  const [collapse, setVisible] = useState(false);
  const ref = useRef(null);
  const refList = useRef(null);
  const { locale } = useSelector(({ user }) => user);
  useEffect(() => {
    try {
      refList.current.style.height = collapse ? ref.current.getBoundingClientRect().height + "px" : 0;
    } catch (error) {
      console.error(error);
    }
  }, [collapse]);
  return (
    <div className={styler(["bar-filter", { collapse }])}>
      <Text type="Sub" color={contrast} mb="12">
        {name}
      </Text>
      <div className="accordion" onClick={() => setVisible(!collapse)}>
        <Text color={color}>{`${selectedTag} (${selectedNum})`}</Text>
        <div className="toggle" />
      </div>
      <div ref={refList} className="overflow-hidden">
        <div ref={ref}>
        <div className={styler(["filter-item", { selected: selectedTag === getTitle(locale) }])} onClick={() => onSelect(getTitle(locale), length, selectedTag === getTitle(locale))}>
                <Text color={selectedTag === getTitle(locale) ? color : contrast}>{`${getTitle(locale)} (${length})`}</Text>
                {selectedTag === getTitle(locale) ? <Tick /> : <div className="tick-empty" />}
              </div>
          {list.map(([t, n], i) => {
            const isSelected = t === selectedTag;
            return (
              <div key={"a" + i} className={styler(["filter-item", { selected: isSelected }])} onClick={() => onSelect(t, n, isSelected)}>
                <Text color={isSelected ? color : contrast}>{`${t} (${n})`}</Text>
                {isSelected ? <Tick /> : <div className="tick-empty" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
