
// Typewriter Effect
const typeText = ["Creative Coder", "Problem Solver", "YouTube Educator", "Tech Explorer"];
let index = 0, charIndex = 0;
let typingElement = document.getElementById("typewriter");

function typeWriter() {
  if (charIndex < typeText[index].length) {
    typingElement.textContent += typeText[index].charAt(charIndex);
    charIndex++;
    setTimeout(typeWriter, 100);
  } else {
    setTimeout(() => {
      typingElement.textContent = "";
      charIndex = 0;
      index = (index + 1) % typeText.length;
      typeWriter();
    }, 1500);
  }
}
typeWriter();

// Theme Toggle
function toggleTheme() {
  document.body.classList.toggle("light");
  document.getElementById("theme-icon").textContent =
    document.body.classList.contains("light") ? "🌞" : "🌙";
}


// Hamburger Menu
function toggleMenu() {
    document.getElementById("navLinks").classList.toggle("active");
  }
  