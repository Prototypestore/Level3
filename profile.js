/* ===============================
   LOGIN & PROFILE LOGIC
================================ */

// ---- DOM ELEMENTS ----
const emailInput = document.getElementById('email');
const loginBtn = document.querySelector('button[onclick="login()"]');

const openMenuBtn = document.getElementById('open-profile-menu');
const closeMenuBtn = document.getElementById('close-profile-menu');
const profileMenu = document.getElementById('profile-menu');

const menuButtons = document.querySelectorAll('.profile-menu-middle button');
const contentSections = document.querySelectorAll('#profile-content section');

const logoutBtn = document.querySelector('.logout-btn');

let currentUser = null; // will hold logged-in user data

/* ===============================
   LOGIN FUNCTION
================================ */
async function login() {
  const email = emailInput.value.trim();
  if (!email) {
    alert('Please enter your email.');
    return;
  }

  try {
    const response = await fetch('https://6945c839ed253f51719c4d69.mockapi.io/Lev/users');
    if (!response.ok) throw new Error('Network error');

    const users = await response.json();

    // Check if user exists
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      alert('Email not found. Please sign up.');
      return;
    }

    // Successful login
    currentUser = user;
    alert(`Welcome back, ${user.fullName}!`);

    // Redirect to landing page
    window.location.href = 'index.html';
  } catch (error) {
    console.error(error);
    alert('Failed to login. Please try again later.');
  }
}

/* ===============================
   MENU OPEN / CLOSE
================================ */
function openMenu() {
  profileMenu.classList.add('open');
  profileMenu.setAttribute('aria-hidden', 'false');
}
  profileMenu.classList.add('open');
  profileMenu.setAttribute('aria-hidden', 'false');
}

function closeMenu() {
  profileMenu.classList.remove('open');
  profileMenu.setAttribute('aria-hidden', 'true');
}

openMenuBtn?.addEventListener('click', openMenu);
closeMenuBtn?.addEventListener('click', closeMenu);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

/* ===============================
   SECTION SWITCHING
================================ */
function showSection(targetId) {
  contentSections.forEach(section => {
    section.style.display = section.id === targetId ? 'block' : 'none';
  });

  menuButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.target === targetId);
  });
}

menuButtons.forEach(button => {
  button.addEventListener('click', () => {
    showSection(button.dataset.target);
  });
});

// Default section
showSection('profile');

/* ===============================
   POPULATE USER DATA
================================ */
function populateUserData() {
  if (!currentUser) return;

  const avatarEls = document.querySelectorAll('#menu-avatar, #user-avatar');
  const nameEls = document.querySelectorAll('#menu-username, #user-fullname');
  const emailEls = document.querySelectorAll('#menu-email, #profile-email');
  const usernameEl = document.getElementById('profile-username');

  avatarEls.forEach(img => img.src = currentUser.avatar || '');
  nameEls.forEach(el => el.textContent = currentUser.fullName);
  emailEls.forEach(el => el.textContent = currentUser.email);

  if (usernameEl) usernameEl.textContent = currentUser.username || '';
}

// Populate after landing page loads
window.addEventListener('load', populateUserData);

/* ===============================
   LOGOUT
================================ */
logoutBtn?.addEventListener('click', () => {
  currentUser = null;
  closeMenu();
  alert('You have been logged out.');
  window.location.href = 'profile.html';
});
