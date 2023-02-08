import React, { forwardRef } from "react";
import styler from "../utils/styler";
// type = H1 | H2 | H3 | H4 | H5 | H6 | Sub | Sub2 | Body | Body2 | Button | Cap | Overline
const Text = forwardRef(
  (
    {
      id,
      onClick,
      className = "",
      type = "Body",
      center,
      italic,
      bold,
      color = "white",
      tag,
      mv = "",
      mb = "",
      m = "",
      ml = "",
      p = "",
      align,
      children,
      hideIfEmpty,
      force = false,
    },
    ref
  ) => {
    if (hideIfEmpty && typeof children === "string" && children.length < 1) {
      return null;
    }
    const Props = {
      className: styler([
        type,
        "color-" + color,
        className,
        {
          "text-center": center,
          italic,
          bold,
          // ["color-" + color]: color,
          ["text-" + align]: align,
          ["p" + p]: p,
          ["m" + m]: m,
          ["mv" + mv]: mv,
          ["mb" + mb]: mb,
          ["mb" + mb]: mb,
          ["ml" + ml]: ml,
        },
      ]),
      onClick,
      id,
    };

    if (!tag)
      return (
        !force ? <p ref={ref} {...Props}>
          {children}
        </p> : <p ref={(e) => {
          if (e !== null) e.innerHTML = children;
        }
        } {...Props}>
        </p>
      );
    switch (tag) {
      case "span":
        return (
          <span ref={ref} {...Props}>
            {children}
          </span>
        );
      case "h1":
        return (
          <h1 ref={ref} {...Props}>
            {children}
          </h1>
        );
      case "h2":
        return (
          <h2 ref={ref} {...Props}>
            {children}
          </h2>
        );
      case "h3":
        return (
          <h3 ref={ref} {...Props}>
            {children}
          </h3>
        );
      case "h4":
        return (
          <h4 ref={ref} {...Props}>
            {children}
          </h4>
        );
      case "h5":
        return (
          <h5 ref={ref} {...Props}>
            {children}
          </h5>
        );
      case "h6":
        return (
          <h6 ref={ref} {...Props}>
            {children}
          </h6>
        );
      default:
        return (
          <p ref={ref} {...Props}>
            {children}
          </p>
        );
    }
  }
);

export default Text;
