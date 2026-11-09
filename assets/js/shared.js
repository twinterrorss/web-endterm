"use strict";

// These keys are shared by all pages. Data formats are described in README.md.
const storageKeys = {
  profile: "cyberWinProfile",
  theme: "cyberWinTheme",
  notifications: "cyberWinNotifications",
  favorites: "cyberWinFavorites",
  schedule: "cyberWinSchedule"
};

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch (error) {
    return fallback;
  }
}

function saveStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    return false;
  }
}

function applyTheme(theme) {
  const selectedTheme = theme === "light" ? "light" : "dark";
  document.documentElement.setAttribute("data-bs-theme", selectedTheme);

  const button = document.getElementById("theme-toggle");
  if (button) {
    button.textContent = selectedTheme === "light" ? "Dark mode" : "Light mode";
    button.setAttribute("aria-label", "Switch to " + button.textContent.toLowerCase());
  }
}

// Run in the head so the saved theme is applied before the page is displayed.
applyTheme(readStorage(storageKeys.theme, "dark"));

document.addEventListener("DOMContentLoaded", function () {
  const button = document.createElement("button");
  button.id = "theme-toggle";
  button.type = "button";
  button.className = "btn theme-toggle";
  document.querySelector(".site-header").append(button);

  const message = document.createElement("p");
  message.className = "theme-message";
  message.setAttribute("role", "status");
  document.querySelector(".site-header").append(message);
  applyTheme(readStorage(storageKeys.theme, "dark"));

  button.addEventListener("click", function () {
    const theme = document.documentElement.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
    applyTheme(theme);
    const saved = saveStorage(storageKeys.theme, theme);
    message.textContent = saved ? "" : "Theme changed for this page. Browser storage is unavailable.";
  });
});

window.addEventListener("storage", function (event) {
  if (event.key === storageKeys.theme || event.key === null) {
    applyTheme(readStorage(storageKeys.theme, "dark"));
  }
});
