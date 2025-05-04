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

     // Load the footer dynamically
     function getChatbot(location) {
      fetch(location)
        .then(response => response.text())
        .then(data => {
          document.getElementById('chatbot-container').innerHTML=data;
        });
    }


    getNavbar('../components/common/navbar.html');
    getFooter('../components/common/footer.html');

    document.getElementById("chatbot-toggle").addEventListener("click", function () {

      getChatbot('../tools/chatbot/script.js')

      // Load the chatbot iframe (if needed)
      const container = document.getElementById("chatbot-container");
      
      // Toggle visibility
      if (container.style.display === "none" || container.style.display === "") {
        container.style.display = "block";
    
        // // Optional: Load the chatbot iframe only once
        // if (!container.innerHTML.trim()) {
        //   container.innerHTML = `<iframe src="/tools/chatbot/index.html" width="400" height="500" style="border:none;"></iframe>`;
        // }
      } else {
        container.style.display = "none";
      }
    });
    

   


 
    