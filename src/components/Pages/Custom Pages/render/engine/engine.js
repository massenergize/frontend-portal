import { Tags } from "./blocks";
import React from "react";
import { serializeCss } from "./serialize-css";
const X = "x";
const Y = "y";
export const DIRECTIONS = { X, Y };

export function debounce(func, delay) {
  let timeout;

  return function (...args) {
    clearTimeout(timeout); // Clear the previous timeout
    timeout = setTimeout(() => {
      func.apply(this, args); // Call the function after the delay
    }, delay);
  };
}
const layoutFlow = (direction, serialize = false) => {
  // let directionKey = serialize ? "flex-direction" : "flexDirection";

  return { display: "flex", flexDirection: direction === DIRECTIONS.X ? "row" : "column" };
};


export const serializeBlock = (block) => {
  const { direction, element, content, children: childElements } = block || {};
  const { type } = element || {};
  const { text, style, ...props } = element?.props || {};
  if (!element) return "";

  // Determine the tag to use
  const Tag = Tags[type]?.type || "div";
  const defaultTagStyle = Tags[type]?.style || {};

  // Convert style object to inline style string
  const styleTogether = { ...defaultTagStyle, ...style, ...layoutFlow(direction, true) };
  const styleString = serializeCss(styleTogether);

  // Serialize props (excluding style and text)
  const propsString = Object.entries(props || {})
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  const isRich = type === "richtext";
  const isVideo = type === "video";

  // If the block is rich text, return the inner HTML
  const richText = `<div style="${styleString}"> ${props?.__html} </div>`;
  if (isRich) return richText;
  if (isVideo) return serializeVideoBlock({ src: props?.src, styleString: serializeCss(styleTogether), propsString });

  // Serialize children recursively
  const innerHTML =
    content ||
    (childElements &&
      childElements
        .map((el) => serializeBlock(el)) // Recursively serialize children
        .join("")) ||
    "";

  // Serialize the block
  return `<${Tag} ${styleString ? `style="${styleString}"` : ""} ${propsString}>
    ${text || ""}
    ${innerHTML}
  </${Tag}>`;
};

const serializeVideoBlock = ({ src, styleString, propsString }) => {
  return ` 
    <div>
      <iframe
      src = "https://www.youtube.com/embed/${src}"
            
            title="YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style="width:100%;border:none;${styleString}"
            ${propsString}
          >
          </iframe>
      </div>
      `;
};

// src={${src}}
// style="width:100%;height: auto;border: none;"
