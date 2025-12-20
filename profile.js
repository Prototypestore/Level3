/* ===============================
   PROFILE MENU LOGIC
================================ */

// ---- DOM ELEMENTS ----
const openMenuBtn = document.getElementById('open-profile-menu');
const closeMenuBtn = document.getElementById('close-profile-menu');
const profileMenu = document.getElementById('profile-menu');

const menuButtons = document.querySelectorAll('.profile-menu-middle button');
const contentSections = document.querySelectorAll('#profile-content section');

const logoutBtn = document.querySelector('.logout-btn');

// ---- MOCK LOGIN STATE (replace later) ----
let isLoggedIn = true;

// ---- MOCK USER DATA (replace with API later) ----
const userData = {
  fullName: 'John Doe',
  email: 'john@example.com',
  username: 'AC-102938',
  avatar: ''
};

/* ===============================
   MENU OPEN / CLOSE
================================ */

function openMenu() {
  if (!isLoggedIn) return;
  profileMenu.classList.add('open');
  profileMenu.setAttribute('aria-hidden', 'false');
}

function closeMenu() {
  profileMenu.classList.remove('open');
  profileMenu.setAttribute('aria-hidden', 'true');
}

// ---- BUTTON EVENTS ----
openMenuBtn?.addEventListener('click', openMenu);
closeMenuBtn?.addEventListener('click', closeMenu);

// ---- ESC KEY CLOSE ----
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeMenu();
  }
});

/* ===============================
   SECTION SWITCHING
================================ */

function showSection(targetId) {
  contentSections.forEach(section => {
    section.style.display =
      section.id === targetId ? 'block' : 'none';
  });

  menuButtons.forEach(btn => {
    btn.classList.toggle(
      'active',
      btn.dataset.target === targetId
    );
  });
}

// ---- MENU NAVIGATION ----
menuButtons.forEach(button => {
  button.addEventListener('click', () => {
    const target = button.dataset.target;
    showSection(target);
  });
});

// ---- DEFAULT SECTION ----
showSection('profile');

/* ===============================
   USER DATA POPULATION
================================ */

function populateUserData() {
  const avatarEls = document.querySelectorAll('#menu-avatar, #user-avatar');
  const nameEls = document.querySelectorAll('#menu-username, #user-fullname');
  const emailEls = document.querySelectorAll('#menu-email, #profile-email');
  const usernameEl = document.getElementById('profile-username');

  avatarEls.forEach(img => {
    img.src = userData.avatar || '';
  });

  nameEls.forEach(el => el.textContent = userData.fullName);
  emailEls.forEach(el => el.textContent = userData.email);

  if (usernameEl) {
    usernameEl.textContent = userData.username;
  }
}

populateUserData();

/* ===============================
   LOGOUT
================================ */

logoutBtn?.addEventListener('click', () => {
  isLoggedIn = false;
  closeMenu();

  // Clear UI state (expand later)
  alert('You have been logged out.');

  // Redirect or show login
  window.location.href = 'profile.html';
});

