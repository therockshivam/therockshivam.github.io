const undoStack = [];
const redoStack = [];
const canvas = document.getElementById('canvas');

const draggables = document.querySelectorAll('.draggable');
draggables.forEach(el => {
  el.addEventListener('dragstart', e => {
    e.dataTransfer.setData('type', e.target.dataset.type);
  });
});
let selectedElement = null;
let elementIdCounter = 0;

const toolboxItems = [
    { type: 'button', label: 'Button' },
    { type: 'paragraph', label: 'Paragraph' },
    { type: 'heading', label: 'Heading' },
    { type: 'image', label: 'Image' }
  ];
  
  const styleFields = [
    { label: 'Text', type: 'text', id: 'textContent' },
    { label: 'Font Size', type: 'number', id: 'fontSize', value: 16 },
    { label: 'Background Color', type: 'color', id: 'bgColor' },
    { label: 'Text Color', type: 'color', id: 'textColor' }
  ];

//   function renderToolbox() {
//     const toolbox = document.querySelector('.toolbox');
//     toolbox.innerHTML = '<h3>Toolbox</h3>';
//     toolboxItems.forEach(item => {
//       const div = document.createElement('div');
//       div.className = 'draggable';
      // div.setAttribute('draggable', 'true');
//       div.setAttribute('data-type', item.type);
//       div.textContent = item.label;
//       toolbox.appendChild(div);
//     });
//   }

function renderToolbox() {
    const toolbox = document.querySelector('.toolbox');
    toolbox.innerHTML = '<h3>Toolbox</h3>';
    toolboxItems.forEach(item => {
      const div = document.createElement('div');
      div.className = 'draggable';
      div.setAttribute('draggable', 'true');
      div.setAttribute('data-type', item.type);
      div.textContent = item.label;
      toolbox.appendChild(div);
    });
  
    // 🔧 Add event listeners after rendering
    const draggables = document.querySelectorAll('.draggable');
    draggables.forEach(el => {
      el.addEventListener('dragstart', e => {
        e.dataTransfer.setData('type', e.target.dataset.type);
      });
    });
  }
  

  const elementTemplates = {
    button: () => {
      const el = document.createElement('button');
      el.innerText = 'Click Me';
      return el;
    },
    paragraph: () => {
      const el = document.createElement('p');
      el.innerText = 'Editable paragraph';
      return el;
    },
    heading: () => {
      const el = document.createElement('h1');
      el.innerText = 'Heading';
      return el;
    },
    image: () => {
      const el = document.createElement('img');
      el.src = 'image editor.png';
      el.alt = 'Placeholder Image';
      el.style.width = '100px';
      return el;
    }
  };
  

  // function renderStyleEditor() {
  //   const editor = document.querySelector('#editor');
  //   editor.innerHTML = '<h3>Style Editor</h3>';
  
  //   styleFields.forEach(field => {
  //     const label = document.createElement('label');
  //     label.innerText = `${field.label}: `;
  
  //     const input = document.createElement('input');
  //     input.type = field.type;
  //     input.id = field.id;
  //     if (field.value !== undefined) {
  //       input.value = field.value;
  //     }
  
  //     label.appendChild(input);
  //     editor.appendChild(label);
  //   });
  
  //   const delBtn = document.createElement('button');
  //   delBtn.id = 'floatingDelete';
  //   delBtn.innerText = '🗑';
  //   delBtn.style.position = 'absolute';
  //   delBtn.style.display = 'none';
  
  //   editor.appendChild(delBtn);
  // }

  document.addEventListener('DOMContentLoaded', () => {
    renderToolbox();
    // renderStyleEditor();
    loadHtmlContent();
  });
  
  

// DRAG AND DROP
draggables.forEach(el => {
  el.addEventListener('dragstart', e => {
    e.dataTransfer.setData('type', e.target.dataset.type);
  });
});

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
    // 🧲 Moving existing element
    newEl = document.querySelector(`[data-id='${draggedId}']`);
    if (insertBefore) {
      canvas.insertBefore(newEl, insertBefore);
    } else {
      canvas.appendChild(newEl);
    }
    recordAction('move', newEl, null, null);
    return;
  }

  // 🎯 Fresh element drop
  if (!type) return;

//   if (type === 'button') {
//     newEl = document.createElement('button');
//     newEl.innerText = 'Click Me';
//   } else if (type === 'paragraph') {
//     newEl = document.createElement('p');
//     newEl.innerText = 'Editable paragraph';
//   }

if (elementTemplates[type]) {
    newEl = elementTemplates[type]();
  } else {
    console.warn('Unsupported element type:', type);
  }

  newEl.dataset.id = `el-${elementIdCounter++}`;
  makeDraggable(newEl);
  newEl.addEventListener('click', () => selectElement(newEl));

  if (insertBefore) {
    canvas.insertBefore(newEl, insertBefore);
  } else {
    canvas.appendChild(newEl);
  }

  recordAction('add', newEl, null, newEl.outerHTML);
  updateHtmlEditor();
});

// STYLE & CONTENT EDITOR
// const textContentInput = document.getElementById('textContent');
// const fontSizeInput = document.getElementById('fontSize');
// const bgColorInput = document.getElementById('bgColor');

function selectElement(el) {
  if (selectedElement) {
    selectedElement.classList.remove('selected-element');
  }

  selectedElement = el;
  selectedElement.classList.add('selected-element');

  // textContentInput.value = el.innerText;
  // fontSizeInput.value = parseInt(window.getComputedStyle(el).fontSize);
  // bgColorInput.value = rgbToHex(window.getComputedStyle(el).backgroundColor);

  showDeleteButton(el);
}

  
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




// style editor


