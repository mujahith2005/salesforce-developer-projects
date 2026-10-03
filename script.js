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
    demo: true,
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
      <div class="card-actions">
        <button type="button" class="btn btn-primary" data-project-id="${project.id}">View Project</button>
        ${project.demo ? '<a href="#demo" class="btn btn-outline">Try Live Demo</a>' : ""}
      </div>
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
  const sections = ["home", "projects", "demo", "about", "contact"]
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


/* ---------- 10. EventForce live demo (merged project) ---------- */
document.addEventListener("DOMContentLoaded", () => {
/* EventForce Management System - front-end mirror of the Salesforce project */
const root = document.getElementById('ef'); const $ = s => root.querySelector(s);
const BUDGET = {Wedding:50000,Corporate:30000,Birthday:10000,Anniversary:20000,Festival:60000,Concert:40000,Other:15000};
const SERVICES = ['Catering','Decor','Photography','Videography','Lighting','Stage Setup','Makeup Artist','DJ/Music','Transportation','Hosting/Anchor'];
const EMAIL_RE = /^[a-zA-Z0-9._]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,}$/;
const d = n => { const x = new Date(); x.setDate(x.getDate() + n); return x.toISOString().slice(0, 10); };

/* Schema: one definition drives tables + forms for every object */
const SCHEMA = {
  events:{label:'Events',fields:[
    {k:'name',l:'Event Name',t:'text',req:1},
    {k:'date',l:'Event Date',t:'date',req:1},
    {k:'type',l:'Event Type',t:'select',o:Object.keys(BUDGET),req:1},
    {k:'status',l:'Event Status',t:'select',o:['Planned','Confirmed','Completed','Pending Cancellation','Canceled','Rejected']},
    {k:'client',l:'Client',t:'ref',r:'clients'},{k:'venue',l:'Venue',t:'ref',r:'venues'},
    {k:'vendors',l:'Vendors (Event Vendor)',t:'refs',r:'vendors',hide:1}]},
  clients:{label:'Clients',fields:[
    {k:'name',l:'Client Name',t:'text',req:1},{k:'email',l:'Email',t:'email'},{k:'phone',l:'Phone',t:'tel'},
    {k:'address',l:'Address',t:'text'},{k:'country',l:'Country',t:'text'},{k:'city',l:'City',t:'text'}]},
  vendors:{label:'Vendors',fields:[
    {k:'name',l:'Vendor Name',t:'text',req:1},{k:'email',l:'Email',t:'email'},{k:'phone',l:'Phone',t:'tel'},
    {k:'service',l:'Service Type',t:'multi',o:SERVICES},{k:'status',l:'Status',t:'select',o:['Available','Booked','Cancelled']}]},
  venues:{label:'Venues',fields:[
    {k:'name',l:'Venue Name',t:'text',req:1},{k:'address',l:'Address',t:'text'},{k:'location',l:'Location (URL)',t:'url'},
    {k:'capacity',l:'Capacity',t:'number'},{k:'status',l:'Availability Status',t:'select',o:['Available','Reserved']}]},
  feedback:{label:'Feedback',fields:[
    {k:'client',l:'Client',t:'ref',r:'clients',req:1},{k:'event',l:'Event',t:'ref',r:'events',req:1},
    {k:'rating',l:'Rating (1-5)',t:'select',o:['1','2','3','4','5'],req:1},{k:'comments',l:'Comments',t:'text'}]}
};
/* Role-based access (Profiles / Permission Sets) */
const CAN = {'Event Admin':['events','clients','vendors','venues','feedback'],'Event Coordinator':['events','clients','feedback'],'Vendor Manager':['vendors','venues']};

let DB = JSON.parse(localStorage.getItem('eventforce') || 'null') || seed();
let route = 'dashboard', q = '';
const save = () => localStorage.setItem('eventforce', JSON.stringify(DB));
const uid = () => Math.random().toString(36).slice(2, 9);
const find = (c, id) => DB[c].find(x => x.id === id);
const nm = (c, id) => (find(c, id) || {}).name || '—';
const money = n => '₹' + Number(n).toLocaleString('en-IN');
const budget = e => BUDGET[e.type] || 0;           // formula field
const can = c => CAN[$('#role').value].includes(c);

function seed() {
  const clients = ['Ramesh Kumar','Priya Sharma','Anita Desai','John Mathew','Sara Khan'].map((n, i) => ({id:'c'+i,name:n,email:n.split(' ')[0].toLowerCase()+'@mail.com',phone:'98765432'+i+'0',address:'12 Main Road',country:'India',city:['Chennai','Mumbai','Delhi','Bangalore','Hyderabad'][i]}));
  const venues = [['Grand Palace Hall',500],['Lakeview Resort',250],['City Convention Centre',1200],['Garden Terrace',150]].map((v, i) => ({id:'v'+i,name:v[0],address:'Coimbatore Rd',location:'https://maps.google.com',capacity:v[1],status:'Available'}));
  const vendors = [['Spice Route Caterers','Catering'],['Bloom Decor','Decor'],['Lens Story Photography','Photography'],['BeatBox DJs','DJ/Music'],['BrightStage Lighting','Lighting']].map((v, i) => ({id:'d'+i,name:v[0],email:'hello@vendor'+i+'.com',phone:'91234567'+i+'0',service:[v[1]],status:'Available'}));
  const ev = (i, name, off, type, status, c, v, vs) => ({id:'e'+i,name,date:d(off),type,status,client:'c'+c,venue:v==null?'':'v'+v,vendors:vs.map(x => 'd'+x)});
  const events = [ev(0,'Kumar-Rao Wedding',2,'Wedding','Confirmed',0,0,[0,1,2]),ev(1,'TechCorp Annual Meet',12,'Corporate','Confirmed',2,2,[0,4]),
    ev(2,'Aarav Birthday Bash',25,'Birthday','Planned',1,3,[1,3]),ev(3,'Music Fiesta',40,'Concert','Planned',4,2,[3,4]),
    ev(4,'Silver Anniversary',-10,'Anniversary','Completed',3,1,[0,2]),ev(5,'Spring Festival',-20,'Festival','Completed',1,0,[1,3])];
  events.filter(e => e.status === 'Confirmed').forEach(e => venues.find(v => v.id === e.venue).status = 'Reserved');
  return {clients,venues,vendors,events,feedback:[{id:'f0',client:'c3',event:'e4',rating:'5',comments:'Flawless coordination!'},{id:'f1',client:'c1',event:'e5',rating:'4',comments:'Great decor, slight delay.'}]};
}

/* ---------- Business logic (Apex triggers / batch / flows equivalents) ---------- */
function syncVenues() {  // VenueStatusHelper: Confirmed -> Reserved, Canceled -> Available
  DB.events.forEach(e => { const v = find('venues', e.venue); if (!v) return;
    if (e.status === 'Confirmed') v.status = 'Reserved'; else if (e.status === 'Canceled') v.status = 'Available'; });
}
function completePast() {  // BatchCompleteEvents: past events -> Completed
  const t = d(0); DB.events.forEach(e => { if (e.date < t && !['Completed','Canceled'].includes(e.status)) e.status = 'Completed'; });
}
function doubleBooked(e) {  // PreventDoubleBooking
  return DB.events.some(x => x.id !== e.id && x.venue && x.venue === e.venue && x.date === e.date && x.status !== 'Canceled');
}
const reminders = () => DB.events.filter(e => e.status === 'Confirmed' && e.date >= d(0) && e.date <= d(3));

/* ---------- UI ---------- */
function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 2600); }
function nav() {
  const items = [['dashboard','📊 Dashboard'],...Object.keys(SCHEMA).map(k => [k, SCHEMA[k].label]),['reports','📈 Reports']];
  $('#nav').innerHTML = items.map(([k, l]) => `<a class="${route===k?'on':''}" data-r="${k}">${l}</a>`).join('');
  $('#nav').onclick = e => { if (e.target.dataset.r) { route = e.target.dataset.r; q = ''; render(); } };
}
function render() {
  completePast(); syncVenues(); save(); nav();
  $('#title').textContent = route === 'dashboard' ? 'Operations Dashboard' : route === 'reports' ? 'Reports' : SCHEMA[route].label;
  $('#actions').innerHTML = '';
  if (route === 'dashboard') dash(); else if (route === 'reports') reports(); else table();
}
function dash() {
  const ev = DB.events, up = ev.filter(e => e.date >= d(0) && !['Canceled','Rejected'].includes(e.status));
  const rate = DB.feedback.length ? (DB.feedback.reduce((s, f) => s + +f.rating, 0) / DB.feedback.length).toFixed(1) : '–';
  const k = [['Total Events',ev.length],['Upcoming',up.length],['Upcoming Budget',money(up.reduce((s, e) => s + budget(e), 0))],['Avg Rating',rate+' ★'],['Pending Cancellations',ev.filter(e => e.status==='Pending Cancellation').length]];
  const rm = reminders();
  $('#view').innerHTML = `<div class="grid">${k.map(x => `<div class="card kpi"><span>${x[0]}</span><b>${x[1]}</b></div>`).join('')}</div>
  <div class="two"><div class="card"><h3>Upcoming Events by Month</h3>${monthChart()}</div>
  <div class="card"><h3>Events by Status</h3>${statusBars()}</div>
  <div class="card"><h3>⏰ 3-Day Reminders (Confirmed)</h3>${rm.length ? rm.map(e => `<div class="row"><span style="flex:1">${e.name} — ${e.date}<br><small>${nm('clients', e.client)}</small></span><button class="sm" data-rem="${e.id}">Send email</button></div>`).join('') : '<p>No events in the next 3 days.</p>'}</div>
  <div class="card"><h3>Next Events</h3>${up.sort((a,b)=>a.date.localeCompare(b.date)).slice(0,5).map(e => `<div class="row"><span style="flex:1">${e.name}<br><small>${e.date} · ${nm('venues', e.venue)}</small></span><span class="tag ${e.status}">${e.status}</span></div>`).join('')}</div></div>`;
  $('#view').onclick = e => { const id = e.target.dataset.rem; if (id) { const ev = find('events', id), c = find('clients', ev.client); toast(`Reminder sent to ${c ? c.email : 'client'} (cc: Event Owner)`); } };
}
function monthChart() {
  const m = {}; DB.events.filter(e => e.date >= d(0) && !['Canceled','Rejected'].includes(e.status)).forEach(e => m[e.date.slice(0, 7)] = (m[e.date.slice(0, 7)] || 0) + 1);
  const ks = Object.keys(m).sort(), mx = Math.max(1, ...Object.values(m));
  if (!ks.length) return '<p>No upcoming events.</p>';
  return `<div class="bars">${ks.map(k => `<div class="bar" style="height:${m[k]/mx*100}%"><em>${m[k]}</em></div>`).join('')}</div><div class="bl">${ks.map(k => `<span>${k}</span>`).join('')}</div>`;
}
function statusBars() {
  const m = {}; DB.events.forEach(e => m[e.status] = (m[e.status] || 0) + 1);
  return Object.entries(m).map(([k, v]) => `<div class="row"><span class="lab">${k}</span><div class="fill" style="width:${v/DB.events.length*100}%"></div><b>${v}</b></div>`).join('');
}
function reports() {
  const vp = DB.vendors.map(v => ({n:v.name, c:DB.events.filter(e => (e.vendors||[]).includes(v.id)).length}));
  const byType = {}; DB.events.forEach(e => byType[e.type] = (byType[e.type]||0) + budget(e));
  $('#view').innerHTML = `<div class="two"><div class="card"><h3>Vendor Performance (events served)</h3>${vp.map(x => `<div class="row"><span class="lab">${x.n}</span><div class="fill" style="width:${x.c*30}px"></div><b>${x.c}</b></div>`).join('')}</div>
  <div class="card"><h3>Budget by Event Type</h3>${Object.entries(byType).map(([k, v]) => `<div class="row"><span class="lab">${k}</span><b>${money(v)}</b></div>`).join('')}</div>
  <div class="card"><h3>Client Feedback</h3>${DB.feedback.map(f => `<p><b>${nm('clients', f.client)}</b> on ${nm('events', f.event)}: ${'★'.repeat(f.rating)}<br><small>${f.comments||''}</small></p>`).join('')}</div></div>`;
}
function cell(f, r) {
  let v = r[f.k];
  if (f.t === 'ref') return nm(f.r, v);
  if (Array.isArray(v)) return v.join(', ');
  if (f.k === 'status') return `<span class="tag ${v}">${v}</span>`;
  if (f.k === 'rating') return '★'.repeat(v);
  return v ?? '';
}
function table() {
  const S = SCHEMA[route], cols = S.fields.filter(f => !f.hide), editable = can(route);
  if (editable) $('#actions').innerHTML = `<input class="search" placeholder="Search…" id="q" value="${q}"><button id="add">+ New</button>`;
  else $('#actions').innerHTML = `<input class="search" placeholder="Search…" id="q" value="${q}"><span class="tag">Read-only for this role</span>`;
  const rows = DB[route].filter(r => JSON.stringify(Object.values(r)).toLowerCase().includes(q.toLowerCase()));
  $('#view').innerHTML = `<div class="tw"><table><thead><tr>${cols.map(f => `<th>${f.l}</th>`).join('')}${route==='events'?'<th>Budget</th><th>Vendors</th>':''}<th></th></tr></thead><tbody>
  ${rows.map(r => `<tr>${cols.map(f => `<td>${cell(f, r)}</td>`).join('')}${route==='events'?`<td>${money(budget(r))}</td><td>${(r.vendors||[]).map(i => nm('vendors', i)).join(', ')}</td>`:''}
  <td>${editable ? `<button class="sm sec" data-e="${r.id}">Edit</button><button class="sm bad" data-x="${r.id}">Delete</button>` : ''}${route==='events' && editable && ['Planned','Confirmed'].includes(r.status) ? `<button class="sm sec" data-cancel="${r.id}">Request Cancel</button>` : ''}${route==='events' && r.status==='Pending Cancellation' && editable ? `<button class="sm ok" data-ap="${r.id}">Approve</button><button class="sm bad" data-rj="${r.id}">Reject</button>` : ''}</td></tr>`).join('') || '<tr><td>No records</td></tr>'}</tbody></table></div>`;
  $('#q').oninput = e => { q = e.target.value; const p = e.target.selectionStart; table(); const n = $('#q'); n.focus(); n.setSelectionRange(p, p); };
  if (editable) $('#add').onclick = () => openForm();
  $('#view').onclick = e => { const t = e.target.dataset;
    if (t.e) openForm(find(route, t.e));
    if (t.x && confirm('Delete this record?')) { DB[route] = DB[route].filter(r => r.id !== t.x); render(); }
    if (t.cancel) { find('events', t.cancel).status = 'Pending Cancellation'; toast('Cancellation submitted for approval — coordinator notified'); render(); }
    if (t.ap) { find('events', t.ap).status = 'Canceled'; toast('Approved. Client notified of cancellation; venue released.'); render(); }
    if (t.rj) { find('events', t.rj).status = 'Rejected'; toast('Cancellation rejected.'); render(); } };
}
function openForm(rec) {
  const S = SCHEMA[route], r = rec || {}; $('#mtitle').textContent = (rec ? 'Edit ' : 'New ') + S.label.replace(/s$/, '');
  const inp = f => {
    const v = r[f.k] ?? '', n = `name="${f.k}"`, rq = f.req ? 'required' : '';
    if (f.t === 'select') return `<select ${n} ${rq}><option value="">--None--</option>${f.o.map(o => `<option ${o==v?'selected':''}>${o}</option>`).join('')}</select>`;
    if (f.t === 'multi') return `<select ${n} multiple>${f.o.map(o => `<option ${(r[f.k]||[]).includes(o)?'selected':''}>${o}</option>`).join('')}</select>`;
    if (f.t === 'ref') return `<select ${n} ${rq}><option value="">--None--</option>${DB[f.r].map(o => `<option value="${o.id}" ${o.id==v?'selected':''}>${o.name}</option>`).join('')}</select>`;
    if (f.t === 'refs') return `<select ${n} multiple>${DB[f.r].map(o => `<option value="${o.id}" ${(r[f.k]||[]).includes(o.id)?'selected':''}>${o.name}</option>`).join('')}</select>`;
    return `<input type="${f.t}" ${n} value="${v}" ${rq}>`; };
  $('#form').innerHTML = S.fields.map(f => `<label>${f.l}</label>${inp(f)}`).join('') + (route==='events' ? '<label>Event Budget (auto-calculated)</label><input id="bud" disabled>' : '') + '<div class="err" id="err"></div><div class="fa"><button type="button" class="sec" id="cx">Cancel</button><button>Save</button></div>';
  if (route === 'events') { const u = () => $('#bud').value = money(BUDGET[$('[name=type]').value] || 0); $('[name=type]').onchange = u; u(); }
  if (route === 'feedback') { const c = $('[name=client]'), e = $('[name=event]');  // lookup filter: events of selected client only
    const flt = () => [...e.options].forEach(o => o.hidden = !!o.value && !!c.value && find('events', o.value).client !== c.value); c.onchange = flt; flt(); }
  $('#modal').classList.remove('hidden'); $('#cx').onclick = () => $('#modal').classList.add('hidden');
  $('#form').onsubmit = ev => { ev.preventDefault(); const fd = new FormData($('#form')), o = {...r};
    S.fields.forEach(f => o[f.k] = (f.t === 'multi' || f.t === 'refs') ? fd.getAll(f.k) : fd.get(f.k));
    if (!o.status && route === 'events') o.status = 'Planned';
    const er = $('#err');
    if (o.email && !EMAIL_RE.test(o.email)) return er.textContent = 'Please Enter Valid Email Address';
    if (route === 'events' && o.venue && doubleBooked(o)) return er.textContent = 'This Venue is already booked on this date.';
    if (route === 'feedback' && find('events', o.event).client !== o.client) return er.textContent = 'Selected event does not belong to this client.';
    if (!rec) { o.id = uid(); DB[route].push(o); } else Object.assign(rec, o);
    $('#modal').classList.add('hidden'); toast('Saved'); render(); };
}
$('#role').onchange = () => { if (route !== 'dashboard' && route !== 'reports' && !can(route)) route = 'dashboard'; render(); };
render();
});
