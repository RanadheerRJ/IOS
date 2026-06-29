/* ===================================================== */
/* Rare OS v1 - app.js */
/* ===================================================== */

const DB_KEY = "rareOS";
const CACHE_VERSION = "v1";

/**
 * Load database from localStorage
 * @returns {Object} Database object
 */
function loadDB() {
  try {
    const data = localStorage.getItem(DB_KEY);
    return (
      JSON.parse(data) || {
        profile: null,
        projects: [],
        tasks: [],
        devices: [],
        timeline: [],
      }
    );
  } catch (error) {
    console.error("Error loading database:", error);
    return {
      profile: null,
      projects: [],
      tasks: [],
      devices: [],
      timeline: [],
    };
  }
}

/**
 * Save database to localStorage
 * @param {Object} db - Database object to save
 */
function saveDB(db) {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch (error) {
    console.error("Error saving database:", error);
    alert("Unable to save data. Storage might be full.");
  }
}

// Initialize database
let db = loadDB();

/**
 * Shorthand for document.getElementById
 * @param {string} id - Element ID
 * @returns {Element} DOM element
 */
const $ = (id) => document.getElementById(id);

/**
 * Update UI based on current database state
 */
function updateUI() {
  if (db.profile) {
    $("profileName").textContent = `Hi ${db.profile.name} 👋`;
    $("profileBio").textContent = db.profile.bio || "";
    $("dbName").textContent = db.profile.name;
  }

  $("dbProjects").textContent = db.projects.length;
  $("dbTasks").textContent = db.tasks.length;
  $("dbDevices").textContent = db.devices.length;
  $("deviceCount").textContent = `${db.devices.length} Connected`;

  // Update today's tasks
  const todayText = db.tasks.length > 0 ? `${db.tasks.length} Tasks` : "No Tasks";
  $("todayText").textContent = todayText;

  // Update timeline
  const timeline = $("timeline");
  timeline.innerHTML = "";

  if (db.timeline.length === 0) {
    timeline.innerHTML = '<div class="timeline-item">👋 Welcome to Rare OS</div>';
  } else {
    db.timeline
      .slice()
      .reverse()
      .forEach((item) => {
        const div = document.createElement("div");
        div.className = "timeline-item";
        div.textContent = item;
        timeline.appendChild(div);
      });
  }
}

/**
 * Open profile modal
 */
function openProfile() {
  const modal = $("profileModal");
  modal.classList.remove("hidden");
  setTimeout(() => $("inputName").focus(), 100);
}

/**
 * Close profile modal
 */
function closeProfile() {
  $("profileModal").classList.add("hidden");
}

/**
 * Close modal when clicking outside of content
 */
$("profileModal").addEventListener("click", (e) => {
  if (e.target.id === "profileModal") {
    closeProfile();
  }
});

/**
 * Edit Profile Button
 */
$("editProfile").addEventListener("click", openProfile);

/**
 * Save Profile Button
 */
$("saveProfile").addEventListener("click", () => {
  const name = $("inputName").value.trim();
  const occupation = $("inputOccupation").value.trim();
  const bio = $("inputBio").value.trim();

  if (!name) {
    alert("Please enter your name.");
    $("inputName").focus();
    return;
  }

  const profile = { name, occupation, bio };

  db.profile = profile;
  db.timeline.push(`👤 Saved profile for ${name}`);

  saveDB(db);
  updateUI();
  closeProfile();

  alert(`Hi ${name} 👋 Profile saved successfully!`);
});

/**
 * Handle Enter key in modal inputs
 */
$("inputBio").addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.ctrlKey) {
    $("saveProfile").click();
  }
});

$("inputName").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    $("inputOccupation").focus();
  }
});

$("inputOccupation").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    $("inputBio").focus();
  }
});

/**
 * New Project Button
 */
$("newProject").addEventListener("click", () => {
  const name = prompt("Project name?");
  if (!name || !name.trim()) return;

  const projectName = name.trim();
  db.projects.push(projectName);
  db.timeline.push(`📁 Added project: ${projectName}`);
  saveDB(db);
  updateUI();
});

/**
 * New Task Button
 */
$("newTask").addEventListener("click", () => {
  const name = prompt("Task?");
  if (!name || !name.trim()) return;

  const taskName = name.trim();
  db.tasks.push(taskName);
  db.timeline.push(`✅ Added task: ${taskName}`);
  saveDB(db);
  updateUI();
});

/**
 * New Device Button
 */
$("newDevice").addEventListener("click", () => {
  const name = prompt("Device?");
  if (!name || !name.trim()) return;

  const deviceName = name.trim();
  db.devices.push(deviceName);
  db.timeline.push(`📱 Added device: ${deviceName}`);
  saveDB(db);
  updateUI();
});

/**
 * New Note Button
 */
$("newNote").addEventListener("click", () => {
  const note = prompt("Quick note?");
  if (!note || !note.trim()) return;

  const noteText = note.trim();
  db.timeline.push(`📝 ${noteText}`);
  saveDB(db);
  updateUI();
});

/**
 * Notification Button
 */
$("notificationBtn").addEventListener("click", async () => {
  if (!("Notification" in window)) {
    alert("Notifications are not supported in your browser.");
    return;
  }

  if (Notification.permission === "granted") {
    new Notification("Rare OS", {
      body: "Notifications are already enabled! 🎉",
      icon: "https://i.pravatar.cc/200",
    });
    return;
  }

  if (Notification.permission !== "denied") {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        new Notification("Rare OS", {
          body: "Notifications are now enabled! 🎉",
          icon: "https://i.pravatar.cc/200",
        });
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    }
  }
});

/**
 * AI Button (Coming Soon)
 */
$("aiButton").addEventListener("click", () => {
  alert("🤖 AI Assistant coming soon! Stay tuned.");
});

/**
 * Settings Button
 */
$("settingsBtn").addEventListener("click", () => {
  alert(
    "⚙️ Settings coming soon!\n\nYou can currently edit your profile by clicking the Edit Profile button."
  );
});

/**
 * Service Worker Registration
 */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("sw.js")
      .then((registration) => {
        console.log("Service Worker registered successfully", registration);
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
}

/**
 * Online/Offline Status
 */
window.addEventListener("online", () => {
  db.timeline.push("🌐 Back online");
  saveDB(db);
  console.log("Application is now online");
});

window.addEventListener("offline", () => {
  db.timeline.push("🌐 You are offline");
  saveDB(db);
  console.log("Application is now offline");
});

/**
 * Initialize app
 */
function initializeApp() {
  if (!db.profile) {
    setTimeout(openProfile, 500);
  }
  updateUI();
  console.log("Rare OS initialized successfully");
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp);
} else {
  initializeApp();
}