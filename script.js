/* =========================================================
   Salesforce Developer Projects - script.js
   Sections:
   1. Project data (from the PDF)
   2. Element references
   3. Render project cards
   4. Search and track filter
   5. Project details modal
   6. Mobile navigation + active link highlight
   7. Fade-in on scroll
   8. Contact form validation
   9. Start the app
   ========================================================= */

"use strict";

/* ---------- 1. Project data ----------
   Only information from the PDF is used here: the project title, the track,
   and the fact that documentation is available.

   TO CONNECT DOCUMENTATION LATER:
   Put the real link in the docUrl field of the project, e.g.
   docUrl: "https://example.com/my-docs"
   An empty string ("") means "no link connected yet".
*/
const DEFAULT_DESCRIPTION = "Salesforce Developer project. Documentation is available for this project.";

const projects = [
  {
    id: 1,
    title: "Customer Support Ticket Priority Prediction and Automated Assignment System Using Agentforce",
    track: "Salesforce Developer",
    description: DEFAULT_DESCRIPTION,
    docUrl: "https://docs.google.com/document/d/1XVcx16Y1dNuVIlCh2M3deZw9v15TmHlvCAT036vubbc/edit?tab=t.0#heading=h.fm8v53ysunwo"
  },
  {
    id: 2,
    title: "Swift Ship Tracker",
    track: "Salesforce Developer",
    description: DEFAULT_DESCRIPTION,
    docUrl: "https://docs.google.com/document/d/13Bl2XqBUaV7ZTyo-Erv1yez9EHMvndlV1Db2eeQvIL8/edit?tab=t.0"
  },
  {
    id: 3,
    title: "WhatNext Vision Motors",
    track: "Salesforce Developer",
    description: DEFAULT_DESCRIPTION,
    docUrl: "https://docs.google.com/document/d/1mGDkv7UBXCAsxvbQbdrWtnLZubPShTbv8yxK7ztFSWg/edit?tab=t.0"
  },
  {
    id: 4,
    title: "Multi-Line Insurance Policy and Claims Management System",
    track: "Salesforce Developer",
    description: DEFAULT_DESCRIPTION,
    docUrl: "https://docs.google.com/document/d/1MyilkdZ2GEsik7SuAR42FnGjjkZMH3bk5gIclH-u2G0/edit?tab=t.0#heading=h.nrwu11c7dr7o"
  },
  {
    id: 5,
    title: "EventForce Management System",
    track: "Salesforce Developer",
    description: DEFAULT_DESCRIPTION,
    docUrl: "https://docs.google.com/document/d/19-jTsBZYbsJ-Hg147JZCE9IHUYlOH16JAVF6FCS_7Ss/edit?tab=t.0#heading=h.pt3x3xvqwh97"
  }
];

/* ---------- 2. Element references ---------- */
const projectGrid   = document.getElementById("projectGrid");
const searchInput   = document.getElementById("searchInput");
const trackFilter   = document.getElementById("trackFilter");
const resultCount   = document.getElementById("resultCount");
const emptyState    = document.getElementById("emptyState");
const resetBtn      = document.getElementById("resetFilters");

const modal         = document.getElementById("projectModal");
const modalNumber   = document.getElementById("modalNumber");
const modalTitle    = document.getElementById("modalTitle");
const modalTrack    = document.getElementById("modalTrack");
const modalDocLink  = document.getElementById("modalDocLink");
const modalNote     = document.getElementById("modalNote");
const modalCloseBtn = document.getElementById("modalClose");

let lastFocusedElement = null; // remembers which button opened the modal

/* ---------- 3. Render project cards ---------- */

// Builds the HTML for a single project card
function createCardHTML(project) {
  return `
    <article class="project-card">
      <p class="project-number">Project ${project.id}</p>
      <h3>${project.title}</h3>
      <span class="badge">${project.track}</span>
      <p class="desc">${project.description}</p>
      <button type="button" class="btn btn-primary" data-project-id="${project.id}">View Project</button>
    </article>
  `;
}

// Draws a list of projects into the grid
function renderProjects(list) {
  projectGrid.innerHTML = list.map(createCardHTML).join("");

  resultCount.textContent = `Showing ${list.length} of ${projects.length} projects`;
  emptyState.hidden = list.length !== 0;
}

// Fills the track dropdown with each unique track found in the data
function populateTrackFilter() {
  const tracks = [...new Set(projects.map(p => p.track))];
  tracks.forEach(track => {
    const option = document.createElement("option");
    option.value = track;
    option.textContent = track;
    trackFilter.appendChild(option);
  });

  // Update the numbers in the hero section
  document.getElementById("statProjects").textContent = projects.length;
  document.getElementById("statTracks").textContent = tracks.length;
}

/* ---------- 4. Search and track filter ---------- */

// Reads the search box and the dropdown, then shows matching projects
function applyFilters() {
  const searchText = searchInput.value.trim().toLowerCase();
  const selectedTrack = trackFilter.value;

  const filtered = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchText);
    const matchesTrack = selectedTrack === "all" || project.track === selectedTrack;
    return matchesSearch && matchesTrack;
  });

  renderProjects(filtered);
}

function resetFilters() {
  searchInput.value = "";
  trackFilter.value = "all";
  applyFilters();
  searchInput.focus();
}

/* ---------- 5. Project details modal ---------- */

function openModal(projectId) {
  const project = projects.find(p => p.id === projectId);
  if (!project) return;

  lastFocusedElement = document.activeElement;

  // Fill the modal with this project's information
  modalNumber.textContent = `Project ${project.id}`;
  modalTitle.textContent = project.title;
  modalTrack.textContent = project.track;

  // Decide what the "Open Documentation" button does
  if (project.docUrl) {
    modalDocLink.href = project.docUrl;
    modalDocLink.target = "_blank";
    modalDocLink.rel = "noopener noreferrer";
    modalNote.hidden = true;
  } else {
    modalDocLink.href = "#";
    modalDocLink.removeAttribute("target");
    modalNote.hidden = false;
  }

  modal.classList.add("is-open");           // CSS handles the fade/scale animation
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";  // stop page scrolling behind the modal
  modalCloseBtn.focus();
}

function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (lastFocusedElement) lastFocusedElement.focus(); // return focus to the button
}

// Keeps Tab key focus inside the modal while it is open
function trapFocus(event) {
  const focusable = modal.querySelectorAll("a[href], button");
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function setupModal() {
  // One click listener on the grid handles every "View Project" button
  projectGrid.addEventListener("click", event => {
    const button = event.target.closest("[data-project-id]");
    if (button) openModal(Number(button.dataset.projectId));
  });

  modalCloseBtn.addEventListener("click", closeModal);

  // Clicking the dark backdrop closes the modal
  modal.querySelector("[data-close-modal]").addEventListener("click", closeModal);

  // Keyboard: Escape closes, Tab stays inside
  document.addEventListener("keydown", event => {
    if (!modal.classList.contains("is-open")) return;
    if (event.key === "Escape") closeModal();
    if (event.key === "Tab") trapFocus(event);
  });

  // If no URL is connected, don't let the "#" link jump the page
  modalDocLink.addEventListener("click", event => {
    if (modalDocLink.getAttribute("href") === "#") event.preventDefault();
  });
}

/* ---------- 6. Mobile navigation + active link highlight ---------- */

function setupNavigation() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  const links = document.querySelectorAll(".nav-link");

  // Open / close the mobile menu
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close the mobile menu after choosing a link
  links.forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  // Highlight the nav link of the section currently on screen
  const sections = ["home", "projects", "about", "contact"]
    .map(id => document.getElementById(id));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(link => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px" });

  sections.forEach(section => observer.observe(section));
}

/* ---------- 7. Fade-in on scroll ---------- */

function setupFadeIn() {
  const items = document.querySelectorAll(".fade-in");

  // If the browser doesn't support IntersectionObserver, just show everything
  if (!("IntersectionObserver" in window)) {
    items.forEach(item => item.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target); // animate only once
      }
    });
  }, { threshold: 0.12 });

  items.forEach(item => observer.observe(item));
}

/* ---------- 8. Contact form validation ---------- */

// Shows or clears an error message under one field
function setFieldError(input, message) {
  const row = input.closest(".form-row");
  const errorEl = document.getElementById(`${input.id}Error`);
  errorEl.textContent = message;
  row.classList.toggle("has-error", message !== "");
  input.setAttribute("aria-invalid", message !== "" ? "true" : "false");
}

// Each validator returns an error message, or "" if the value is fine
function validateName(value) {
  if (value.trim().length < 2) return "Enter your name (at least 2 characters).";
  return "";
}

function validateEmail(value) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(value.trim())) return "Enter a valid email address, like name@example.com.";
  return "";
}

function validateMessage(value) {
  if (value.trim().length < 10) return "Enter a message of at least 10 characters.";
  return "";
}

function setupContactForm() {
  const form = document.getElementById("contactForm");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");
  const successMsg = document.getElementById("formSuccess");

  // Validate each field when the user leaves it
  nameInput.addEventListener("blur", () => setFieldError(nameInput, validateName(nameInput.value)));
  emailInput.addEventListener("blur", () => setFieldError(emailInput, validateEmail(emailInput.value)));
  messageInput.addEventListener("blur", () => setFieldError(messageInput, validateMessage(messageInput.value)));

  form.addEventListener("submit", event => {
    event.preventDefault(); // no backend, so stop the normal page reload
    successMsg.hidden = true;

    const nameError = validateName(nameInput.value);
    const emailError = validateEmail(emailInput.value);
    const messageError = validateMessage(messageInput.value);

    setFieldError(nameInput, nameError);
    setFieldError(emailInput, emailError);
    setFieldError(messageInput, messageError);

    // Stop if any field has an error and focus the first invalid one
    if (nameError || emailError || messageError) {
      form.querySelector("[aria-invalid='true']").focus();
      return;
    }

    // All valid: show the success message and clear the form
    successMsg.hidden = false;
    form.reset();
  });
}

/* ---------- 9. Start the app ---------- */
document.addEventListener("DOMContentLoaded", () => {
  populateTrackFilter();
  renderProjects(projects);

  searchInput.addEventListener("input", applyFilters);   // real-time search
  trackFilter.addEventListener("change", applyFilters);
  resetBtn.addEventListener("click", resetFilters);

  setupModal();
  setupNavigation();
  setupFadeIn();
  setupContactForm();
});
