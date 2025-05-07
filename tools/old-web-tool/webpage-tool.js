const htmlTags = [
  //'html',      // Root element
  //'head',      // Metadata
  //'title',     // Document title
  //'body',      // Document body
  "h1", // Main heading
  "h2",
  "h3",
  "h4",
  "h5",
  "p", // Paragraph
  "a", // Anchor link
  "div", // Division/container
  "span", // Inline container
  "ul", // Unordered list
  "ol", // Ordered list
  "li", // List item
  "img", // Image
  "form", // Form container
  "input", // Input field
  "button", // Button
  "label", // Label for form elements
  "br", // Line break
  "hr", // Horizontal rule
  "table", // Table
  "tr", // Table row
  "td", // Table cell
  "th", // Table header cell
  "thead", // Table head
  "tbody", // Table body
  "tfoot", // Table footer
  "style", // Style block
  "link", // Link to external resources
  "script", // Script
  "div", // Container for other elements
  "header", // Header section
  "footer", // Footer section
  "section", // Section
  "article", // Article
  "aside", // Aside content
  "nav", // Navigation links
  "iframe", // Inline frame
  "video", // Video
  "audio", // Audio
  "source", // Media source
  "canvas", // Drawing area
  "svg", // Scalable vector graphics
  "input", // Input field
  "textarea", // Multi-line text input
  "select", // Dropdown menu
  "option", // Option in dropdown
  "iframe", // Inline frame
  "embed", // External content
  "object", // Embeds an object
  "param", // Parameters for object
  "track", // Text tracks for media
  "map", // Image map
  "area", // Area in an image map
  "blockquote", // Block quotation
  "cite", // Citation
  "q", // Short quotation
  "abbr", // Abbreviation
  "address", // Contact information
  "code", // Code snippet
  "pre", // Preformatted text
  "b", // Bold text
  "strong", // Strong importance
  "i", // Italic text
  "em", // Emphasis
  "u", // Underlined text
  "s", // Strikethrough text
  "mark", // Highlighted text
  "small", // Smaller text
  "sub", // Subscript text
  "sup", // Superscript text
  "del", // Deleted text
  "ins", // Inserted text
  "details", // Details element
  "summary", // Summary for details
  "time", // Date/time
  "var", // Variable
  "samp", // Sample output
  "kbd", // Keyboard input
  "pre", // Preformatted text
  "code", // Code snippet
  "bdi", // Isolation boundary
  "bdo", // Bi-directional override
  "ruby", // Ruby annotations
  "rt", // Ruby text
  "rp", // Ruby parentheses
  "wbr", // Word break opportunity
];

let listOfUnits = [
  "px",
  "%",
  "em",
  "cm",
  "mm",
  "in",
  "pt",
  "pc",
  "em",
  "ex",
  "ch",
  "rem",
  "vw",
  "vh",
  "vmin",
  "vmax",
];

const cssProperties = [
  "align-content",
  "align-items",
  "align-self",
  "all",
  "animation",
  "animation-delay",
  "animation-direction",
  "animation-duration",
  "animation-fill-mode",
  "animation-iteration-count",
  "animation-name",
  "animation-play-state",
  "animation-timing-function",
  "backface-visibility",
  "background",
  "background-attachment",
  "background-blend-mode",
  "background-clip",
  "background-color",
  "background-image",
  "background-origin",
  "background-position",
  "background-repeat",
  "background-size",
  "border",
  "border-bottom",
  "border-bottom-color",
  "border-bottom-left-radius",
  "border-bottom-right-radius",
  "border-bottom-style",
  "border-bottom-width",
  "border-collapse",
  "border-color",
  "border-image",
  "border-image-outset",
  "border-image-repeat",
  "border-image-slice",
  "border-image-source",
  "border-image-width",
  "border-left",
  "border-left-color",
  "border-left-style",
  "border-left-width",
  "border-radius",
  "border-right",
  "border-right-color",
  "border-right-style",
  "border-right-width",
  "border-spacing",
  "border-style",
  "border-top",
  "border-top-color",
  "border-top-left-radius",
  "border-top-right-radius",
  "border-top-style",
  "border-top-width",
  "border-width",
  "bottom",
  "box-decoration-break",
  "box-shadow",
  "box-sizing",
  "break-after",
  "break-before",
  "break-inside",
  "caption-side",
  "caret-color",
  "clear",
  "clip",
  "clip-path",
  "color",
  "column-count",
  "column-fill",
  "column-gap",
  "column-rule",
  "column-rule-color",
  "column-rule-style",
  "column-rule-width",
  "column-span",
  "column-width",
  "columns",
  "content",
  "counter-increment",
  "counter-reset",
  "cursor",
  "direction",
  "display",
  "empty-cells",
  "filter",
  "flex",
  "flex-basis",
  "flex-direction",
  "flex-flow",
  "flex-grow",
  "flex-shrink",
  "flex-wrap",
  "float",
  "font",
  "font-family",
  "font-feature-settings",
  "font-kerning",
  "font-language-override",
  "font-size",
  "font-size-adjust",
  "font-stretch",
  "font-style",
  "font-synthesis",
  "font-variant",
  "font-variant-alternates",
  "font-variant-caps",
  "font-variant-east-asian",
  "font-variant-ligatures",
  "font-variant-numeric",
  "font-variant-position",
  "font-weight",
  "gap",
  "grid",
  "grid-area",
  "grid-auto-columns",
  "grid-auto-flow",
  "grid-auto-rows",
  "grid-column",
  "grid-column-end",
  "grid-column-gap",
  "grid-column-start",
  "grid-gap",
  "grid-row",
  "grid-row-end",
  "grid-row-gap",
  "grid-row-start",
  "grid-template",
  "grid-template-areas",
  "grid-template-columns",
  "grid-template-rows",
  "hanging-punctuation",
  "height",
  "hyphens",
  "image-rendering",
  "inline-size",
  "inset",
  "inset-block",
  "inset-block-end",
  "inset-block-start",
  "inset-inline",
  "inset-inline-end",
  "inset-inline-start",
  "isolation",
  "justify-content",
  "justify-items",
  "justify-self",
  "left",
  "letter-spacing",
  "line-break",
  "line-height",
  "list-style",
  "list-style-image",
  "list-style-position",
  "list-style-type",
  "margin",
  "margin-block",
  "margin-block-end",
  "margin-block-start",
  "margin-bottom",
  "margin-inline",
  "margin-inline-end",
  "margin-inline-start",
  "margin-left",
  "margin-right",
  "margin-top",
  "mask",
  "mask-border",
  "mask-border-mode",
  "mask-border-outset",
  "mask-border-repeat",
  "mask-border-slice",
  "mask-border-source",
  "mask-border-width",
  "mask-clip",
  "mask-composite",
  "mask-image",
  "mask-mode",
  "mask-origin",
  "mask-position",
  "mask-repeat",
  "mask-size",
  "mask-type",
  "max-height",
  "max-width",
  "min-block-size",
  "min-height",
  "min-inline-size",
  "min-width",
  "mix-blend-mode",
  "object-fit",
  "object-position",
  "offset",
  "offset-anchor",
  "offset-distance",
  "offset-path",
  "offset-rotate",
  "opacity",
  "order",
  "orphans",
  "outline",
  "outline-color",
  "outline-offset",
  "outline-style",
  "outline-width",
  "overflow",
  "overflow-anchor",
  "overflow-block",
  "overflow-clip-box",
  "overflow-inline",
  "overflow-wrap",
  "overflow-x",
  "overflow-y",
  "overscroll-behavior",
  "overscroll-behavior-block",
  "overscroll-behavior-inline",
  "overscroll-behavior-x",
  "overscroll-behavior-y",
  "padding",
  "padding-block",
  "padding-block-end",
  "padding-block-start",
  "padding-bottom",
  "padding-inline",
  "padding-inline-end",
  "padding-inline-start",
  "padding-left",
  "padding-right",
  "padding-top",
  "page-break-after",
  "page-break-before",
  "page-break-inside",
  "perspective",
  "perspective-origin",
  "place-content",
  "place-items",
  "place-self",
  "pointer-events",
  "position",
  "quotes",
  "resize",
  "right",
  "rotate",
  "row-gap",
  "scale",
  "scroll-behavior",
  "scroll-margin",
  "scroll-margin-block",
  "scroll-margin-block-end",
  "scroll-margin-block-start",
  "scroll-margin-bottom",
  "scroll-margin-inline",
  "scroll-margin-inline-end",
  "scroll-margin-inline-start",
  "scroll-margin-left",
  "scroll-margin-right",
  "scroll-margin-top",
  "scroll-padding",
  "scroll-padding-block",
  "scroll-padding-block-end",
  "scroll-padding-block-start",
  "scroll-padding-bottom",
  "scroll-padding-inline",
  "scroll-padding-inline-end",
  "scroll-padding-inline-start",
  "scroll-padding-left",
  "scroll-padding-right",
  "scroll-padding-top",
  "scroll-snap-align",
  "scroll-snap-stop",
  "scroll-snap-type",
  "scrollbar-color",
  "scrollbar-gutter",
  "scrollbar-width",
  "shape-image-threshold",
  "shape-margin",
  "shape-outside",
  "tab-size",
  "table-layout",
  "text-align",
  "text-align-last",
  "text-combine-upright",
  "text-decoration",
  "text-decoration-color",
  "text-decoration-line",
  "text-decoration-skip-ink",
  "text-decoration-style",
  "text-decoration-thickness",
  "text-emphasis",
  "text-emphasis-color",
  "text-emphasis-position",
  "text-emphasis-style",
  "text-indent",
  "text-justify",
  "text-orientation",
  "text-overflow",
  "text-rendering",
  "text-shadow",
  "text-transform",
  "text-underline-offset",
  "text-underline-position",
  "top",
  "transform",
  "transform-box",
  "transform-origin",
  "transform-style",
  "transition",
  "transition-delay",
  "transition-duration",
  "transition-property",
  "transition-timing-function",
  "translate",
  "unicode-bidi",
  "user-select",
  "vertical-align",
  "visibility",
  "white-space",
  "widows",
  "width",
  "will-change",
  "word-break",
  "word-spacing",
  "word-wrap",
  "writing-mode",
  "z-index",
];

body = document.getElementById("previewContainer");
head = "";
title = "";

template = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${head}
    <title>${title}</title>
</head>
<body style="height:height:fit-content">
<p>previewer</p>
    ${body}
</body>
</html>`;

//PDF previewer

function convertAndPreview() {
  const htmlString = template;
  const container = document.createElement("div");
  container.innerHTML = htmlString;
  const previewContainer = document.getElementById("previewContainer");
  if (previewContainer) {
    previewContainer.innerHTML = "";
    previewContainer.appendChild(container);
  }
}

// Drag and drop functionality
function onDragStart(event) {
  event.dataTransfer.setData("text/plain", event.target.id);
  event.currentTarget.style.backgroundColor = "yellow";
}

//drop area
function onDragOver(event) {
  event.preventDefault();
}

// function onDrop(event) {
//   event.preventDefault(); // Prevent default behavior (optional)

//   const id = event.dataTransfer.getData('text');
//   const draggableElement = document.getElementById(id);
//   const dropzone = event.target;

//   if (draggableElement) {
//     // Clone the dragged element
//     const newElement = draggableElement.cloneNode(true);
//     newCreatedElement=document.createElement(newElement.firstChild.nodeName);
//     newCreatedElement.classList='clickable dropped-element';
//     newCreatedElement.title=newElement.firstChild.nodeName;
//     newCreatedElement.addEventListener("dragstart", (event) => onDragStart(event));
//     dropzone.appendChild(newCreatedElement);

//         // Update the template
//         updateTemplate(newCreatedElement.outerHTML);

//   } else {
//     console.warn("Element with ID", id, "not found");
//   }
//   event.dataTransfer.clearData();
// }

function onDrop(event) {
  // Prevent default behavior
  event.preventDefault();

  // Check for draggable element
  const draggableElement = document.getElementById(
    event.dataTransfer.getData("text/plain")
  );
  if (!draggableElement) {
    console.warn(
      "Element with ID",
      event.dataTransfer.getData("text/plain"),
      "not found"
    );
    event.dataTransfer.clearData();
    return;
  }

  // Clone and modify the dragged element
  const newElement = draggableElement.cloneNode(true);
  const newContentElement = document.createElement(
    newElement.firstChild.nodeName
  ); // Create element for content
  newContentElement.classList = "clickable dropped-element"; // Add necessary classes
  // newContentElement.title = newElement.firstChild.nodeName; // Set title
  newContentElement.textContent = newElement.textContent; // Copy text content (assuming plain text)
  newContentElement.addEventListener("dragstart", (event) =>
    onDragStart(event)
  );

  // Get the dropzone element and its rectangle
  const dropzone = event.target;
  const dropzoneRect = dropzone.getBoundingClientRect();

  // Calculate drop Y coordinate relative to dropzone
  const dropY = event.clientY - dropzoneRect.top;
  const dropX = event.clientX - dropzoneRect.left;

  //check is first element
  if (dropzone.childNodes.length == 1) {
    dropzone.appendChild(newContentElement);
  } else {
    // Determine insert position
    let insertPosition;
    const dropzoneHeight = dropzoneRect.height;
    const threshold = dropzoneHeight / 3; // Adjust threshold as needed

    if (dropY < threshold) {
      insertPosition = "top";
    } else if (dropY > dropzoneHeight - threshold) {
      insertPosition = "bottom";
    } else {
      // Logic for determining left/middle/right
      const dropzoneWidth = dropzoneRect.width;
      const threshold = dropzoneWidth / 3; // Adjust threshold as needed

      if (dropX < threshold) {
        insertPosition = "left";
      } else if (dropX > dropzoneWidth - threshold) {
        insertPosition = "right";
      } else {
        insertPosition = "middle";
      }
    }

    // Highlight the insert position (enhanced)
    let highlightElement;
    switch (insertPosition) {
      case "top":
        highlightElement = document.createElement("div");
        highlightElement.classList.add("insertion-marker", "top");
        dropzone.insertBefore(highlightElement, dropzone.firstChild);
        break;
      case "left":
        highlightElement = document.createElement("div");
        highlightElement.classList.add("insertion-marker", "left");
        dropzone.insertBefore(highlightElement, dropzone.firstChild);
        break;

      case "middle":
        highlightElement = document.createElement("div");
        highlightElement.classList.add("insertion-marker", "middle");
        const middleIndex = Math.floor(dropzone.childNodes.length / 2);
        if (dropzone.childNodes.length > 0) {
          dropzone.insertBefore(
            highlightElement,
            dropzone.childNodes[middleIndex]
          );
        } else {
          dropzone.appendChild(highlightElement);
        }
        break;
      case "right":
        highlightElement = document.createElement("div");
        highlightElement.classList.add("insertion-marker", "right");
        dropzone.appendChild(highlightElement);
        break;
      case "bottom":
        highlightElement = document.createElement("div");
        highlightElement.classList.add("insertion-marker", "bottom");
        dropzone.appendChild(highlightElement);
        break;
    }

    // Ensure highlight visibility (add styling)
    highlightElement.style.backgroundColor = "lightblue";
    highlightElement.style.opacity = 0.5;

    // Insert the new element at the appropriate position (after highlighting)
    const childNodes = dropzone.childNodes;
    switch (insertPosition) {
      case "top":
        if (childNodes.length > 1) {
          dropzone.insertBefore(newContentElement, childNodes[0]);
        } else {
          dropzone.appendChild(newContentElement);
        }
        break;
      case "left":
        if (childNodes.length > 1) {
          // Remove the highlight after insertion
          dropzone.removeChild(childNodes[0]); // Assuming highlightElement is at index 0
        }
        dropzone.insertBefore(newContentElement, childNodes[1]); // Assuming newContentElement goes after highlight
        break;
      case "middle":
        if (childNodes.length > 1) {
          dropzone.removeChild(childNodes[0]); // Assuming highlightElement is at index 0
        }
        const middleIndex = Math.floor(childNodes.length / 2);
        dropzone.insertBefore(newContentElement, childNodes[middleIndex]);
        break;
      case "right":
        dropzone.appendChild(newContentElement); // Direct insertion for empty dropzone

        if (childNodes.length > 0) {
          dropzone.removeChild(childNodes[0]); // Assuming highlightElement is at index 0
        }
        dropzone.appendChild(newContentElement);
        break;
      case "bottom":
        dropzone.appendChild(newContentElement);
        break;
    }

    // Remove the highlight after insertion
    if (highlightElement) {
      dropzone.removeChild(highlightElement);
    }
  }
  // // Clear data transfer
  event.dataTransfer.clearData();
}

function updateTemplate(newContent) {
  const bodyPlaceholder = "${body}";
  template = template.replace(
    bodyPlaceholder,
    `${newContent}\n${bodyPlaceholder}`
  );
  // document.getElementById('previewContainer').textContent = template;
  document.getElementById("code-viewer").textContent = template;
}

/*on hover display and hide*/
function showPopover(id, tag) {
  const div = document.createElement("div");
  div.id = "popover";
  div.textContent = tag;
  let element = document.getElementById(id);
  element.appendChild(div);
}

function onLeaverItem(id) {
  document.getElementById("popover").remove();
}

let previousElement = null;
let selectedElement = null;

window.onclick = (e) => {
  if (e.target.classList.contains("clickable")) {
    if (previousElement) {
      previousElement.classList.remove("highlight");
      let deletePresent = previousElement.querySelector(".delete-tag");
      if (deletePresent) {
        deletePresent.remove();
      }
    }
    e.target.classList.add("highlight");
    let del = document.createElement("button");
    del.textContent = "x";
    del.classList = "delete-tag";
    del.title = "delete";
    del.style.left = `${e.pageX}px`;
    del.style.top = `${e.pageY}px`;
    del.addEventListener("click", (event) => deleteTag(event));
    e.target.appendChild(del);
    selectedElement = e;
    previousElement = e.target;
  } else if (previousElement) {
    previousElement.classList.remove("highlight");
    let deletePresent = previousElement.querySelector(".delete-tag");
    if (deletePresent) {
      deletePresent.remove();
    }
  }
};

let droppedTag = document.getElementsByClassName("clickable");

function setPadding() {
  let paddingUnit = document.getElementById("unit-for-padding");
  let padding = document.getElementById("padding-box");
  let paddingLeft = document.getElementById("left-padding-box");
  let paddingRight = document.getElementById("right-padding-box");
  let paddingTop = document.getElementById("top-padding-box");
  let paddingBottom = document.getElementById("bottom-padding-box");
  console.log(padding.value, selectedElement);
  if (selectedElement) {
    selectedElement.target.style.setProperty(
      "padding",
      padding.value + paddingUnit.value
    );
    // selectedElement.target.style.setProperty('--left-padding', paddingLeft.value + paddingUnit.value);
    // selectedElement.target.style.setProperty('--right-padding', paddingRight.value + paddingUnit.value);
    // selectedElement.target.style.setProperty('--bottom-padding', paddingBottom.value + paddingUnit.value);
    // selectedElement.target.style.setProperty('--top-padding', paddingTop.value + paddingUnit.value);
  }
}

function setText() {
  let text = document.getElementById("text-set").value;
  if (selectedElement) {
    console.log("got inside", selectedElement);
    selectedElement.target.innerText = text;
  }
}

function deleteTag(e) {
  e.target.parentElement.remove();
}
