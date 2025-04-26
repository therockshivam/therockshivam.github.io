


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


    // Load the header dynamically
    function getNavbar(location) {
      fetch(location)
        .then(response => response.text())
        .then(data => {
          console.log(data);
          document.getElementById('navbar').innerHTML = data;
        });
    }
  
    // Load the footer dynamically
    function getFooter(location) {
      fetch(location)
        .then(response => response.text())
        .then(data => {
          document.getElementById('footer').innerHTML = data;
        });
    }


    getNavbar('../components/common/navbar.html');
    getFooter('../components/common/footer.html');