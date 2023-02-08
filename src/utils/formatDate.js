var Months = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  ua: ["січ", "лют", "берез", "квіт", "трав", "черв", "лип", "серп", "верес", "жовт", "листоп", "груд"]
}
export default function formatDate(v, locale = "en") {
  let day = new Date(v).getDate();
  let month = new Date(v).getMonth();
  let year = new Date(v).getFullYear();
  return `${day} ${Months[locale][month]} ${year}`;
}
