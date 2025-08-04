

let response;
let response_language = "English"; 

const languages = [
  "English", "Hindi", "Spanish", "French", "German", "Italian", "Russian", "Arabic", "Bengali",
  "Chinese", "Japanese", "Korean", "Tamil", "Telugu", "Gujarati", "Urdu", "Portuguese", "Greek",
  "Thai", "Polish", "Turkish", "Swedish", "Dutch", "Romanian", "Hebrew", "Persian", "Indonesian",
  "Punjabi", "Malayalam", "Kannada", "Marathi", "Ukrainian", "Vietnamese", "Czech", "Slovak"
  // Add more languages here
];

function renderLanguageList() {
  const listContainer = document.getElementById('language-list');
  listContainer.innerHTML = '';
  languages.forEach(lang => {
    const li = document.createElement('li');
    li.className = 'listitem';
    li.textContent = lang;
    li.onclick = () => selectItem(li);
    listContainer.appendChild(li);
  });
}

function filterList(input) {
  const filter = input.value.toLowerCase();
  const listItems = document.querySelectorAll('.listitem');
  listItems.forEach(item => {
    item.style.display = item.textContent.toLowerCase().includes(filter) ? 'block' : 'none';
  });
}

function selectItem(item) {
  document.getElementById('selected-value').textContent = item.textContent.trim();
  document.getElementById('state-dropdown').checked = false;
}

// Render the language list on page load
document.addEventListener('DOMContentLoaded', renderLanguageList);


// for dropdown
function filterList(input) {
  const filter = input.value.toLowerCase();
  const listItems = input.parentElement.querySelectorAll('.listitem');
  listItems.forEach(item => {
    item.style.display = item.textContent.toLowerCase().includes(filter) ? 'block' : 'none';
  });
}

function selectItem(item) {
  document.getElementById('selected-value').textContent = item.textContent.trim();
  response_language = item.textContent.trim(); // Update the response language
  document.getElementById('state-dropdown').checked = false; // close dropdown
} 


async function checkGrammar() {
  if (!validateText()) {
    return;
  }
  resetUI();

  const A9f2XkL7qPz3RmW6 = 'AIzaSyAWGetkcibgz2jwIcCvf_ft5x8Zvwi7UAI';
  const text = document.getElementById("inputText").value;
  document.getElementById("grammar-container").classList.add('loader2');
  const body = {
    contents: [
      { role: "user", parts: [{ text }] }
    ],
    generationConfig: {
      temperature: 1,
      topP: 0.95,
      responseMimeType: "application/json"
    },
    systemInstruction: {
      role: "user",
      parts: [{
        text: `Act as a multilingual language tutor. You will be given:

        - 'inputSentence': the sentence to check (it may be in any language)
        - 'response_language': the language in which the user wants the explanation
        
        Your task is to:
        1. Identify the language of the input sentence.
        2. Evaluate whether the sentence is grammatically correct **based on its own language rules**.
        3. Respond using the following JSON format:
        
        If the sentence has grammar mistakes:
        {
          "isCorrect": false,
          "response": "Your input sentence",
          "mistake": "Brief explanation of the mistake in ${response_language}",
          "correction": "Corrected version of the sentence (in the original language)",
          "grammarRule": {
            "ruleName": "Name of the grammar rule (in ${response_language})",
            "formula": "Grammar formula or pattern (in ${response_language})",
            "description": "Short explanation of the rule (in ${response_language})",
            "examples": [
              "Correct: [correct example in original sentence language]",
              "Incorrect: [incorrect example in original sentence language]"
            ],
            "mcq": {
              "question": "MCQ testing this rule (in ${response_language})",
              "options": [
                "Option A (in original sentence language)",
                "Option B (in original sentence language)",
                "Option C (in original sentence language)",
                "Option D (in original sentence language)"
              ],
              "correctAnswer": "Correct option (in original sentence language)"
            }
          }
        }
        
        If the sentence is already correct:
        {
          "isCorrect": true,
          "response": "The sentence is correct.",
          "formula": "Mention the grammar rule applied, in ${response_language}"
        }
        
        Make sure:
        - You do not translate the sentence itself or its correction.
        - All explanations and descriptions must be written in the ${response_language}.
        - Grammar should always be judged based on the original input language."
        `
      }]
    }
  };

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${A9f2XkL7qPz3RmW6}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const json = await res.json();
    const part = json.candidates?.[0]?.content?.parts?.[0]?.text || '❌ No valid response';
    try {
      response = JSON.parse(part);
      renderGrammarUI(response);
    } catch (e) {
      document.getElementById("response").textContent = "❌ Invalid JSON returned.";
      console.error("Parsing error:", e, part);
    }

    document.getElementById("grammar-container").classList.remove('loader2');
  } catch (error) {
    document.getElementById("response").textContent = "❌ Error: " + error.message;
  }
}


function renderGrammarUI(data) {
  console.log("Rendering Grammar UI with data:", data);
  const container = document.getElementById("grammar-container");
  if (!data.isCorrect) {
    const mcqOptionsHTML = data.grammarRule.mcq.options.map((opt, index) => `
      <div class="option" data-index="${index}" data-answer="${opt}">
        ${opt}
      </div>
    `).join("");

    container.innerHTML = `
      <div class="section">
        <h2>Grammar Feedback</h2>
        <p><span class="label">Your Sentence:</span> ${document.getElementById("inputText").value}</p>
        <p><span class="label">Response:</span> ${data.response}</p>
        <p><span class="label">Error Description:</span> ${data.mistake}</p>
        <p><span class="label">Correction:</span> ${data.correction}</p>
      </div>

      <div class="section">
        <h2>Grammar Rule</h2>
        <p><span class="label">Rule Name:</span> ${data.grammarRule.ruleName}</p>
        <p><span class="label">Formula:</span> ${data.grammarRule.formula}</p>
        <p><span class="label">Description:</span> ${data.grammarRule.description}</p>
      </div>

      <div class="section">
        <h2>Examples</h2>
        <ul>
          ${data.grammarRule.examples.map(ex => `<li>${ex}</li>`).join("")}
        </ul>
      </div>

      <div class="section">
        <h2>Quiz (MCQ)</h2>
        <p><span class="label">Question:</span> ${data?.grammarRule.mcq.question}</p>
        <div class="mcq" id="mcq-options">
          ${mcqOptionsHTML}
        </div>
      </div>
    `;

    const optionElements = document.querySelectorAll('.option');
    const correctAnswer = data.grammarRule.mcq.correctAnswer;
    
    optionElements.forEach(option => {
      option.addEventListener('click', () => {
        const selectedAnswer = option.getAttribute('data-answer');
    
        // Prevent clicking again
        if (document.querySelector('.disabled')) return;
    
        optionElements.forEach(opt => {
          const answer = opt.getAttribute('data-answer');
    
          opt.classList.add('disabled'); // Disable all options
    
          if (selectedAnswer === correctAnswer) {
            if (answer === correctAnswer) {
              opt.classList.add('correct');
            }
          } else {
            if (answer === selectedAnswer) {
              opt.classList.add('wrong');
            }
            if (answer === correctAnswer) {
              opt.classList.add('correct');
            }
          }
        });
      });
    });

    
  } else {
    container.innerHTML = ` <div class="section">
    <h2>Grammar Feedback</h2>
    <p><span class="label">Your Sentence:</span> ${document.getElementById("inputText").value}</p>
    <p><span class="label">Response:</span> ${data.response}</p> 
    <p><span class="label">Grammar Rule:</span> ${data.formula}</p>
  </div>`
  }

  resetInput();
}

function expandInput() {
  let inputContainer = document.getElementById("input-container");
  inputContainer.style.height = '200px';
}

function validateText() {
  const text = document.getElementById("inputText").value.trim();
  const button = document.getElementById("submitButton");

  if (text === "") {
    button.disabled = true;
    return false;
  } else {
    button.disabled = false;
    return true;
  }
}

validateText();

function resetInput() {
  document.getElementById("inputText").value = "";
}

function resetUI() {
  document.getElementById("grammar-container").innerHTML = "";
}


// Load the header dynamically
function getNavbar(location) {
  fetch(location)
    .then(response => response.text())
    .then(data => {
      document.getElementById('navbar').innerHTML = data;
      document.getElementById('dynamic-name').textContent = "Grammar Correction System";
    });
}


document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("submitButton").click();
  }
});

// Load the footer dynamically
function getFooter(location) {
  fetch(location)
    .then(response => response.text())
    .then(data => {
      document.getElementById('footer').innerHTML = data;
    });
}


getNavbar('../../components/common/navbar.html');
getFooter('../../components/common/footer.html');