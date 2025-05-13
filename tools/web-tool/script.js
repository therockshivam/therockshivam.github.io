const undoStack = [];
const redoStack = [];
const canvas = document.getElementById('canvas');
let selectedElement = null;
let elementIdCounter = 0;

// TOOLBOX CONFIG
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



const tagProperties = {
  img: { src: 'image editor.png', alt: 'Image description' },
  a: { href: '#', innerText: 'Link' },
  input: { type: 'text', placeholder: 'Enter text' },
  textarea: { placeholder: 'Type something...' },
  button: { innerText: 'Click Me' }
};

const elementTemplates = {};
htmlTags.forEach(tag => {
  elementTemplates[tag] = () => {
    const el = document.createElement(tag);
    const props = tagProperties[tag];
    if (props) {
      for (const [key, value] of Object.entries(props)) {
        if (key === 'innerText') {
          el.innerText = value;
        } else {
          el.setAttribute(key, value);
        }
      }
    } else {
      el.innerText = `${tag.toUpperCase()} Element`;
    }
    return el;
  };
});

// 🔧 TOOLBOX RENDERING
function renderToolbox(filter = "") {
  const toolbox = document.querySelector('.toolbox');
  toolbox.innerHTML = '<h3>Toolbox</h3>';

  // Reusing filter-input class
  const searchBox = document.createElement('input');
  searchBox.type = 'text';
  searchBox.style.width = "100%";
  searchBox.style.padding = "8px";
  searchBox.style.marginBottom = "10px";
  searchBox.style.fontSize = "14px";
  searchBox.placeholder = 'Search HTML elements...';
  searchBox.classList.add('filter-input');
  searchBox.value = filter;
  searchBox.setAttribute('data-filter-type', 'html');

  searchBox.addEventListener('input', (e) => {
    renderToolbox(e.target.value);
  });

  toolbox.appendChild(searchBox);

  const filteredTags = htmlTags.filter(tag => tag.toLowerCase().includes(filter.toLowerCase()));

  filteredTags.forEach(tag => {
    const item = document.createElement('div');
    item.className = 'draggable';
    item.setAttribute('draggable', 'true');
    item.setAttribute('data-type', tag);
    item.innerText = tag;
    toolbox.appendChild(item);
  });

  document.querySelectorAll('.draggable').forEach(el => {
    el.addEventListener('dragstart', e => {
      e.dataTransfer.setData('type', e.target.dataset.type);
    });
  });
}


// 👇 DRAG OVER CANVAS
canvas.addEventListener('dragover', e => e.preventDefault());

canvas.addEventListener('drop', e => {
  e.preventDefault();

  const draggedId = e.dataTransfer.getData('dragged-element-id');
  const type = e.dataTransfer.getData('type');
  let newEl;
  const mouseY = e.clientY;
  let insertBefore = null;

  for (let child of canvas.children) {
    const rect = child.getBoundingClientRect();
    if (mouseY < rect.top + rect.height / 2) {
      insertBefore = child;
      break;
    }
  }

  if (draggedId) {
    // Move existing element
    newEl = document.querySelector(`[data-id='${draggedId}']`);
    if (insertBefore) {
      canvas.insertBefore(newEl, insertBefore);
    } else {
      canvas.appendChild(newEl);
    }
    recordAction('move', newEl, null, null);
    return;
  }

  if (!type || !elementTemplates[type]) return;

  newEl = elementTemplates[type]();
  newEl.dataset.id = `el-${elementIdCounter++}`;
  makeDraggable(newEl);
  newEl.addEventListener('click', () => selectElement(newEl));

  if (insertBefore) {
    canvas.insertBefore(newEl, insertBefore);
  } else {
    canvas.appendChild(newEl);
  }

  recordAction('add', newEl, null, newEl.outerHTML);
  updateHtmlEditor?.(); // Optional preview update
});

// ✅ Make element draggable
function makeDraggable(el) {
  el.setAttribute('draggable', 'true');
  el.addEventListener('dragstart', e => {
    e.dataTransfer.setData('dragged-element-id', el.dataset.id);
  });
}

// ✅ Select element
function selectElement(el) {
  if (selectedElement) {
    selectedElement.classList.remove('selected-element');
  }

  selectedElement = el;
  selectedElement.classList.add('selected-element');
  showDeleteButton?.(el);
}

// ✅ Record undo/redo action
function recordAction(action, element, oldValue, newValue) {
  undoStack.push({ action, element, oldValue, newValue });
}

// ✅ INIT
document.addEventListener('DOMContentLoaded', () => {
  renderToolbox();
  loadHtmlContent?.();
});


  
const cssProperties = [
  "align-items", "align-content", "align-self", "justify-content", "justify-items", "justify-self", "flex-direction", "flex-wrap", "flex-flow", "flex", "flex-grow", "flex-shrink", "flex-basis", "order", "grid-template-columns", "grid-template-rows", "grid-template-areas", "grid-template", "grid-auto-columns", "grid-auto-rows", "grid-auto-flow", "grid", "grid-row-start", "grid-column-start", "grid-row-end", "grid-column-end", "grid-row", "grid-column", "grid-area", "gap", "row-gap", "column-gap", "place-content", "place-items", "place-self", "width", "height", "min-width", "min-height", "max-width", "max-height", "padding", "padding-top", "padding-right", "padding-bottom", "padding-left", "margin", "margin-top", "margin-right", "margin-bottom", "margin-left", "border", "border-width", "border-style", "border-color", "border-top", "border-right", "border-bottom", "border-left", "border-radius", "box-shadow", "background", "background-color", "background-image", "background-size", "background-repeat", "background-position", "color", "font-size", "font-weight", "font-style", "font-family", "text-align", "text-decoration", "line-height", "letter-spacing", "word-spacing", "white-space", "overflow", "overflow-x", "overflow-y", "visibility", "z-index", "position", "top", "right", "bottom", "left", "display", "vertical-align", "opacity", "cursor", "transition", "transition-property", "transition-duration", "transition-timing-function", "animation", "animation-name", "animation-duration", "animation-timing-function", "animation-delay", "animation-iteration-count", "animation-direction", "animation-fill-mode", "animation-play-state", "transform", "transform-origin", "clip", "filter", "box-sizing", "object-fit", "object-position", "resize", "pointer-events", "user-select", "content", "quotes", "counter-reset", "counter-increment", "list-style", "list-style-type", "list-style-position", "list-style-image", "table-layout", "border-collapse", "border-spacing", "empty-cells", "caption-side", "direction", "unicode-bidi", "writing-mode", "text-orientation", "hyphens", "tab-size", "word-break", "word-wrap", "overflow-wrap"
];


const styleOptions = cssProperties.map(prop => {
  const label = prop
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  let type = "input";
  let inputType = "text";
  let options;

  const selectProps = {
    "display": ["block", "inline", "flex", "inline-flex", "grid", "inline-block", "none"],
    "position": ["static", "relative", "absolute", "fixed", "sticky"],
    "flex-direction": ["row", "row-reverse", "column", "column-reverse"],
    "flex-wrap": ["nowrap", "wrap", "wrap-reverse"],
    "justify-content": ["flex-start", "flex-end", "center", "space-between", "space-around", "space-evenly"],
    "align-items": ["stretch", "flex-start", "flex-end", "center", "baseline"],
    "text-align": ["left", "center", "right", "justify"],
    "font-weight": ["normal", "bold", "bolder", "lighter", "100", "200", "300", "400", "500", "600", "700", "800", "900"],
    "overflow": ["visible", "hidden", "scroll", "auto"],
    "white-space": ["normal", "nowrap", "pre", "pre-line", "pre-wrap"]
  };

  if (prop.includes("color")) {
    inputType = "color";
  }

  if (selectProps[prop]) {
    type = "select";
    options = selectProps[prop];
  }

  const entry = { label, property: prop, type };

  if (type === "input") {
    entry.inputType = inputType;
    const pixelProperties = [
      "width", "height", "padding", "margin", "top", "left", "right", "bottom",
      "font-size", "border-width", "border-radius", "line-height", "letter-spacing",
      "gap", "row-gap", "column-gap"
    ];

    const unitlessProperties = ["opacity", "z-index", "order", "flex-grow", "flex-shrink", "font-weight"];
    const keywordProperties = ["cursor", "background", "overflow", "position", "display"];

    if (pixelProperties.includes(prop)) {
      entry.placeholder = "e.g. 10px, 1em, auto";
    } else if (unitlessProperties.includes(prop)) {
      entry.placeholder = "e.g. 0, 0.5, 1";
    } else if (keywordProperties.includes(prop)) {
      entry.placeholder = "e.g. pointer, cover, hidden";
    } else {
      entry.placeholder = "Enter value";
    }
  } else if (type === "select") {
    entry.options = options;
  }

  return entry;
});

function renderStylePanel(styles, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = ""; // clear old content

  styles.forEach(style => {
    const wrapper = document.createElement("div");
    wrapper.className = "style-control";

    const label = document.createElement("label");
    label.innerText = style.label;
    wrapper.appendChild(label);

    let input;
    if (style.type === "input") {
      input = document.createElement("input");
      input.type = style.inputType || "text";
      input.placeholder = style.placeholder || "";
    } else if (style.type === "select") {
      input = document.createElement("select");
      style.options.forEach(opt => {
        const option = document.createElement("option");
        option.value = opt;
        option.textContent = opt;
        input.appendChild(option);
      });
    }

    input.addEventListener("input", () => {
      // const selected = document.getElementsByClassName("selected-element")[0];
      // selectedElement = selected;
      if (selectedElement) {
        selectedElement.style.setProperty(style.property, input.value);
      }
    });

    wrapper.appendChild(input);
    container.appendChild(wrapper);
  });
}

// Search functionality
function filterAndRenderStyles(filterText, allStyles, containerId) {
  const filtered = allStyles.filter(style =>
    style.label.toLowerCase().includes(filterText.toLowerCase())
  );
  renderStylePanel(filtered, containerId);
}

// Create search input
function createSearchInput(allStyles, containerId) {
  const wrapper = document.getElementById(containerId).parentElement;
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Search CSS property...";
  input.style.width = "100%";
  input.style.padding = "8px";
  input.style.marginBottom = "10px";
  input.style.fontSize = "14px";

  input.addEventListener("input", () => {
    filterAndRenderStyles(input.value, allStyles, containerId);
  });

  wrapper.insertBefore(input, wrapper.firstChild);
}

// Final call
renderStylePanel(styleOptions, "style-options-container");
createSearchInput(styleOptions, "style-options-container");

// textContentInput.addEventListener('input', () => {
//   if (selectedElement) {
//     const before = selectedElement.innerText;
//     selectedElement.innerText = textContentInput.value;
//     recordAction('text', selectedElement, before, selectedElement.innerText);
//     updateHtmlEditor();
//   }
// });

fontSizeInput.addEventListener('input', () => {
  if (selectedElement) {
    const before = selectedElement.style.fontSize;
    selectedElement.style.fontSize = `${fontSizeInput.value}px`;
    recordAction('style', selectedElement, { fontSize: before }, { fontSize: selectedElement.style.fontSize });
    updateHtmlEditor();
  }
});

bgColorInput.addEventListener('input', () => {
  if (selectedElement) {
    const before = selectedElement.style.backgroundColor;
    selectedElement.style.backgroundColor = bgColorInput.value;
    recordAction('style', selectedElement, { backgroundColor: before }, { backgroundColor: selectedElement.style.backgroundColor });
    updateHtmlEditor();
  }
});

function rgbToHex(rgb) {
  const result = rgb.match(/\d+/g).map(x => (+x).toString(16).padStart(2, '0'));
  return `#${result.join('')}`;
}

// ACTION-BASED UNDO/REDO
function recordAction(type, target, before, after) {
  undoStack.push({ type, target, before, after });
  redoStack.length = 0;
}

function undo() {
  const action = undoStack.pop();
  if (!action) return;
  redoStack.push(action);

  switch (action.type) {
    case 'add':
      action.target.remove();
      break;
    case 'remove':
      canvas.appendChild(action.target);
      break;
    case 'text':
      action.target.innerText = action.before;
      break;
    case 'style':
      Object.assign(action.target.style, action.before);
      break;
    case 'move':
      // Move action handling
      break;
  }
  updateHtmlEditor();
}

function redo() {
  const action = redoStack.pop();
  if (!action) return;
  undoStack.push(action);

  switch (action.type) {
    case 'add':
      canvas.appendChild(action.target);
      break;
    case 'remove':
      action.target.remove();
      break;
    case 'text':
      action.target.innerText = action.after;
      break;
    case 'style':
      Object.assign(action.target.style, action.after);
      break;
    case 'move':
      // Move action handling
      break;
  }
  updateHtmlEditor();
}

// KEYBOARD SHORTCUTS
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'z') {
    e.preventDefault();
    undo();
  } else if (e.ctrlKey && e.key === 'y') {
    e.preventDefault();
    redo();
  }
});

// DELETE BUTTON FUNCTIONALITY
document.getElementById('deleteBtn').addEventListener('click', () => {
  if (selectedElement) {
    const target = selectedElement;
    recordAction('remove', target, target.outerHTML, null);
    target.remove();
    selectedElement = null;
    updateHtmlEditor();
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Delete' && selectedElement) {
    const target = selectedElement;
    recordAction('remove', target, target.outerHTML, null);
    target.remove();
    selectedElement = null;
    updateHtmlEditor();
  }
});

function showDeleteButton(el) {

  const rect = el.getBoundingClientRect();
  const deleteBtn = document.getElementById('floatingDelete');
      if (!deleteBtn) {
    console.warn('floatingDelete button not found in DOM.');
    return;
  }
  deleteBtn.style.top = `${rect.top - 10 + window.scrollY}px`;
  deleteBtn.style.left = `${rect.right + 10 + window.scrollX}px`;
  deleteBtn.style.display = 'block';

  deleteBtn.onclick = () => {
    recordAction('remove', el, el.outerHTML, null);
    el.remove();
    deleteBtn.style.display = 'none';
    selectedElement = null;
    updateHtmlEditor();
  };
}

document.addEventListener('click', (e) => {
  if (!canvas.contains(e.target) && e.target.id !== 'floatingDelete') {
    if (selectedElement) selectedElement.classList.remove('selected-element');
    document.getElementById('floatingDelete').style.display = 'none';
    selectedElement = null;
  }
});

function makeDraggable(el) {
  el.setAttribute('draggable', true);
  // el.setAttribute('contenteditable', true);
  
  el.addEventListener('dragstart', e => {
    e.stopPropagation();
    e.dataTransfer.setData('dragged-element-id', el.dataset.id);
  });
}

// RAW HTML EDITOR: Update the textarea
function updateHtmlEditor() {
  const htmlContent = canvas.innerHTML;
  document.getElementById('code-preview').innerText = htmlContent;
    localStorage.setItem('htmlContent', htmlContent);
}

// Apply the raw HTML from the editor
function applyRawHtml() {
  const html = document.getElementById('code-preview').innerText;
  canvas.innerHTML = html; 
   localStorage.setItem('htmlContent', html);
  // updateHtmlEditor(); // Refresh the editor after applying
}

function loadHtmlContent() {
  const savedHtml = localStorage.getItem('htmlContent');
  if (savedHtml) {
    canvas.innerHTML = savedHtml;
    updateHtmlEditor();
  }
}

function clearCode(){
  document.getElementById('code-preview').innerText = '';
  canvas.innerHTML = '';
  selectedElement = null;
  undoStack.length = 0;
  redoStack.length = 0;
  updateHtmlEditor();
}


function downloadDivContent() {
  // Select the div element by id
  const divElement = canvas;

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
