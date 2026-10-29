
const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const chatMessages = document.getElementById("chatMessages");
const suggestionButtons = document.querySelectorAll(".suggestions button");

// Display a message in the chat window
function addMessage(text, sender) {
  const message = document.createElement("div");

  message.classList.add("message");
  message.classList.add(
    sender === "user" ? "user-message" : "bot-message"
  );

  // textContent prevents user input from being treated as HTML
  message.textContent = text;

  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Temporary replies until we connect a real AI API
function getBotReply(message) {
  const text = message.toLowerCase();

  if (text.includes("lost") || text.includes("found")) {
    return "You can visit the Lost & Found section of Campus-Connect to report or browse items.";
  }

  if (text.includes("canteen") || text.includes("food") || text.includes("menu")) {
    return "You can open the Canteen section of Campus-Connect to explore its available features.";
  }

  if (text.includes("hello") || text.includes("hi") || text.includes("hey")) {
    return "Hey! 👋 I'm CampusConnect AI. How can I help you today?";
  }

  if (text.includes("help")) {
    return "I can help you navigate Campus-Connect, Lost & Found, and the Canteen section.";
  }

  return "I'm currently using basic demo replies. Soon, we'll connect a real AI model so I can answer more questions!";
}

// Handle message submission
chatForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const text = messageInput.value.trim();

  if (!text) return;

  addMessage(text, "user");
  messageInput.value = "";
  messageInput.focus();

  // Temporary demo response
  const reply = getBotReply(text);
  addMessage(reply, "bot");
});

// Handle suggested question buttons
suggestionButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    messageInput.value = button.dataset.message;
    chatForm.requestSubmit();
  });
});
