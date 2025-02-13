const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendSound = document.getElementById('send-sound');
const receiveSound = document.getElementById('receive-sound');

const token = localStorage.getItem('token');

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

// Function to send messages to the server
async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    addMessage(`👤 You: ${message}`, 'user');
    userInput.value = "";

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