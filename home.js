document.addEventListener("DOMContentLoaded", () => {
  const loggedInUser = localStorage.getItem("loggedInUser");
  if (!loggedInUser) return window.location.href = "index.html";

  const topbarName = document.getElementById("topbarName");
  const userDisplay = document.getElementById("userDisplay");
  topbarName.textContent = loggedInUser;
  userDisplay.textContent = loggedInUser;

  const logoutBtn = document.getElementById("logoutBtn");
  logoutBtn.addEventListener("click", () => {
    try {
      const raw = JSON.parse(localStorage.getItem('onlineUsers') || '[]');
      const updated = (raw || []).filter(item => (typeof item === 'string' ? item !== loggedInUser : item.username !== loggedInUser));
      localStorage.setItem('onlineUsers', JSON.stringify(updated));
    } catch (err) {}
    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
  });

  const liveItemsDiv = document.getElementById("liveItems");

  function loadLiveMatches() {
    const liveMatches = JSON.parse(localStorage.getItem("liveMatches")) || [];
    liveItemsDiv.innerHTML = "";

    if (liveMatches.length === 0) {
      liveItemsDiv.innerHTML = '<p class="muted">No live items currently</p>';
      return;
    }

    liveMatches.forEach((match, idx) => {
      const div = document.createElement("div");
      div.className = "liveMatchCard";
      div.innerHTML = `
        <div class="teams">
          <div class="team">
            ${match.logoA ? `<img src="${match.logoA}" />` : `<div class="placeholderLogo"></div>`}
            <span>${match.teamA}</span>
          </div>
          <span class="vsText">VS</span>
          <div class="team">
            ${match.logoB ? `<img src="${match.logoB}" />` : `<div class="placeholderLogo"></div>`}
            <span>${match.teamB}</span>
          </div>
        </div>
        <div class="matchTime">Start: ${new Date(match.datetime).toLocaleString()}</div>
        <div class="liveBadge">LIVE</div>
      `;

      // Only Hemal sees the delete button
      if (loggedInUser === "Hemal") {
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "deleteLiveBtn";
        deleteBtn.style.marginTop = "6px";
        deleteBtn.addEventListener("click", () => {
          if (!confirm("Delete this live match from storage?")) return;
          liveMatches.splice(idx, 1);
          localStorage.setItem("liveMatches", JSON.stringify(liveMatches));
          loadLiveMatches();
        });
        div.appendChild(deleteBtn);
      }

      liveItemsDiv.appendChild(div);
    });
  }

  loadLiveMatches();

  // Optional: refresh every 10s to update live matches dynamically
  setInterval(loadLiveMatches, 10000);
  // Update when liveMatches change in other tabs
  window.addEventListener('storage', (e) => {
    if (e.key === 'liveMatches') loadLiveMatches();
  });
});

// Show Admin button only for Hemal
const adminBtn = document.getElementById("adminBtn");
if (loggedInUser === "Hemal") {
  adminBtn.style.display = "inline-block"; // Make it visible
  adminBtn.addEventListener("click", () => {
    window.location.href = "admin.html"; // Redirect to admin page
  });
}
