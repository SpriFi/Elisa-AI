import { GoogleGenerativeAI } from "@google/generative-ai";
import md from "markdown-it";

// Initialize the model
const genAI = new GoogleGenerativeAI(`${import.meta.env.VITE_API_KEY}`);

const model = genAI.getGenerativeModel({ model: "gemini-pro" });

let history = [];

async function getResponse(prompt) {
  const chat = await model.startChat({ history: history });
  const result = await chat.sendMessage(prompt);
  const response = await result.response;
  const text = response.text();
  
console.log(text);
  return text;

}

// user chat div
export const userDiv = (data) => {
  return `
  <!-- User Chat -->
          <div class="flex items-center gap-2 justify-end">
            <p class="bg-gemDeep text-white p-1 rounded-md-user shadow-md  ">
              ${data}
            </p>
            <img
              src="user.jpg"
              alt="user icon"
              class="w-10 h-10 rounded-full"
            />
          </div>
  `;
};

// AI Chat div
export const aiDiv = (data) => {
  return `
  <!-- AI Chat -->
          <div class="flex gap-2 justify-start">
          <img
              src="https://cdn.hashnode.com/res/hashnode/image/upload/v1679548216146/UVfbFzJqZ.png?auto=compress"
              alt="user icon"
              class="w-10 h-10"
            />
            <pre class="bg-gemRegular/40 text-gemDeep p-1 rounded-md-ai shadow-md whitespace-pre-wrap">
              ${data}
            </pre>
          </div>
  `;
};

async function handleSubmit(event) {
  event.preventDefault();

  let userMessage = document.getElementById("prompt");
  const chatArea = document.getElementById("chat-container");

  var prompt = userMessage.value.trim();
  if (prompt === "") {
    return;
  }

  console.log("user message", prompt);

  chatArea.innerHTML += userDiv(prompt);
  userMessage.value = "";
  const aiResponse = await getResponse(prompt);
  let md_text = md().render(aiResponse);
  chatArea.innerHTML += aiDiv(md_text);

  let newUserRole = {
    role: "user",
    parts: prompt,
  };
  let newAIRole = {
    role: "model",
    parts: aiResponse,
  };

  history.push(newUserRole);
  history.push(newAIRole);

  console.log(history);
}

const chatForm = document.getElementById("chat-form");
chatForm.addEventListener("submit", handleSubmit);

chatForm.addEventListener("keyup", (event) => {
  if (event.keyCode === 13) handleSubmit(event);
});

//typing
function simulateTyping(callback) {
  // Simulate typing logic here
  setTimeout(callback, 2000); // Adjust the timeout based on your typing simulation speed
}

// Function to show the typing indicator
function showTypingIndicator() {
  document.getElementById('typing-indicator').style.display = 'block';
}

// Function to hide the typing indicator
function hideTypingIndicator() {
  document.getElementById('typing-indicator').style.display = 'none';
}

// Function to display user message
function displayUserMessage(message) {
  // Display user message logic here
}

// Function to display bot message
function displayBotMessage(message) {
  // Display bot message logic here
}

document.getElementById('chat-form').addEventListener('submit', function (event) {
  event.preventDefault();

  // Get the user input
  const userInput = document.getElementById('prompt').value;

  // Display user message
  displayUserMessage(userInput);

  // Show typing indicator
  showTypingIndicator();

  // Simulate AI typing and response
  simulateTyping(function () {
    // Hide typing indicator
    hideTypingIndicator();

    // Display AI response
    displayBotMessage("This is Elisa's response...");

    // Clear the input field
    document.getElementById('prompt').value = '';
  });
});
