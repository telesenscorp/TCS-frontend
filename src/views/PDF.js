import React, { useContext, useId, useState } from "react";
import { Text } from "../components";
import { File_URL } from "../common/constants";
import { Document, Page } from "react-pdf/dist/umd/entry.webpack5";
import { uniqueId } from "../utils";
import { ReactComponent as ArrowLeft } from "../assets/arrow-left.svg";
import { ReactComponent as DownloadSvg } from "../assets/download.svg";
import { ReactComponent as ArrowLeftMob } from "../assets/arrow-left2.svg";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import PointerContext, { mouseEvents, types } from "../components/pointer/Context";

const PDFFull = ({ bg, title, color, url }) => {
  const location = useLocation();
  const ID = useId();
  const [numPages, setNumPages] = useState(null);
  const context = useContext(PointerContext);
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };
  const renderPage = () => {
    const result = [];
    const ratio = window.devicePixelRatio;
    for (let i = 1; i <= numPages; i++) {
      result.push(
        <Page
          key={uniqueId(i)}
          pageNumber={i}
          renderAnnotationLayer={false}
          width={document.body.clientWidth * 0.9 * (ratio === 1.25 ? ratio : 1)}
        />
      );
    }
    return result;
  };
  const backTo = () => {
    const params = new URLSearchParams(location.search);
    const href = params.get("href");
    const lng = href.indexOf("?") + 1 ? `&` : `?` + `lng=${params.get("lng")}`;
    if (href) window.location.href = href + lng;
  };
  return (
    <section id={ID} className={`width-wrapper bg-${bg} pdf-page`}>
      <div className="flex-col content">
        <div className="flex-row justify-between">
          <div className="btn" onClick={backTo} {...mouseEvents(context, types.link)}>
            <ArrowLeft />
            <Text type="Sub2" color="navy-green">
              Back to post
            </Text>
          </div>
          <a href={File_URL + url} download {...mouseEvents(context, types.link)}>
            <div className="btn download">
              <Text type="Sub2" color="navy-green">
                Save file
              </Text>
              <DownloadSvg />
            </div>
          </a>
        </div>
        <div className="title">
          <Text type="H3" color={color}>
            {title}
          </Text>
        </div>
        <div className="pdf">
          <Document file={File_URL + url} onLoadSuccess={onDocumentLoadSuccess}>
            {renderPage()}
          </Document>
        </div>
      </div>
    </section>
  );
};

const PDFMobile = ({ bg, title, color, url, correction }) => {
  const location = useLocation();
  const ID = useId();
  const [numPages, setNumPages] = useState(null);
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };
  const renderPage = () => {
    const result = [];
    for (let i = 1; i <= numPages; i++) {
      result.push(<Page key={uniqueId(i)} pageNumber={i} renderAnnotationLayer={false} width={document.body.clientWidth - correction} />);
    }
    return result;
  };
  const backTo = () => {
    const params = new URLSearchParams(location.search);
    const href = params.get("href");
    if (href) window.location.href = href + `&lng=${params.get("lng")}`;
  };
  const downloadPDF = () => {
    let element = document.createElement("a");
    element.href = File_URL + url;
    element.download = "file.pdf";
    element.click();
  };
  return (
    <section id={ID} className={`width-wrapper bg-${bg} pdf-page-mob`}>
      <div className="flex-col content">
        <div className="flex-row">
          <div className="btn back flex-row align-center" onClick={backTo}>
            <ArrowLeftMob />
            <Text type="Sub2" color="navy-green">
              Back to post
            </Text>
          </div>
        </div>
        <div className="title">
          <Text type="Sub" color={color}>
            {title}
          </Text>
        </div>
        <div className="pdf">
          <Document file={File_URL + url} onLoadSuccess={onDocumentLoadSuccess}>
            {renderPage()}
          </Document>
        </div>
        <div className="btn-wrapper">
          <div className="btn download flex-row justify-center" onClick={downloadPDF}>
            <Text type="Sub2" color="navy-green">
              Save file
            </Text>
            <DownloadSvg />
          </div>
        </div>
      </div>
    </section>
  );
};

export default function PDF(props) {
  const { mobileBrowser, isMobile } = useSelector(({ layout }) => layout);
  return mobileBrowser ? (
    isMobile ? (
      <PDFMobile {...props} correction={64} />
    ) : (
      <PDFMobile {...props} correction={128} />
    )
  ) : (
    <PDFFull {...props} />
  );
}
