const title = {
  en: "All",
  ua: "Всі"
};

const getTitle = (locale) => {
  return locale && title[locale] ? title[locale] : "All";
}

export default getTitle;
