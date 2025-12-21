const openMenuBtn = document.getElementById('open-profile-menu');
const closeMenuBtn = document.getElementById('close-profile-menu');
const profileMenu = document.getElementById('profile-menu');
const logoutBtn = document.querySelector('.logout-btn');

// ✅ GET USER
const user = JSON.parse(localStorage.getItem('user'));

// 🚫 Not logged in → go to login
if (!user) {
  window.location.href = 'login.html';
}

// ✅ UPDATE HAMBURGER MENU BASED ON LOGIN STATUS
const menuLink = document.getElementById('hamburger-menu-link'); // add this ID to your menu link in HTML

if (user) {
  // Logged in → show "Profile"
  menuLink.textContent = 'Profile';
  menuLink.href = 'profile.html';
} else {
  // Not logged in → show "Login"
  menuLink.textContent = 'Login';
  menuLink.href = 'login.html';
}

/* ================= MENU ================= */
openMenuBtn?.addEventListener('click', () => {
  profileMenu.classList.add('open');
  profileMenu.setAttribute('aria-hidden', 'false');
});

closeMenuBtn?.addEventListener('click', () => {
  profileMenu.classList.remove('open');
  profileMenu.setAttribute('aria-hidden', 'true');
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    profileMenu.classList.remove('open');
  }
});

/* ================= USER DATA ================= */
document.getElementById('menu-username').textContent = user.fullName;
document.getElementById('menu-email').textContent = user.email;

/* ================= LOGOUT ================= */
logoutBtn?.addEventListener('click', () => {
  localStorage.removeItem('user');
  window.location.href = 'login.html';
});
