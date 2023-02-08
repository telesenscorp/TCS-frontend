import { useState } from "react";
import { styler, uniqueId } from "../../utils";
const languageFilter = [
  { label: "All", value: "" },
  { label: "EN", value: "en" },
  { label: "UA", value: "ua" },
];
const CollapsePicker = ({
  list = [{ label: "", value: "", id: "", content: "" }],
  valueKey = "value",
  labelKey = "label",
  filterKey = "language",
  selected,
  onSelect,
  onAdd,
  onRemove,
  name,
  canEdit,
  canSearch,
  canFilter,
  showID,
}) => {
  const [state, setState] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const ItemList = list.map((props) => {
    if (search.length > 0 && !props[labelKey]?.includes(search)) {
      return null;
    }
    if (filter.length > 0 && filter !== props[filterKey]) {
      return null;
    }
    return props;
  });
  const listLength = ItemList.filter((v) => v !== null).length;
  const addSnippet = (content) => {
    return JSON.parse(content || "[]").length ? JSON.parse(content).find((el) => el.type === "paragraph")?.content : "";
  };
  return (
    <div className="collapse-list">
      {canSearch ? (
        <div className="input">
          <input placeholder="search..." value={search} onChange={({ target }) => setSearch(target.value)} />
          <span className="Body p8">{listLength}</span>
        </div>
      ) : null}
      {canFilter ? (
        <div className="input">
          {languageFilter.map(({ label, value }) => (
            <div
              key={label}
              className={styler(["filter-tab f1 pointy flex center", { active: filter === value }])}
              onClick={() => setFilter(value)}>
              <span className="cant-select">{label}</span>
            </div>
          ))}
        </div>
      ) : null}
      <div className="item-box">
        <div className="item-scroll">
          {ItemList.map((props, idx) => {
            if (props === null) {
              return null;
            }
            return (
              <div key={uniqueId(idx)} className="item-container">
                <div
                  className={styler(["item", { selected: props[valueKey] === selected, snippet: addSnippet(props.content) }])}
                  key={name + idx}
                  onClick={() => onSelect(props[valueKey])}
                  data-content={addSnippet(props.content)}>
                  <p>{`${showID ? props?.postId + " - " : ""}${props[labelKey]}`}</p>
                </div>
                {canEdit ? <div className="remove" onClick={() => onRemove(idx, props[valueKey])} /> : null}
              </div>
            );
          })}
        </div>
      </div>
      {canEdit ? (
        <div className="input">
          <input placeholder={"new " + name} value={state} onChange={({ target }) => setState(target.value)} />
          <div
            className="add"
            onClick={() => {
              if (state) onAdd(state);
              setState("");
            }}>
            <span>+</span>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CollapsePicker;
