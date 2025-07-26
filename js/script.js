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
          document.getElementById('dynamic-name').textContent = "Portfolio"; 
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
          console.log('this is the chatbot data',data)
          document.getElementById('chatbot-container').innerHTML=data;
        });
    }


    getNavbar('../components/common/navbar.html');
    getFooter('../components/common/footer.html');

    document.getElementById("chatbot-toggle").addEventListener("click", function () {

      getChatbot('../tools/chatbot/index.html')

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


    const toolsData = [
      {
        title: "🧠 Grammar AI",
        description: "An AI-powered grammar correction system to make your writing shine.",
        link: "/tools/gammar-correction-system",
        status: "live"
      },
      {
        title: "🧾 Bill Slip Generator",
        description: "A tool that allows users to create and manage bill slips.",
        link: "/tools/bill-generator-tool/",
        status: "live"
      },
      {
        title: "🚗🔎 Plate Identifier",
        description: "Instantly fetch vehicle details by simply entering a number plate.",
        link: "/tools/plate-identifier",
        status: "live"
      },
      {
        title: "Chatbot",
        description: "Chat with our bot to find out more.",
        link: "/tools/chatbot/",
        status: "live"
      },
      {
        title: "🛠️ Web Dev Toolkit",
        description: "A simple drag-and-drop tool to create a proper structure and styling for websites using HTML, CSS, and JS.",
        link: "/tools/web-dev-toolkit",
        status: "live"
      },
           {
        title: "🐍 Snake Game",
        description: "A simple snake game built with HTML, CSS, and JS.",
        link: "tools/snake-game",
        status: "live"
      },  {
        title: "🗺️ Travel Management System",
        description: "A travel management system to manage your trips and expenses.",
        link: "/tools/travel-management-system",
        status: "live"
      },  {
        title: "🧾 Split Expense",
        description: "A simple tool to split expenses among friends and family.",
        link: "/tools/split-expense",
        status: "live"
      },
        {
        title: " Password Manager",
        description: " A simple password manager to store your passwords securely.",
        link: "/tools/password-manager",
        status: "live"
      },
      {
        title: "📋 Resume Generator",
        description: "Build modern resumes effortlessly with AI-guided content.",
        link: "#",
        status: "coming-soon"
      },
      {
        title: "🧠 MindFlow",
        description: "Organize your thoughts, goals, and ideas with a smart structure.",
        link: "#",
        status: "coming-soon"
      },
      {
        title: "📸 Face Attendance",
        description: "Face Recognition Attendance System built with real-time detection.",
        link: "#",
        status: "coming-soon"
      }
    ];

    function setToolsData(toolsData){

    const toolsContainer = document.getElementById("tools-container");

    toolsData.forEach((tool, index) => {
      const toolCard = document.createElement("div");
      toolCard.className = "tool-card";
      toolCard.setAttribute("data-aos", "fade-up");
      toolCard.setAttribute("data-aos-delay", index * 100);

      toolCard.innerHTML = `
        <h3>${tool.title}</h3>
        <p>${tool.description}</p>
        <a href="${tool.link}">Try It →</a>
        <span class="status-badge ${tool.status}" data-aos="fade-in">
          <span class="blinking-dot"></span> ${tool.status === "live" ? "LIVE" : "Coming Soon"}
        </span>
      `;

      toolsContainer.appendChild(toolCard);
    });
  }

  setToolsData(toolsData);
   


 
    