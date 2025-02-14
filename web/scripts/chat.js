const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendSound = document.getElementById('send-sound');
const receiveSound = document.getElementById('receive-sound');

let currentRoom = "general";
const username = localStorage.getItem("username") || "User";
const token = localStorage.getItem('token');

const socket = io('http://localhost:3000');

// Function to add messages to the chat UI
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
    messageDiv.textContent = text;
    chatBox.appendChild(messageDiv);
    scrollToBottom();

    // Play sound effects
    if (sender === 'user') sendSound.play();
    else receiveSound.play();
}

// Listen for incoming messages in real time
socket.on("message", (message) => {
    addMessage(`${msg.sender === "user" ? "👤 You" : "🤖 ArborMind"}: ${msg.text}`, message.sender);
});

// Listen for typing events
socket.on("userTyping", (username) => {
    document.getElementById('typing-indicator').innerText = `✍️ ${username} is typing...`;
});

socket.on("userStoppedTyping", () => {
    document.getElementById('typing-indicator').innerText = "";
});

// Function to send messages to the server
async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    addMessage(`👤 You: ${message}`, 'user');
    userInput.value = "";

    socket.emit("stopTyping", currentRoom);

    // Typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.classList.add('typing');
    typingIndicator.textContent = '🤖 ArborMind is typing...';
    chatBox.appendChild(typingIndicator);
    scrollToBottom();

    try {
        const response = await fetch('http://localhost:5000/api/chat', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ message })
        });

        const data = await response.json();

        // Remove typing indicator
        typingIndicator.remove();

        // Display bot response
        addMessage(`🤖 ArborMind: ${data.response}`, 'bot');
    } catch (error) {
        addMessage('🚫 Error connecting to server!', 'bot');
    }
}

// Auto-scroll & keep chat at the bottom
function scrollToBottom() {
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Fetch and display chat history
async function loadChatHistory() {
    try {
        const response = await fetch('http://localhost:5000/api/chat/history', {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });

        const messages = await response.json();
        messages.forEach(msg => {
            addMessage(`${msg.sender === "user" ? "👤 You" : "🤖 ArborMind"}: ${msg.text}`, msg.sender);
        });
    } catch (error) {
        console.error('🚫 Error loading chat history', error);
    }
}

// Call loadChatHistory() when page loads
document.addEventListener('DOMContentLoaded', loadChatHistory);

// Join default room
socket.emit("joinRoom", currentRoom);

function changeRoom() {
    const newRoom = document.getElementById('room-select').value;
    socket.emit("joinRoom", newRoom);
    currentRoom = newRoom;
    document.getElementById('chat-box').innerHTML = ""; // Clear chat UI
}

// Typing indicator
let typingTimeout;
function sendTyping() {
    socket.emit("typing", { username, room: currentRoom });

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        socket.emit("stopTyping", currentRoom);
    }, 3000);
}

function stopTyping() {
    clearTimeout(typingTimeout);
    socket.emit("stopTyping", currentRoom);
}