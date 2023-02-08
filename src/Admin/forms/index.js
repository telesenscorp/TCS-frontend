// @create-index

import BannerForm from "./BannerForm.js";
import BlogPreviewForm from "./BlogPreviewForm.js";
import ContactUsForm from "./ContactUsForm.js";
import CounterForm from "./CounterForm.js";
import FooterForm from "./FooterForm.js";
import GalleryForm from "./GalleryForm.js";
import HeaderForm from "./HeaderForm.js";
import HeroForm from "./HeroForm.js";
import IndustriesForm from "./IndustriesForm.js";
import NotFoundForm from "./NotFoundForm.js";
import PartnersForm from "./PartnersForm.js";
import PDFForm from "./PDFForm";
import PostForm from "./PostForm.js";
import QuotesForm from "./QuotesForm.js";
import ServicesForm from "./ServicesForm.js";
import ServicesTreeForm from "./ServicesTreeForm.js";
import SubscribeForm from "./SubscribeForm.js";
import TechnologiesForm from "./TechnologiesForm.js";
import VacanciesForm from "./VacanciesForm.js";
import ValuesForm from "./ValuesForm.js";

export default function Forms({ name, options }) {
  switch (name) {
    case "Banner":
      return <BannerForm {...options} />;
    case "BlogPreview":
      return <BlogPreviewForm {...options} />;
    case "ContactUs":
      return <ContactUsForm {...options} />;
    case "Counter":
      return <CounterForm {...options} />;
    case "Footer":
      return <FooterForm {...options} />;
    case "Gallery":
      return <GalleryForm {...options} />;
    case "Header":
      return <HeaderForm {...options} />;
    case "AnimatedHero":
      return <HeroForm sectionName="Animated Hero" {...options} />;
    case "Hero":
      return <HeroForm {...options} />;
    case "Industries":
      return <IndustriesForm {...options} />;
    case "NotFound":
      return <NotFoundForm {...options} />;
    case "Partners":
      return <PartnersForm {...options} />;
    case "PDF":
      return <PDFForm {...options} />;
    case "Post":
      return <PostForm {...options} />;
    case "Quotes":
      return <QuotesForm {...options} />;
    case "Services":
      return <ServicesForm {...options} />;
    case "ServicesTree":
      return <ServicesTreeForm {...options} />;
    case "Subscribe":
      return <SubscribeForm {...options} />;
    case "Technologies":
      return <TechnologiesForm {...options} />;
    case "Vacancies":
      return <VacanciesForm {...options} />;
    case "Values":
      return <ValuesForm {...options} />;
    default:
      <div {...options} />;
  }
}
