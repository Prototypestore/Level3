const emailInput = document.getElementById('email');
const loginBtn = document.getElementById('login-btn');

loginBtn?.addEventListener('click', login);

async function login() {
  const email = emailInput.value.trim();
  if (!email) {
    alert('Please enter your email.');
    return;
  }

  try {
    // ✅ Fetch users from the mock API
    const response = await fetch(
      'https://6945c839ed253f51719c4d69.mockapi.io/Lev/users' // <-- API endpoint
    );

    if (!response.ok) throw new Error('Network error');

    const users = await response.json();
    const user = users.find(
      u => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      alert('Email not found.');
      return;
    }

    // ✅ Save user in localStorage
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('isLoggedIn', 'true'); // Optional: flag for login state

    // ✅ Redirect to profile page instead of index
    window.location.href = 'profile.html';

  } catch (err) {
    console.error(err);
    alert('Login failed. Try again.');
  }
}
