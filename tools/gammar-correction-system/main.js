

let response;


// document.getElementById('grammar-container').innerHTML=`  <div style="display: flex;
// justify-content: space-evenly; width: 100%; align-items:center;"><img src="../../images/no result.png" alt="No Result" > <h3>No result yet</h3></div>`;

async function checkGrammar() {

  // const geminiKey = process.env.GEMINI;
  // console.log("My Gemini Key:", geminiKey);

    const A9f2XkL7qPz3RmW6 = 'AIzaSyDbxx_D6EVmsb6X4q09UWw08DkFALS3W5I';
    const text = document.getElementById("inputText").value;
    // document.getElementById("response").textContent = "⏳ Checking...";
    document.getElementById("response").classList.add('loader2');
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
                text: `Act as an English teacher. When I make any grammar mistake, respond to the request, then give:
- A brief description of the mistake
- The corrected sentence
- Grammar rule details (rule name, formula, description, 2 examples, 1 MCQ with 4 options and correct answer)
--Format example:
e.g. 1 {
"isCorrect": false,
  "response": "what this is",
  "mistake": "Incorrect word order and missing verb",
  "correction": "What is this?",
  "grammarRule": {
    "ruleName": "Word Order in Questions",
    "formula": "Auxiliary Verb + Subject + Main Verb",
    "description": "In English, most questions require inverting the subject and the auxiliary verb (helping verb).  If there's no auxiliary verb, use 'do', 'does', or 'did'.",
    "examples": [
      "Correct: Where are you going? Incorrect: Where you are going?",
      "Correct: Does she sing well? Incorrect: She sings well?"
    ],
    "mcq": {
      "question": "Which of the following sentences is grammatically correct?",
      "options": [
        "What is this?",
        "What this is?",
        "This is what?",
        "Is this what?"
      ],
      "correctAnswer": "What is this?"
    }
  }

  e.g. 2 {
"isCorrect": true,
"response": "The sentence is correct.",
"formula": The rule of the given sentence.
            
  }
}`
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

        document.getElementById("response").classList.remove('loader2');
        document.getElementById("response").textContent = "✅ Response received.";
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
        optionElements.forEach(option => {
            option.addEventListener('click', () => {
                const selectedAnswer = option.getAttribute('data-answer');
                const correctAnswer = data.grammarRule.mcq.correctAnswer;

                optionElements.forEach(opt => {
                    const answer = opt.getAttribute('data-answer');
                    opt.classList.add('disabled');
                    if (answer === correctAnswer) {
                        opt.classList.add('correct');
                    } else if (answer === selectedAnswer) {
                        opt.classList.add('wrong');
                    }
                });
            });
        });
    } else {
        container.innerHTML = ` <div class="section">
    <h2>Grammar Feedback</h2>
    <p><span class="label">Response:</span> ${data.response}</p> 
    <p><span class="label">Grammar Rule:</span> ${data.formula}</p>
  </div>`
    }

}

function expandInput(){
  let inputContainer=document.getElementById("input-container");
  inputContainer.style.height='200px';
  // inputContainer
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

function resetUI() {
    document.getElementById("inputText").value = "";
    document.getElementById("response").textContent = "Response will be shown here.";
    document.getElementById("grammar-container").innerHTML = "";
    document.getElementById("input-container").style.height = '50px';
}




    // Load the header dynamically
    function getNavbar(location) {
      fetch(location)
        .then(response => response.text())
        .then(data => {
          document.getElementById('navbar').innerHTML = data;
        });
    }


    document.addEventListener("keydown", function(event) {
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