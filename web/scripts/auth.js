const API_URL = 'http://localhost:5000/api/auth';

// ✅ Check if the user is logged in
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
    }
}

// 🚪 Logout function
function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}

// 🔑 Login function
async function login() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
        localStorage.setItem('token', data.token);
        window.location.href = 'index.html';
    } else {
        alert(`❌ Login failed: ${data.message}`);
    }
}

// 📝 Register function
async function register() {
    const username = document.getElementById("register-username").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
    });

    const data = await response.json();

    if (response.ok) {
        alert("✅ Registration successful! Please log in.");
        window.location.href = 'index.html';
    } else {
        alert(`❌ Registration failed: ${data.message}`);
    }
}