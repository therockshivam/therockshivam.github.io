const undoStack = [];
const redoStack = [];
const canvas = document.getElementById('canvas');
// const draggables = document.querySelectorAll('.draggable');
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
//       div.setAttribute('draggable', 'true');
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
      el.src = 'https://via.placeholder.com/100';
      el.alt = 'Placeholder Image';
      el.style.width = '100px';
      return el;
    }
  };
  

  function renderStyleEditor() {
    const editor = document.querySelector('#editor');
    editor.innerHTML = '<h3>Style Editor</h3>';
  
    styleFields.forEach(field => {
      const label = document.createElement('label');
      label.innerText = `${field.label}: `;
  
      const input = document.createElement('input');
      input.type = field.type;
      input.id = field.id;
      if (field.value !== undefined) {
        input.value = field.value;
      }
  
      label.appendChild(input);
      editor.appendChild(label);
    });
  
    const delBtn = document.createElement('button');
    delBtn.id = 'floatingDelete';
    delBtn.innerText = '🗑';
    delBtn.style.position = 'absolute';
    delBtn.style.display = 'none';
  
    editor.appendChild(delBtn);
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderToolbox();
    renderStyleEditor();
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
const textContentInput = document.getElementById('textContent');
const fontSizeInput = document.getElementById('fontSize');
const bgColorInput = document.getElementById('bgColor');

function selectElement(el) {
  if (selectedElement) {
    selectedElement.classList.remove('selected-element');
  }

  selectedElement = el;
  selectedElement.classList.add('selected-element');

  textContentInput.value = el.innerText;
  fontSizeInput.value = parseInt(window.getComputedStyle(el).fontSize);
  bgColorInput.value = rgbToHex(window.getComputedStyle(el).backgroundColor);

  showDeleteButton(el);
}

textContentInput.addEventListener('input', () => {
  if (selectedElement) {
    const before = selectedElement.innerText;
    selectedElement.innerText = textContentInput.value;
    recordAction('text', selectedElement, before, selectedElement.innerText);
    updateHtmlEditor();
  }
});

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
  el.addEventListener('dragstart', e => {
    e.stopPropagation();
    e.dataTransfer.setData('dragged-element-id', el.dataset.id);
  });
}

// RAW HTML EDITOR: Update the textarea
function updateHtmlEditor() {
  const htmlContent = canvas.innerHTML;
  document.getElementById('htmlEditor').value = htmlContent;
}

// Apply the raw HTML from the editor
function applyRawHtml() {
  const html = document.getElementById('htmlEditor').value;
  canvas.innerHTML = html;
  updateHtmlEditor(); // Refresh the editor after applying
}
