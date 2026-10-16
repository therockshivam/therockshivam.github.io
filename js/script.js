// Main Application Logic & Dynamic Renderer
import { PortfolioService } from "./services/portfolio-service.js";
import { getAbsoluteUrl } from "./utils.js";

// Typewriter Controller
let typeText = ["Creative Coder", "Problem Solver", "YouTube Educator", "Tech Explorer"];
let index = 0, charIndex = 0;
let typingElement = document.getElementById("typewriter");

function typeWriter() {
  if (!typingElement) return;

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

// Load Header Partial
function getNavbar(location) {
  fetch(getAbsoluteUrl(location))
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.text();
    })
    .then(data => {
      const el = document.getElementById('navbar');
      if (el) {
        el.innerHTML = data;
        const dynName = document.getElementById('dynamic-name');
        if (dynName) dynName.textContent = "Portfolio";
      }
    })
    .catch(err => console.warn("Navbar partial fetch skipped/failed:", err));
}

// Load Footer Partial
function getFooter(location) {
  fetch(getAbsoluteUrl(location))
    .then(response => response.text())
    .then(data => {
      const el = document.getElementById('footer');
      if (el) el.innerHTML = data;
    })
    .catch(err => console.warn("Footer partial fetch skipped/failed:", err));
}

// Load Chatbot Partial
function getChatbot(location) {
  fetch(getAbsoluteUrl(location))
    .then(response => response.text())
    .then(data => {
      const el = document.getElementById('chatbot-container');
      if (el) el.innerHTML = data;
    })
    .catch(err => console.warn("Chatbot partial fetch skipped/failed:", err));
}

// Render Profile & Typewriter Roles
async function initProfile() {
  try {
    const profile = await PortfolioService.getProfile();
    if (profile) {
      if (profile.name) {
        const titleEl = document.getElementById("hero-title");
        if (titleEl) titleEl.textContent = `🚀 ${profile.name}'s Vault`;
      }
      if (profile.bio) {
        const bioEl = document.getElementById("about-bio");
        if (bioEl) bioEl.innerHTML = profile.bio;
      }
      if (profile.email) {
        const linkEl = document.getElementById("contact-email-link");
        if (linkEl) {
          linkEl.href = `mailto:${profile.email}`;
          linkEl.textContent = profile.email;
        }
      }
      if (profile.typewriterRoles && Array.isArray(profile.typewriterRoles) && profile.typewriterRoles.length > 0) {
        typeText = profile.typewriterRoles;
      }
    }
  } catch (err) {
    console.warn("Profile render fallback activated:", err);
  } finally {
    typeWriter();
  }
}

// Render Dynamic Projects
async function initProjects() {
  const container = document.getElementById("projects-container");
  if (!container) return;

  try {
    const projects = await PortfolioService.getProjects();
    container.innerHTML = "";

    projects.forEach((project, idx) => {
      const div = document.createElement("div");
      div.className = "project-card";
      div.setAttribute("data-aos", "zoom-in");
      if (idx > 0) div.setAttribute("data-aos-delay", (idx * 100).toString());

      const imgSrc = project.imageUrl || "#";

      div.innerHTML = `
        <img src="${imgSrc}" alt="${project.title}" />
        <h3>${project.title}</h3>
        <p>${project.description}</p>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.warn("Projects render error:", err);
  }
}

// Render Dynamic Tools
async function initTools() {
  const container = document.getElementById("tools-container");
  if (!container) return;

  try {
    const tools = await PortfolioService.getTools();
    container.innerHTML = "";

    tools.forEach((tool, index) => {
      const card = document.createElement("div");
      card.className = "tool-card";
      card.setAttribute("data-aos", "fade-up");
      card.setAttribute("data-aos-delay", (index * 100).toString());

      const toolLink = tool.link.startsWith('#') ? '#' : getAbsoluteUrl(tool.link);

      card.innerHTML = `
        <h3>${tool.title}</h3>
        <p>${tool.description}</p>
        <a href="${toolLink}">Try It →</a>
        <span class="status-badge ${tool.status}">
          <span class="blinking-dot"></span> ${tool.status === "live" ? "LIVE" : "Coming Soon"}
        </span>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.warn("Tools render error:", err);
  }
}

// Render Dynamic Vault Notes
async function initVaultNotes() {
  const container = document.getElementById("vault-notes-container");
  if (!container) return;

  try {
    const notes = await PortfolioService.getVaultNotes();
    container.innerHTML = "";

    notes.forEach(note => {
      const div = document.createElement("div");
      div.className = "note-snippet";
      div.setAttribute("data-aos", "fade-left");

      const noteLink = note.link.startsWith('#') ? '#' : getAbsoluteUrl(note.link);

      div.innerHTML = `
        <h3>${note.title}</h3>
        <p>${note.description}</p>
        <a href="${noteLink}">Read More →</a>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.warn("Vault notes render error:", err);
  }
}

// Bind Contact Form Submission
function initContactForm() {
  const form = document.getElementById("contact-form");
  const statusEl = document.getElementById("contact-form-status");
  const submitBtn = document.getElementById("contact-submit-btn");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("contact-name")?.value.trim();
      const email = document.getElementById("contact-email")?.value.trim();
      const message = document.getElementById("contact-message")?.value.trim();

      if (!name || !email || !message) return;

      const originalBtnText = submitBtn.textContent;

      try {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
        if (statusEl) statusEl.style.display = "none";

        await PortfolioService.sendContactMessage({ name, email, message });

        if (statusEl) {
          statusEl.textContent = "Thank you! Your message has been sent successfully.";
          statusEl.style.color = "#10b981";
          statusEl.style.display = "block";
        }
        form.reset();
      } catch (err) {
        console.error("Contact submit error:", err);
        if (statusEl) {
          statusEl.textContent = `Unable to send message: ${err.message || "Please try again later."}`;
          statusEl.style.color = "#ef4444";
          statusEl.style.display = "block";
        }
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    });
  }
}

// App Initialization
document.addEventListener("DOMContentLoaded", () => {
  getNavbar('components/common/navbar.html');
  getFooter('components/common/footer.html');

  initProfile();
  initProjects();
  initTools();
  initVaultNotes();
  initContactForm();

  // Chatbot Toggle Handler
  const chatToggle = document.getElementById("chatbot-toggle");
  if (chatToggle) {
    let chatbotLoaded = false;
    chatToggle.addEventListener("click", function () {
      const container = document.getElementById("chatbot-container");
      if (!chatbotLoaded && container) {
        getChatbot('tools/chatbot/index.html');
        chatbotLoaded = true;
      }
      if (container) {
        container.style.display = (container.style.display === "none" || container.style.display === "") ? "block" : "none";
      }
    });
  }
});

