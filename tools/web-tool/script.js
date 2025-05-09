const canvas = document.getElementById('canvas');
const draggables = document.querySelectorAll('.draggable');
let selectedElement = null;

// DRAG EVENTS
draggables.forEach(el => {
  el.addEventListener('dragstart', e => {
    e.dataTransfer.setData('type', e.target.dataset.type);
  });
});

canvas.addEventListener('dragover', e => {
  e.preventDefault();
});

canvas.addEventListener('drop', e => {
  e.preventDefault();
  const type = e.dataTransfer.getData('type');
  let newEl;
  if (type === 'button') {
    newEl = document.createElement('button');
    newEl.innerText = 'Click Me';
  } else if (type === 'paragraph') {
    newEl = document.createElement('p');
    newEl.innerText = 'Editable paragraph';
  }
  newEl.addEventListener('click', () => selectElement(newEl));
  canvas.appendChild(newEl);
});

// STYLE EDITOR
const textContentInput = document.getElementById('textContent');
const fontSizeInput = document.getElementById('fontSize');
const bgColorInput = document.getElementById('bgColor');

function selectElement(el) {
  selectedElement = el;
  textContentInput.value = el.innerText;
  fontSizeInput.value = parseInt(window.getComputedStyle(el).fontSize);
  bgColorInput.value = rgbToHex(window.getComputedStyle(el).backgroundColor);
}

textContentInput.addEventListener('input', () => {
  if (selectedElement) selectedElement.innerText = textContentInput.value;
});

fontSizeInput.addEventListener('input', () => {
  if (selectedElement) selectedElement.style.fontSize = `${fontSizeInput.value}px`;
});

bgColorInput.addEventListener('input', () => {
  if (selectedElement) selectedElement.style.backgroundColor = bgColorInput.value;
});

function rgbToHex(rgb) {
  const result = rgb.match(/\d+/g).map(x => (+x).toString(16).padStart(2, '0'));
  return `#${result.join('')}`;
}
