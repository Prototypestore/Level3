// ---- DOM ELEMENTS
const openMenuBtn = document.getElementById('open-profile-menu');
const closeMenuBtn = document.getElementById('close-profile-menu');
const profileMenu = document.getElementById('profile-menu');
const logoutBtn = document.querySelector('.logout-btn');
const menuLink = document.getElementById('hamburger-menu-link');

// ---- SUPABASE CLIENT (needed to fetch current user info)
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient(
  'https://baghbpdaykkfekvprwto.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhZ2hicGRheWtrZmVydnByd3RvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzODk1NDAsImV4cCI6MjA4MTk2NTU0MH0.C6InqOdzqlgJ1va0h2w-4R9H-xDJ9KrONX_YjNVM2M0'
);

// ---- GET CURRENT USER
async function loadUser() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // Not logged in → redirect
    window.location.href = 'login.html';
    return null;
  }

  // Default fullName if missing
  let fullName = localStorage.getItem('fullName') || 'Aleo Code';

  // Save current user info in localStorage for menu
  const currentUser = {
    id: user.id,
    email: user.email,
    fullName
  };
  localStorage.setItem('user', JSON.stringify(currentUser));

  return currentUser;
}

// ---- UPDATE HAMBURGER MENU BASED ON LOGIN STATUS
async function updateMenu() {
  const currentUser = await loadUser();

  if (!currentUser) return;

  menuLink.textContent = 'Profile';
  menuLink.href = 'profile.html';

  // Update menu info
  document.getElementById('menu-username').textContent = currentUser.fullName;
  document.getElementById('menu-email').textContent = currentUser.email;
}

// ---- MENU OPEN/CLOSE
openMenuBtn?.addEventListener('click', () => {
  profileMenu.classList.add('open');
  profileMenu.setAttribute('aria-hidden', 'false');
});

closeMenuBtn?.addEventListener('click', () => {
  profileMenu.classList.remove('open');
  profileMenu.setAttribute('aria-hidden', 'true');
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') profileMenu.classList.remove('open');
});

// ---- LOGOUT
logoutBtn?.addEventListener('click', async () => {
  await supabase.auth.signOut(); // clear Supabase session
  localStorage.removeItem('user');
  localStorage.removeItem('fullName');
  window.location.href = 'login.html';
});

// ---- PROFILE EDIT (optional, simple example)
const nameInput = document.getElementById('profile-name-input');
const saveBtn = document.getElementById('save-profile-btn');

saveBtn?.addEventListener('click', () => {
  const newName = nameInput.value.trim();
  if (!newName) return alert('Name cannot be empty');

  // Update localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  user.fullName = newName;
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('fullName', newName);

  // Update menu
  document.getElementById('menu-username').textContent = newName;
  alert('Profile updated!');
});

// ---- INIT
updateMenu();
