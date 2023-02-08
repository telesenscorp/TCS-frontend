import { isArray } from "lodash";
import { useLayoutEffect, useState } from "react";
import { Get } from "../configuration/server";
import { fromToFormat } from "../utils";
import { WindowSection } from "./common";
import IconButton from "./common/IconButton";
const Months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function TableHead({ label }) {
  return (
    <th>
      <span className="color-white Body">{label}</span>
    </th>
  );
}
function TableData({ label }) {
  return (
    <td>
      <span className="color-white Body">{label || "-"}</span>
    </td>
  );
}
function TextBox({ label, ...props }) {
  return (
    <div className="analytics-box frc" {...props}>
      <p className="color-white Body">{label}</p>
    </div>
  );
}
const currentEvents = { visit: true, click: true };
function Analytics() {
  const [state, setState] = useState({ origin: [], data: [], clicks: [], month: "", year: 0, monthIndex: 0, busy: true });
  const [day, setDay] = useState([]);

  const selectDay = (v) => {
    const newList = state.origin.filter(({ ip, event, type, browser, mode, locale, location, created }) => {
      let thisDay = new Date(created).getDate();
      return currentEvents[event] && thisDay === v;
    });
    setDay(newList);
  };
  const parseData = (res) => {
    const visitDates = Array(32).fill(0);
    const clickDates = Array(32).fill(0);
    let m = 0,
      year = 0,
      d;
    if (isArray(res) && res.length) {
      d = new Date(res[0].created);
      m = d.getMonth();
      year = d.getFullYear();
    }
    res.forEach(({ ip, event, type, browser, mode, locale, location, created }) => {
      let thisDay = new Date(created).getDate();
      if (event === "visit") visitDates[thisDay]++;
      if (event === "click") clickDates[thisDay]++;
    });
    return { origin: res, month: Months[m], year, data: visitDates, clicks: clickDates, monthIndex: m, busy: false };
  };
  const fetchMonth = (dir) => {
    const { busy, year, monthIndex } = state;
    if (!busy) {
      state.busy = true;
      const [fromDate, toDate, YY, MM] = fromToFormat(dir, year, monthIndex);
      Get(["analytics", "between?start=" + fromDate + "&end=" + toDate], (res) => {
        setState({ ...parseData(res), monthIndex: MM, month: Months[MM], year: YY });
      });
    }
  };
  useLayoutEffect(() => {
    Get("analyticsThisMonth", (res) => setState(parseData(res)));
    return () => {};
  }, []);
  return (
    <WindowSection label="Analytics">
      <div className="frc mb12">
        <IconButton name="chevronCircledLeft" onClick={() => fetchMonth(-1)} />
        <p className="Body color-white text-center" style={{ width: 150 }}>{`${state.month} - ${state.year}`}</p>
        <IconButton name="chevronCircledRight" onClick={() => fetchMonth(1)} />
      </div>
      <section className="section-divider analytics">
        {state.data.map((v, i) =>
          i > 0 ? (
            <div key={i + "v"} className="flex-column">
              <TextBox label={i} className="analytics-box frc date-box pointy" onClick={() => selectDay(i)} />
              <TextBox label={v} className="analytics-box frc bg-grey" />
              <TextBox label={state.clicks[i]} className="analytics-box frc bg-grey" />
            </div>
          ) : (
            <div key={i + "v"} className="flex-column">
              <TextBox label="date" />
              <TextBox label="visit" />
              <TextBox label="click" />
            </div>
          )
        )}
      </section>
      <section className="section-divider analytics">
        <table className="fl-table">
          <thead>
            <tr>
              <TableHead label="ip" />
              <TableHead label="event" />
              {/* <TableHead label="type" /> */}
              {/* <TableHead label="browser" /> */}
              <TableHead label="mode" />
              <TableHead label="locale" />
              <TableHead label="location" />
              {/* <TableHead label="created" /> */}
            </tr>
          </thead>
          <tbody>
            {day.map(({ ip, event, type, browser, mode, locale, location, created }) => (
              <tr>
                <TableData label={ip} />
                <TableData label={event} />
                {/* <TableData label={type} /> */}
                {/* <TableData label={browser} /> */}
                <TableData label={mode} />
                <TableData label={locale} />
                <TableData label={location} />
                {/* <TableData label={created} /> */}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </WindowSection>
  );
}

export default Analytics;
