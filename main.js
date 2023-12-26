// Import statements

// Initialize the model
const genAI = new GoogleGenerativeAI(`${import.meta.env.VITE_API_KEY}`);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

let history = [];

// User chat div function
export const userDiv = (data) => {
  return `
    <!-- User Chat -->
    <div class="flex items-center gap-2 justify-end">
      <p class="bg-gemDeep text-white p-1 rounded-md-user shadow-md">
        ${data}
      </p>
      <img src="user.jpg" alt="user icon" class="w-10 h-10 rounded-full" />
    </div>
  `;
};

// AI chat div function
export const aiDiv = (data) => {
  return `
    <!-- AI Chat -->
    <div class="flex gap-2 justify-start">
      <img
        src="https://cdn.hashnode.com/res/hashnode/image/upload/v1679548216146/UVfbFzJqZ.png?auto=compress"
        alt="user icon"
        class="w-10 h-10"
      />
      <div class="bg-gemRegular/40 text-gemDeep p-1 rounded-md-ai shadow-md whitespace-pre-wrap">
        ${data}
      </div>
    </div>
  `;
};

// Typing indicator div function
export const aiTypingIndicator = () => {
  return `
    <!-- AI Typing Indicator -->
    <div class="flex gap-2 justify-start">
      <img
        src="https://cdn.hashnode.com/res/hashnode/image/upload/v1679548216146/UVfbFzJqZ.png?auto=compress"
        alt="user icon"
        class="w-10 h-10"
      />
      <div class="bg-gemRegular/40 text-gemDeep p-1 rounded-md-ai shadow-md whitespace-pre-wrap">
        Typing...
      </div>
    </div>
  `;
};

// Function to get AI response
async function getResponse(prompt) {
  const chat = await model.startChat({ history: history });
  const result = await chat.sendMessage(prompt);
  const response = await result.response;
  const text = response.text();

  console.log(text);
  return text;
}

// Function to handle form submission
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

  // Add AI typing indicator
  chatArea.innerHTML += aiTypingIndicator();

  const aiResponse = await getResponse(prompt);
  let md_text = md().render(aiResponse);

  // Remove typing indicator and add actual AI response
  chatArea.innerHTML = chatArea.innerHTML.replace(aiTypingIndicator(), aiDiv(md_text));

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

// Event listeners
const chatForm = document.getElementById("chat-form");
chatForm.addEventListener("submit", handleSubmit);

chatForm.addEventListener("keyup", (event) => {
  if (event.keyCode === 13) handleSubmit(event);
});
