const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');

// Function to add messages to the chat UI
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
    messageDiv.textContent = text;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to send messages to the server
async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    addMessage(`👤 You: ${message}`, 'user');
    userInput.value = "";

    try {
        const response = await fetch('http://localhost:5000/api/chat', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer YOUR_JWT_TOKEN_HERE"
            },
            body: JSON.stringify({ message })
        });

        const data = await response.json();
        addMessage(`🤖 ArborMind: ${data.response}`, 'bot');
    } catch (error) {
        addMessage('🚫 Error connecting to server!', 'bot');
    }
}