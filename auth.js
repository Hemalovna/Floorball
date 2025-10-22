// Save user
function saveUser(username, password) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  // Only allow creating the very first account
  if (users.length > 0) return false;
  users.push({ username, password });
  localStorage.setItem("users", JSON.stringify(users));
  return true;
}

// SIGNUP
const signupForm = document.getElementById("signupForm");
// If an account already exists, prevent showing the signup form
if (signupForm) {
  const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
  if (existingUsers.length > 0) {
    // replace form with a helpful message
    signupForm.innerHTML =
      '<p>An account already exists. Please <a href="login.html">log in</a>.</p>';
  } else {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("signupUsername").value.trim();
      const password = document.getElementById("signupPassword").value;

      // since there are no users, create the account
      const created = saveUser(username, password);
      if (!created) {
        alert("An account already exists. Please log in.");
        window.location.href = "login.html";
        return;
      }

        localStorage.setItem("loggedInUser", username);
        // mark online
        try {
          const raw = JSON.parse(localStorage.getItem('onlineUsers') || '[]');
          const normalized = Array.isArray(raw) ? raw : [];
          const now = Date.now();
          const updated = normalized.map(i => (typeof i === 'string' ? { username: i, lastSeen: 0 } : i));
          updated.push({ username, lastSeen: now });
          localStorage.setItem('onlineUsers', JSON.stringify(updated));
        } catch (err) {}
        window.location.href = "home.html";
    });
  }
}

// LOGIN
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      localStorage.setItem("loggedInUser", username);
      // mark online with timestamp
      try {
        const raw = JSON.parse(localStorage.getItem('onlineUsers') || '[]');
        const normalized = Array.isArray(raw) ? raw : [];
        const now = Date.now();
        const updated = normalized.map(i => (typeof i === 'string' ? { username: i, lastSeen: 0 } : i));
        // remove existing entry for username
        const filtered = updated.filter(i => i.username !== username);
        filtered.push({ username, lastSeen: now });
        localStorage.setItem('onlineUsers', JSON.stringify(filtered));
      } catch (err) {}
      window.location.href = "home.html";
    } else {
      alert("Invalid username or password!");
    }
  });
}
