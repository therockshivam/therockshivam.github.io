const htmlTags = [
  //'html',      // Root element
  //'head',      // Metadata
  //'title',     // Document title
  //'body',      // Document body
  "h1", // Main heading
  "h2", // heading 2
  "h3", // heading 3
  "h4", // heading 4
  "h5", // heading 5
  "h6", // heading 6
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
  // "style", // Style block
  "link", // Link to external resources
  // "script", // Script
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

//block level element list 
const blockElementList=['address','article','aside','blockquote','canvas','dd','div','dl','dt','fieldset','figcaption','figure','footer','form','H1','h2','h3','h4','h5','h6','header','hr','li','main','nav','noscript','ol','p','pre','section','table','tfoot','ul','video','video'];

body ="";
head = "";
title = "";
let showTagsBorder = false;

template = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${head}
    <title>${title}</title>
</head>
<body>
    ${body}
</body>
</html>`;

//code previewer
function convertAndPreview() {
  let preview = document.getElementById('main');
  let code = document.getElementById('code-preview');
  if (preview && code) {
    let text = preview.cloneNode(true); 
    let childNodesArray = Array.from(text.childNodes); 
    
    code.innerText='';
    childNodesArray.forEach(child => {
      if (child.classList) { 
        child.classList.remove('clickable', 'dropped-element', 'inner-drop-zone');
  
      }

    });
    code.innerText=text.innerHTML;

  }


}

function changeTheTemplate() {
  let preview = document.getElementById('main');
  let code = document.getElementById('code-preview');
  
  if (preview && code) {
    preview.innerHTML = code.innerText;
    
    let childNodesArray = Array.from(preview.childNodes); 
    
    childNodesArray.forEach(child => {
      if (child.nodeType === 1) { 
        child.classList.add('clickable', 'dropped-element', 'inner-drop-zone');
        // child.setAttribute('contenteditable', 'true');
      }
    });
  }
}


// Drag and drop functionality
function onDragStart(event) {
  event.dataTransfer.setData("text/plain", event.target.id);
  dragBackgroundColor = event.currentTarget.style.backgroundColor;
  event.currentTarget.style.backgroundColor = "#393053";
}

function onDrop(event) {
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
  );
  newContentElement.classList = "clickable dropped-element inner-drop-zone";
  newContentElement.innerHTML = newElement.childNodes[0].innerHTML;
  

  // console.log(newElement,'new element');

  newContentElement.contentEditable = true;

  newContentElement.addEventListener("dragover", (event) =>
    onDragOver(event)
  );
  newContentElement.addEventListener("ondrop", (event) => onDrop(event));
  newContentElement.addEventListener("dragstart", (event) =>
    onDragStart(event)
  );

  // Get the dropzone element and its rectangle
  const dropzone = event.target;
  const dropzoneRect = dropzone.getBoundingClientRect();

  // Calculate drop Y coordinate relative to dropzone
  const dropY = event.clientY - dropzoneRect.top;

  // Determine insert position
  let insertPosition;
  const dropzoneHeight = dropzoneRect.height;
  const threshold = dropzoneHeight / 3;

  if (dropY < threshold) {
    insertPosition = "top";
  } else if (dropY > dropzoneHeight - threshold) {
    insertPosition = "bottom";
  } else {
    insertPosition = "middle";
  }


  // Insert the new element at the appropriate position (after highlighting)
  switch (insertPosition) {
    case "top":
      if (dropzone.childNodes.length > 0) {
        dropzone.insertBefore(newContentElement, dropzone.firstChild);
      } else {
        dropzone.appendChild(newContentElement);
      }
      break;
    case "middle":
      const middleIndex = Math.floor(dropzone.childNodes.length / 2);
      dropzone.insertBefore(newContentElement, dropzone.childNodes[middleIndex]);
      break;
    case "bottom":
      dropzone.appendChild(newContentElement);
      break;
  }

  // Perform any additional actions after dropping (e.g., updating previews)
  convertAndPreview();
  changeTheTemplate()

  event.dataTransfer.clearData();
}

//drop area
function onDragOver(event) {
  event.currentTarget.classList.add('drag-highlight');
  event.preventDefault();
}

// function onDrop(event) {

//   event.preventDefault();

//   // Check for draggable element
//   const draggableElement = document.getElementById(
//     event.dataTransfer.getData("text/plain")
//   );

//   if (!draggableElement) {
//     console.warn(
//       "Element with ID",
//       event.dataTransfer.getData("text/plain"),
//       "not found"
//     );
//     event.dataTransfer.clearData();
//     return;
//   }

//   // Clone and modify the dragged element
//   const newElement = draggableElement.cloneNode(true);
//   const newContentElement = document.createElement(
//     newElement.firstChild.nodeName
//   );
//   newContentElement.classList = "clickable dropped-element inner-drop-zone";
//   newContentElement.textContent = newElement.textContent;
//   newContentElement.innerHTML=newElement.childNodes[0].innerHTML;

//   newContentElement.contentEditable = true;

//   newContentElement.addEventListener("ondragover", (event) =>
//     onDragOver(event)
//   );
//   newContentElement.addEventListener("ondrop", (event) => onDrop(event));
//   newContentElement.addEventListener("dragstart", (event) =>
//     onDragStart(event)
//   );

//   // Get the dropzone element and its rectangle
//   const dropzone = event.target;
//   const dropzoneRect = dropzone.getBoundingClientRect();

//   // Calculate drop Y coordinate relative to dropzone
//   const dropY = event.clientY - dropzoneRect.top;
//   const dropX = event.clientX - dropzoneRect.left;

//   console.log(event.clientY,event.clientX,"drop zone:", dropzoneRect);

//   //check is first element
//   if (dropzone.childNodes.length == 1) {
//     dropzone.appendChild(newContentElement);
//   } else {
//     // Determine insert position
//     let insertPosition;
//     const dropzoneHeight = dropzoneRect.height;
//     const threshold = dropzoneHeight / 3; // Adjust threshold as needed

//     if (dropY < threshold) {
//       insertPosition = "top";
//     } else if (dropY > dropzoneHeight - threshold) {
//       insertPosition = "bottom";
//     } else {
//       // Logic for determining left/middle/right
//       const dropzoneWidth = dropzoneRect.width;
//       const threshold = dropzoneWidth / 3; // Adjust threshold as needed

//       if (dropX < threshold) {
//         insertPosition = "left";
//       } else if (dropX > dropzoneWidth - threshold) {
//         insertPosition = "right";
//       } else {
//         insertPosition = "middle";
//       }
//     }

//     // Highlight the insert position (enhanced)
//     let highlightElement;
//     switch (insertPosition) {
//       case "top":
//         highlightElement = document.createElement("div");
//         highlightElement.classList.add("insertion-marker", "top");
//         dropzone.insertBefore(highlightElement, dropzone.firstChild);
//         break;
//       case "left":
//         highlightElement = document.createElement("div");
//         highlightElement.classList.add("insertion-marker", "left");
//         dropzone.insertBefore(highlightElement, dropzone.firstChild);
//         break;

//       case "middle":
//         highlightElement = document.createElement("div");
//         highlightElement.classList.add("insertion-marker", "middle");
//         const middleIndex = Math.floor(dropzone.childNodes.length / 2);
//         if (dropzone.childNodes.length > 0) {
//           dropzone.insertBefore(
//             highlightElement,
//             dropzone.childNodes[middleIndex]
//           );
//         } else {
//           dropzone.appendChild(highlightElement);
//         }
//         break;
//       case "right":
//         highlightElement = document.createElement("div");
//         highlightElement.classList.add("insertion-marker", "right");
//         dropzone.appendChild(highlightElement);
//         break;
//       case "bottom":
//         highlightElement = document.createElement("div");
//         highlightElement.classList.add("insertion-marker", "bottom");
//         dropzone.appendChild(highlightElement);
//         break;
//     }

//     // Ensure highlight visibility (add styling)
//     highlightElement.style.backgroundColor = "lightblue";
//     highlightElement.style.opacity = 0.5;

//     // Insert the new element at the appropriate position (after highlighting)
//     const childNodes = dropzone.childNodes;
//     switch (insertPosition) {
//       case "top":
//         if (childNodes.length > 1) {
//           dropzone.insertBefore(newContentElement, childNodes[0]);
//         } else {
//           dropzone.appendChild(newContentElement);
//         }
//         break;
//       case "left":
//         if (childNodes.length > 1) {
//           // Remove the highlight after insertion
//           dropzone.removeChild(childNodes[0]); // Assuming highlightElement is at index 0
//         }
//         dropzone.insertBefore(newContentElement, childNodes[1]); // Assuming newContentElement goes after highlight
//         break;
//       case "middle":
//         if (childNodes.length > 1) {
//           dropzone.removeChild(childNodes[0]); // Assuming highlightElement is at index 0
//         }
//         const middleIndex = Math.floor(childNodes.length / 2);
//         dropzone.insertBefore(newContentElement, childNodes[middleIndex]);
//         break;
//       case "right":
//         dropzone.appendChild(newContentElement); // Direct insertion for empty dropzone

//         if (childNodes.length > 0) {
//           dropzone.removeChild(childNodes[0]); // Assuming highlightElement is at index 0
//         }
//         dropzone.appendChild(newContentElement);
//         break;
//       case "bottom":
//         dropzone.appendChild(newContentElement);
//         break;
//     }

//   }

  
//   convertAndPreview();

//   event.dataTransfer.clearData();

// }

function dragEnd(event) {
  let main = document.getElementById("main");
  let innerContainer=document.getElementsByClassName('clickable');


  if (main ) {
    //revome background color after drop of dropzone
    main.classList.remove('drag-highlight'); 
  }

  if(innerContainer){
    Array.from(innerContainer).forEach(container => {
      container.classList.remove('drag-highlight');
    });

  
  }

   //remove background color of list item that is dragged after use
   event.currentTarget.style.backgroundColor = "";

  // event.preventDefault();
  showBorderSet();
  convertAndPreview();

}


function deleteTag(e) {
  e.target.parentElement.remove();
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
let styleElements = document.getElementsByClassName("style-input");

window.onclick = (e) => {
  if (e.target.classList.contains("clickable")) {

    if (styleElements.length > 0) {
      for (let i = 0; i < styleElements.length; i++) {
        styleElements[i].style.setProperty("pointer-events", "auto");
        styleElements[i].style.setProperty("opacity", "1");
        styleElements[i].style.setProperty("background-color", "");
      }
    }
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
    del.contentEditable = false;
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

document.getElementsByClassName('.clickable').contentEditable=true;
// e.target.contentEditable = true;  
};

let droppedTag = document.getElementsByClassName("clickable");

/** Set padding of selected container */
// function setPadding() {
//   let paddingUnit = document.getElementById("unit-for-padding");
//   let padding = document.getElementById("padding-box");
//   let paddingLeft = document.getElementById("left-padding-box");
//   let paddingRight = document.getElementById("right-padding-box");
//   let paddingTop = document.getElementById("top-padding-box");
//   let paddingBottom = document.getElementById("bottom-padding-box");
//   if (selectedElement) {
//     // selectedElement.target.style.setProperty(
//     //   "padding",
//     //   padding.value + paddingUnit.value 
//     // );

//     // selectedElement.target.style.setProperty('--left-padding', paddingLeft.value + paddingUnit.value);
//     // selectedElement.target.style.setProperty('--right-padding', paddingRight.value + paddingUnit.value);
//     // selectedElement.target.style.setProperty('--bottom-padding', paddingBottom.value + paddingUnit.value);
//     // selectedElement.target.style.setProperty('--top-padding', paddingTop.value + paddingUnit.value);
//   }
// }
/** Set padding of selected container */
/** Set padding of selected container */
function setPadding() {
  let paddingUnit = document.getElementById("unit-for-padding").value;
  let paddingLeft = document.getElementById("left-padding-box").value;
  let paddingRight = document.getElementById("right-padding-box").value;
  let paddingTop = document.getElementById("top-padding-box").value;
  let paddingBottom = document.getElementById("bottom-padding-box").value;

  // Collect non-empty padding values
  let paddingValues = [];
  if (paddingTop) paddingValues.push(paddingTop + paddingUnit);
  if (paddingRight) paddingValues.push(paddingRight + paddingUnit);
  if (paddingBottom) paddingValues.push(paddingBottom + paddingUnit);
  if (paddingLeft) paddingValues.push(paddingLeft + paddingUnit);

  if (selectedElement) {
    let paddingString;
    switch (paddingValues.length) {
      case 1:
        paddingString = `${paddingValues[0]}`;
        break;
      case 2:
        paddingString = `${paddingValues[0]} ${paddingValues[1]}`;
        break;
      case 4:
        paddingString = `${paddingValues[0]} ${paddingValues[1]} ${paddingValues[2]} ${paddingValues[3]}`;
        break;
      default:
        // If three or any other number of values, handle as required (fallback or error)
        paddingString = `${paddingValues[0] || 0}${paddingUnit} ${paddingValues[1] || 0}${paddingUnit} ${paddingValues[2] || 0}${paddingUnit} ${paddingValues[3] || 0}${paddingUnit}`;
    }

    selectedElement.target.style.setProperty("padding", paddingString);
  }
}

/** Set margin of selected container */
// function setMargin() {
//   let marginUnit = document.getElementById("unit-for-margin");
//   let margin = document.getElementById("margin-box");
//   let marginLeft = document.getElementById("left-margin-box");
//   let marginRight = document.getElementById("right-margin-box");
//   let marginTop = document.getElementById("top-margin-box");
//   let marginBottom = document.getElementById("bottom-margin-box");
//   // console.log(margin.value, selectedElement);
//   if (selectedElement) {
//     selectedElement.target.style.setProperty(
//       "margin",
//       margin.value + marginUnit.value
//     );
//     // selectedElement.target.style.setProperty('--left-padding', paddingLeft.value + paddingUnit.value);
//     // selectedElement.target.style.setProperty('--right-padding', paddingRight.value + paddingUnit.value);
//     // selectedElement.target.style.setProperty('--bottom-padding', paddingBottom.value + paddingUnit.value);
//     // selectedElement.target.style.setProperty('--top-padding', paddingTop.value + paddingUnit.value);
//   }
// }

/** Set margin of selected container */
function setMargin() {
  let marginUnit = document.getElementById("unit-for-margin").value;
  let marginLeft = document.getElementById("left-margin-box").value;
  let marginRight = document.getElementById("right-margin-box").value;
  let marginTop = document.getElementById("top-margin-box").value;
  let marginBottom = document.getElementById("bottom-margin-box").value;

  // Collect non-empty margin values
  let marginValues = [];
  if (marginTop) marginValues.push(marginTop + marginUnit);
  if (marginRight) marginValues.push(marginRight + marginUnit);
  if (marginBottom) marginValues.push(marginBottom + marginUnit);
  if (marginLeft) marginValues.push(marginLeft + marginUnit);

  if (selectedElement) {
    let marginString;
    switch (marginValues.length) {
      case 1:
        marginString = `${marginValues[0]}`;
        break;
      case 2:
        marginString = `${marginValues[0]} ${marginValues[1]}`;
        break;
      case 4:
        marginString = `${marginValues[0]} ${marginValues[1]} ${marginValues[2]} ${marginValues[3]}`;
        break;
      default:
        // If three or any other number of values, handle as required (fallback or error)
        marginString = `${marginValues[0] || 0}${marginUnit} ${marginValues[1] || 0}${marginUnit} ${marginValues[2] || 0}${marginUnit} ${marginValues[3] || 0}${marginUnit}`;
    }

    selectedElement.target.style.setProperty("margin", marginString);
  }
}

function setText() {
  let text = document.getElementById("text-set").value;
  if (selectedElement) {
    // console.log("got inside", selectedElement);
    selectedElement.target.innerText = text;
  }
}

function textAlign(align) {
  selectedElement.target.style.setProperty("text-align", align);
}

function sentFontStyle(textStyle) {
  selectedElement.target.style.setProperty("font-style", textStyle);
}

function setColor() {
  let colorPicker = document.getElementById("color-picker");
  document.getElementById("color-preview").style.backgroundColor =
    colorPicker.value;
  selectedElement.target.style.setProperty(
    "color",
    margin.value + marginUnit.value
  );
}

colorFor = "color";
function setColorFor() {
  colorFor = document.getElementById("color-for").value;
}

function setColorByColorPicker() {
  let colorPicker = document.getElementById("color-picker");
  // document.getElementById('color-input').value = colorPicker.target.value;
  document.getElementById("color-preview").style.backgroundColor =
    colorPicker.value;
  selectedElement.target.style.setProperty(colorFor, colorPicker.value);
}

function setColorByNameOrHex() {
  let colorInput = document.getElementById("color-input");
  document.getElementById("color-preview").style.backgroundColor =
    colorInput.value;
  selectedElement.target.style.setProperty(colorFor, colorInput.value);
}

function setWidth(){
let widthUnit=document.getElementById('unit-for-width');
let width=document.getElementById('resizeWidth');
if (selectedElement) {
  if(selectedElement.target.nodeName in blockElementList){
    selectedElement.target.style.setProperty(
      "display",'inline-block'
    )
    // console.log('its inline');
  }else{
    // console.log('not inline');
  }
  selectedElement.target.style.setProperty(
    "width",
    width.value + widthUnit.value
  );
}
}

function setHeight(){
  let heightUnit=document.getElementById('unit-for-height');
  let height=document.getElementById('resizeWidth');

  if(blockElementList.includes(selectedElement.target.nodeName,0)){
    selectedElement.target.style.setProperty(
      "display",'inline-block'
    )

    // console.log('its inline',selectedElement.target.nodeName);
  }else{
    // console.log('not inline',selectedElement.target.nodeName);
  }
  if (selectedElement) {
    selectedElement.target.style.setProperty(
      "height",
      height.value + heightUnit.value
    );
  }
}

function downloadDivContent() {
  // Select the div element by id
  const divElement = document.getElementById("main");

    // Remove contenteditable from all applicable elements
    document.querySelectorAll('div[contenteditable], p[contenteditable], h1[contenteditable], span[contenteditable], h2[contenteditable], h3[contenteditable], h4[contenteditable], h5[contenteditable], h6[contenteditable]').forEach(el => {
      el.removeAttribute('contenteditable');
  });

  // Check if the element exists
  if (divElement) {
    // Get the HTML content inside the div
    const htmlContent = divElement.innerHTML;

    // Create a blob with the HTML content
    const blob = new Blob([htmlContent], { type: "text/html" });

    // Create a download link
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "main_content.html";

    // Append the link to the body
    document.body.appendChild(a);

    // Simulate a click on the link to trigger the download
    a.click();

    // Clean up: remove the link from the DOM
    document.body.removeChild(a);
  } else {
    console.error('Element with id "main" not found.');
  }
}

function encryptAndDownload() {
  const divContent = document.getElementById("main").innerHTML; // Get HTML content
  const encryptedContent = CryptoJS.AES.encrypt(
    divContent,
    "secret-key"
  ).toString(); // Encrypt content

  // Create a blob with the encrypted content
  const blob = new Blob([encryptedContent], { type: "text/plain" });

  // Create a download link
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "encrypted_content.txt"; // Download as a text file (can change extension)

  // Append the link to the body
  document.body.appendChild(a);

  // Simulate a click on the link to trigger the download
  a.click();

  // Clean up: remove the link from the DOM
  document.body.removeChild(a);
}

function decryptContent(encryptedContent) {
  const bytes = CryptoJS.AES.decrypt(encryptedContent, "secret-key");
  const originalContent = bytes.toString(CryptoJS.enc.Utf8);
  return originalContent;
}



const encryptedContent = "YOUR_ENCRYPTED_CONTENT_HERE";
const decryptedContent = decryptContent(encryptedContent);
document.getElementById("main").innerHTML = decryptedContent;




function showBorder() {
  showTagsBorder = !showTagsBorder;
 showBorderSet();
}

function showBorderSet(){
  // console.log('called')
  let items = document.getElementsByClassName('clickable');
  const borderButton=document.getElementById('border-show-hide-button');
  if (items.length > 0 || borderButton) {
    if (showTagsBorder) {
      borderButton.innerText='Hide Border';
      Array.from(items).forEach(item => {
        
      item.classList.add('show-border');
      });
    } else {
      borderButton.innerText='Show Border';
      Array.from(items).forEach(item => {
        if (item.classList) { 
        item.classList.remove('show-border')
        }
      }); 
    }
  }
}




// document.addEventListener("DOMContentLoaded", function() {
//   const dropzone = document.getElementById("main");

//   function createGrid() {
//     for (let i = 0; i < 9; i++) {
//       const cell = document.createElement("div");
//       cell.classList.add("grid-cell");
//       dropzone.appendChild(cell);
//     }
//   }

//   createGrid();

//   function onDragOver(event) {
//     event.preventDefault();
//     event.dataTransfer.dropEffect = "move";
    
//     // Determine which cell is being hovered
//     const cells = Array.from(dropzone.getElementsByClassName("grid-cell"));
//     const dropzoneRect = dropzone.getBoundingClientRect();
//     const x = event.clientX - dropzoneRect.left;
//     const y = event.clientY - dropzoneRect.top;
    
//     const cellWidth = dropzoneRect.width / 3;
//     const cellHeight = dropzoneRect.height / 3;
    
//     const col = Math.floor(x / cellWidth);
//     const row = Math.floor(y / cellHeight);
//     const index = row * 3 + col;

//     cells.forEach(cell => cell.classList.remove("highlight"));
//     cells[index].classList.add("highlight");
//   }

//   function onDrop(event) {
//     event.preventDefault();

//     // Check for draggable element
//     const draggableElement = document.getElementById(
//       event.dataTransfer.getData("text/plain")
//     );

//     if (!draggableElement) {
//       console.warn(
//         "Element with ID",
//         event.dataTransfer.getData("text/plain"),
//         "not found"
//       );
//       event.dataTransfer.clearData();
//       return;
//     }

//     // Clone and modify the dragged element
//     const newElement = draggableElement.cloneNode(true);
//     const newContentElement = document.createElement(
//       newElement.firstChild.nodeName
//     );
//     newContentElement.classList = "clickable dropped-element inner-drop-zone";
//     newContentElement.textContent = newElement.textContent;
//     newContentElement.innerHTML = newElement.innerHTML;

//     newContentElement.contentEditable = true;

//     newContentElement.addEventListener("dragover", onDragOver);
//     newContentElement.addEventListener("drop", onDrop);
//     newContentElement.addEventListener("dragstart", onDragStart);

//     // Determine which cell is being hovered
//     const cells = Array.from(dropzone.getElementsByClassName("grid-cell"));
//     const dropzoneRect = dropzone.getBoundingClientRect();
//     const x = event.clientX - dropzoneRect.left;
//     const y = event.clientY - dropzoneRect.top;

//     const cellWidth = dropzoneRect.width / 3;
//     const cellHeight = dropzoneRect.height / 3;

//     const col = Math.floor(x / cellWidth);
//     const row = Math.floor(y / cellHeight);
//     const index = row * 3 + col;

//     cells.forEach(cell => cell.classList.remove("highlight"));
//     cells[index].classList.add("highlight");

//     // Insert the new element in the highlighted cell
//     cells[index].appendChild(newContentElement);

//     event.dataTransfer.clearData();
//   }

//   dropzone.addEventListener("dragover", onDragOver);
//   dropzone.addEventListener("drop", onDrop);
// });

// function onDragStart(event) {
//   event.dataTransfer.setData("text/plain", event.target.id);
//   event.dataTransfer.effectAllowed = "move";
// }


  
function closeSidebar(which){
if(which=='left'){

document.getElementById('sidebar-left').style.display='none'
document.getElementById('expand-left-sidebar').style.display='block'

} else if(which=='right'){

  document.getElementById('sidebar-right').style.display='none'
  document.getElementById('expand-right-sidebar').style.display='block'

}
}

function expandSidebar(which){
if(which=='left'){
  document.getElementById('sidebar-left').style.display='block'
document.getElementById('expand-left-sidebar').style.display='none'
}else if(which=='right'){
    document.getElementById('sidebar-right').style.display='block'
document.getElementById('expand-right-sidebar').style.display='none'
}
}


function themeChanged(){
  alert('working on it')
}


// document.querySelectorAll('div, p, h1, span').forEach(element => {
//   element.addEventListener('click', function() {
//       // Remove contenteditable from all applicable elements
//       document.querySelectorAll('div, p, h1, span').forEach(el => el.removeAttribute('contenteditable'));
      
//       // Set contenteditable to the clicked element
//       this.setAttribute('contenteditable', 'true');

//       // Optionally, focus on the clicked element
//       this.focus();
//   });
// });