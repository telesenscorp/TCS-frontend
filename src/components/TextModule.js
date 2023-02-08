import _ from "lodash";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack5';
import { File_URL } from "../common/constants";
import {doubleParse, download, parseHtml, styler, uniqueId} from "../utils";
import Text from "./Text";
import { ReactComponent as DownloadedSvg } from "../assets/downloadedFile.svg";
import { ReactComponent as DownloadSvg } from "../assets/download.svg";
import PointerContext, { mouseEvents, types } from "./pointer/Context";

const TextModule = ({ type, bg, color, content, padding, sideBySide, anchorName, align, sidePad, links }) => {
  const module = () => {
    switch (type) {
      case "head":
        return <Head {...{ content, anchorName, color }} />;
      case "image":
        return <Image {...content} color={color} />;
      case "paragraph":
        return <Paragraph {...{ content, color, sideBySide, align, sidePad, links }} />;
      case "link":
        return <Link {...{ ...content, color }} />;
      case "file":
        return <PDF {...content} {...{ color}}/>
        case "linkedImage":
        return <LinkedImage {...content} color={color} />;
      default:
        return <Block {...content} {...{ color, sideBySide, align, sidePad, links }} />;
    }
  };
  return <div className={styler(["module-container", "type-" + type, { ["bg-" + bg]: bg, padding, "side-pad": sidePad }])}>{module()}</div>;
};
function Head({ content, anchorName, color }) {
  return (
    <Text id={anchorName} className="anchor-name" type="Sub" color={color}>
      {content}
    </Text>
  );
}
function Paragraph({ content, color, sideBySide, align, links }) {
  const ref = useRef(null);
  const leftRef = useRef(null);
  const context = useContext(PointerContext);
  const rightRef = useRef(null);
  const refresh = useState(0)[1];
  useEffect(() => {
    if (sideBySide) {
      const [left, right] = doubleParse(content, links);
      leftRef.current.innerHTML = left;
      rightRef.current.innerHTML = right;
    } else {
      if (ref) ref.current.innerHTML = parseHtml(content, false, links);
    }
    const linksArr = ref.current.querySelectorAll("a");
    linksArr.forEach((el) => {
      el.addEventListener("pointerenter", (e) => {
          e.stopPropagation();
          context.setType(types.link);
      });
      el.addEventListener("pointerleave", (e) => {
        e.stopPropagation();
        context.setType(types.default);
      });
    });
    refresh(_.now());
  }, [content]); // eslint-disable-line react-hooks/exhaustive-deps
  return sideBySide ? (
    <div className="side-by-side">
      <Text ref={leftRef} {...{ color, align }} />
      <Text ref={rightRef} {...{ color, align }} />
    </div>
  ) : (
    <Text ref={ref} {...{ color, align }}>
      {content}
    </Text>
  );
}
function Image({ img1 }) {
  return <img loading="lazy" src={File_URL + img1} alt={img1} />;
}
function Block({ head, paragraph, color, sideBySide, align, links }) {
  return (
    <Fragment>
      <Text mb={12} type="Sub2" color={color}>
        {head}
      </Text>
      <Paragraph content={paragraph} {...{ color, sideBySide, align, links }} />
    </Fragment>
  );
}
function File({ head, color, name, url }) {
  const context = useContext(PointerContext);
  return (
    <Fragment>
      <Text className="file-heading" type="H3" color={color} italic>
        {head}
      </Text>
      {name ? <div className="flex-row gap16 align-center file">
        <DownloadedSvg/>
        <div className="f2">
        <div className="file-label" {...mouseEvents(context, types.link)}>
        <Text color={color} onClick={() => download(name, File_URL + url)}>
        {_.upperFirst(name)}
        </Text>
        </div>
        </div>
        <div className="download-button" {...mouseEvents(context, types.link)}>
          <DownloadSvg onClick={() => download(name, File_URL + url)}/>
        </div>
      </div> : null}
    </Fragment>
  );
}
function PDF({ head, color, name, url }) {
  const context = useContext(PointerContext);
  const { mobileBrowser, isMobile } = useSelector(({ layout }) => layout);
  const [show, setShow] = useState(false);
  // const [preview, setPreview] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  }
  const downloadPDF = () => {
    let element = document.createElement("a");
    element.href = File_URL + url;
    element.download = name;
    element.click();
  }
  const openPage = () => {
    if (pageNumber < numPages) setPageNumber(pageNumber + 1);
  }
  const renderPage = () => {
    const result = [];
    for (let i = 0; i < pageNumber; i++) {
      result.push(<Page
        key={uniqueId(i)}
        pageNumber={i + 1}
        renderAnnotationLayer={false}
        width={!mobileBrowser ? 715 : !isMobile ? 472 : window.innerWidth - 64}/>);
    }
    return result;
  }
  // const renderPagePreview = () => {
  //   const result = [];
  //   for (let i = 1; i <= numPages; i++) {
  //     result.push(<Page
  //       key={uniqueId(i)}
  //       pageNumber={i}
  //       renderAnnotationLayer={false}
  //       width={!mobileBrowser ? window.innerWidth * 0.9 : !isMobile ? 472 : window.innerWidth - 64}/>);
  //   }
  //   return result;
  // }
  const handleClick = () => {
    setShow(!show);
  }

  useEffect(() => {
    if (!show) {
      setPageNumber(1);
    }
  }, [show]);

  return (
    <Fragment>
      <div className="pdf-btn-wrapper">
        <div className={`pdf-btn-toggle ${show ? 'active' : ''}`} onClick={handleClick} {...mouseEvents(context, types.link)}>
          <Text type="Sub2" italic color="navy-green">
            More information
          </Text>
        </div>
      </div>
      {show ? (
        <div className="pdf-container bg-soft-blue">
          <div className="pdf-title">
            <Text type="H3" color={color} italic>
              {head}
            </Text>
          </div>
          {url ? <div className="pdf-body">
            {/*<div className="background" onClick={() => setPreview(true)} {...mouseEvents(context, types.zoom)}>*/}
              <Document
                file={File_URL + url}
                onLoadSuccess={onDocumentLoadSuccess}
              >
                {renderPage()}
              </Document>
            {/*</div>*/}
          </div> : null}
          <div className="pdf-buttons">
            <div className="pdf-button-save" onClick={downloadPDF} {...mouseEvents(context, types.link)}>
              <p>Save it</p>
            </div>
            {numPages > 1 && pageNumber < numPages ? <div className="pdf-button-open" onClick={openPage} {...mouseEvents(context, types.link)}>
              <Text type="body" color="navy-green" italic>+ Open more page</Text>
            </div> : null}
          </div>
        </div>
      ) : null}
      {/*{preview ? <div className="pdf-preview">*/}
      {/*  <div className="pdf-preview-header">*/}
      {/*    <div className="pdf-preview-btn-wrapper">*/}
      {/*      <div className="pdf-download" >*/}
      {/*        <DownloadSvg onClick={downloadPDF} {...mouseEvents(context, types.link)}/>*/}
      {/*      </div>*/}
      {/*      <div className="pdf-preview-close" onClick={() => setPreview(false)} {...mouseEvents(context, types.link)}>*/}
      {/*        <div className="line"></div>*/}
      {/*        <div className="line"></div>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*  <div className="pdf-preview-container">*/}
      {/*    <div className="scroll">*/}
      {/*      <Document*/}
      {/*        file={File_URL + url}*/}
      {/*        onLoadSuccess={onDocumentLoadSuccess}*/}
      {/*      >*/}
      {/*        {renderPagePreview()}*/}
      {/*      </Document>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div> : null}*/}
    </Fragment>
  );
}
function Link({to}) {
  const context = useContext(PointerContext);
  const handleClick = () => {
    if (to) window.open(`${to}?href=${window.location.href}`, "_blank");
  }
  return (
    <div className="link-btn-wrapper">
      <div className="link-btn-toggle" onClick={handleClick} {...mouseEvents(context, types.link)}>
        <Text type="Sub2" italic color="navy-green">
          More information
        </Text>
      </div>
    </div>
  );
}
export default TextModule;

function LinkedImage({ img1, to }) {
  const context = useContext(PointerContext);
  const handleClick = () => {
    if (to) window.open(`${to}`, "_blank");
  }
  return <img loading="lazy" src={File_URL + img1} alt={img1} onClick={handleClick} {...mouseEvents(context, types.link)}/>;
}