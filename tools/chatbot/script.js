const API_URL = "https://api-inference.huggingface.co/models/facebook/blenderbot-3B";
const HUGGINGFACE_TOKEN = "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";

const chatbox = document.getElementById("chatbox");
 const form = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// form.addEventListener("submit", (e) => {
//   const message = userInput.value.trim();
//   if (message) {
//     getBotResponse(message);
//     userInput.value = "";
//   }
// });

// Utility: Generate safe unique IDs
function generateId() {
  return 'msg-' + Math.random().toString(36).substr(2, 9);
}

function appendMessage(sender, message, isLoader = false) {
  const chatBox = document.getElementById("chat-box");
  const messageDiv = document.createElement("div");
  const messageSpan = document.createElement("span");
  const id = generateId();

  messageDiv.className = `message ${sender}`;
  messageDiv.id = id;

  if (isLoader) {
    messageSpan.innerHTML = `<div class="loader"></div>`; // Loader inside span
  } else {
    messageSpan.textContent = message;
  }

  messageDiv.appendChild(messageSpan);
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;

  return id;
}

let notFirstTime=false;
async function getBotResponse(userMessage) {
 
  sendBtn.disabled = true;

  if(notFirstTime){
  // Append user message
  appendMessage("user", userMessage);

  }else{
    notFirstTime=true;
  }

  // Append loader and track span to replace later
  const loaderId = appendMessage("bot", "", true);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HUGGINGFACE_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: userMessage })
    });

    const data = await response.json();

    const botReply =
      (Array.isArray(data) && data[0]?.generated_text) ||
      data.generated_text ||
      "Sorry, I didn't understand that.";

    // Replace loader with actual message
    const loaderElem = document.getElementById(loaderId);
    if (loaderElem && loaderElem.firstChild) {
      loaderElem.firstChild.textContent = botReply;
    }
  } catch (error) {
    const loaderElem = document.getElementById(loaderId);
    if (loaderElem && loaderElem.firstChild) {
      loaderElem.firstChild.textContent = "⚠️ Error talking to AI. Try again.";
    }
  }

  sendBtn.disabled = false;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = userInput.value.trim();
  if (message) {
    getBotResponse(message);
    userInput.value = "";
  }
});


getBotResponse("Hi");
