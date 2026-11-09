"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("profile-form");
  const editButton = document.getElementById("edit-profile");
  const nameInput = document.getElementById("profile-name");
  const emailInput = document.getElementById("profile-email");
  const countryInput = document.getElementById("profile-country");
  const message = document.getElementById("profile-message");
  const notifications = document.getElementById("notifications");
  const defaultProfile = {
    name: "DEXTER MORGAN",
    email: "alex.morgan@email.com",
    country: "United States"
  };
  let profile = readStorage(storageKeys.profile, defaultProfile);

  function isValidProfile(data) {
    return data !== null && typeof data === "object" &&
      typeof data.name === "string" && data.name.trim().length >= 3 && data.name.length <= 60 &&
      typeof data.email === "string" && data.email.length <= 100 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) &&
      typeof data.country === "string" && data.country !== "" &&
      Array.from(countryInput.options).some(function (option) {
        return option.value === data.country;
      });
  }

  if (!isValidProfile(profile)) {
    profile = defaultProfile;
  }

  function showProfile() {
    document.getElementById("display-name").textContent = profile.name;
    document.getElementById("display-email").textContent = profile.email;
    document.getElementById("display-country").textContent = profile.country;
  }

  function setError(input, text) {
    document.getElementById(input.id + "-error").textContent = text;
    input.classList.toggle("is-invalid", text !== "");
    input.setAttribute("aria-invalid", String(text !== ""));
  }

  function validateField(input) {
    const value = input.value.trim();
    let error = "";
    if (input === nameInput && (value.length < 3 || value.length > 60)) {
      error = "Enter a name with 3 to 60 characters.";
    }
    if (input === emailInput && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || value.length > 100)) {
      error = "Enter a valid email, for example name@example.com (up to 100 characters).";
    }
    if (input === countryInput && value === "") {
      error = "Please choose your country.";
    }
    setError(input, error);
    return error === "";
  }

  function closeForm() {
    form.hidden = true;
    editButton.setAttribute("aria-expanded", "false");
    editButton.focus();
  }

  editButton.addEventListener("click", function () {
    nameInput.value = profile.name;
    emailInput.value = profile.email;
    countryInput.value = profile.country;
    for (const input of [nameInput, emailInput, countryInput]) {
      setError(input, "");
    }
    message.textContent = "";
    form.hidden = false;
    editButton.setAttribute("aria-expanded", "true");
    nameInput.focus();
  });

  document.getElementById("cancel-profile").addEventListener("click", closeForm);

  for (const input of [nameInput, emailInput, countryInput]) {
    input.addEventListener(input === countryInput ? "change" : "input", function () {
      if (input.getAttribute("aria-invalid") === "true") {
        validateField(input);
      }
    });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    let valid = true;
    for (const input of [nameInput, emailInput, countryInput]) {
      if (!validateField(input)) valid = false;
    }
    if (!valid) {
      form.querySelector('[aria-invalid="true"]').focus();
      return;
    }

    profile = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      country: countryInput.value
    };
    const saved = saveStorage(storageKeys.profile, profile);
    showProfile();
    closeForm();
    message.textContent = saved ? "Demo profile saved in this browser." :
      "Profile updated for this page. Browser storage is unavailable; changes will not survive a reload.";
  });

  function showNotifications(enabled) {
    notifications.checked = enabled;
    document.getElementById("notifications-state").textContent = enabled ? "Enabled" : "Disabled";
  }

  notifications.addEventListener("change", function () {
    showNotifications(notifications.checked);
    const saved = saveStorage(storageKeys.notifications, notifications.checked);
    document.getElementById("settings-message").textContent = saved ?
      "Demo notification preference saved." : "Preference changed for this page. Browser storage is unavailable.";
  });

  function addSavedItem(list, text) {
    const item = document.createElement("li");
    item.textContent = text;
    list.append(item);
  }

  function renderSavedItems() {
    const gamesList = document.getElementById("saved-games");
    const scheduleList = document.getElementById("saved-schedule");
    gamesList.replaceChildren();
    scheduleList.replaceChildren();

    const favorites = readStorage(storageKeys.favorites, []);
    const schedule = readStorage(storageKeys.schedule, []);
    if (Array.isArray(favorites)) {
      casinoGames.forEach(function (game) {
        if (favorites.includes(game.id)) addSavedItem(gamesList, game.name);
      });
    }
    if (Array.isArray(schedule)) {
      schedule.forEach(function (entry) {
        if (!entry || typeof entry.match !== "string" || typeof entry.sport !== "string" ||
            typeof entry.time !== "string") return;
        const date = new Date(entry.time);
        if (Number.isNaN(date.getTime())) return;
        addSavedItem(scheduleList, entry.match + " · " + entry.sport + " · " + date.toLocaleString());
      });
    }

    document.getElementById("saved-games-empty").hidden = gamesList.children.length > 0;
    document.getElementById("saved-schedule-empty").hidden = scheduleList.children.length > 0;
    document.getElementById("saved-count").textContent =
      gamesList.children.length + " games · " + scheduleList.children.length + " planned viewings";
  }

  document.getElementById("refresh-saved").addEventListener("click", function () {
    renderSavedItems();
    document.getElementById("saved-message").textContent = "Saved items refreshed from this browser.";
  });

  window.addEventListener("storage", function (event) {
    if (event.key === storageKeys.favorites || event.key === storageKeys.schedule || event.key === null) {
      renderSavedItems();
    }
    if (event.key === storageKeys.notifications || event.key === null) {
      showNotifications(readStorage(storageKeys.notifications, true) !== false);
    }
  });

  showProfile();
  showNotifications(readStorage(storageKeys.notifications, true) !== false);
  renderSavedItems();
});
