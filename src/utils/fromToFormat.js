const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
function dateParse(v) {
  return months[v % 12];
}
function mutateMonth(v, m, y) {
  let temp = m + v;
  return temp < 0 ? { YYYY: y - 1, MM: dateParse(12 + temp) } : { YYYY: y + Math.floor(temp / 12), MM: dateParse(temp) };
}
export default function fromToFormat(dir, year, month) {
  const Forward = dir > 0;
  const lm = mutateMonth(-1, month, year); //lastMonth ;
  const nm = mutateMonth(1, month, year); //nextMonth;
  const n2m = mutateMonth(2, month, year); //nextTwoMonths;
  return Forward
    ? [`${nm.YYYY}-${nm.MM}-01`, `${n2m.YYYY}-${n2m.MM}-01`, nm.YYYY, parseInt(nm.MM) - 1]
    : [`${lm.YYYY}-${lm.MM}-01`, `${year}-${dateParse(month)}-01`, lm.YYYY, parseInt(lm.MM) - 1];
}
