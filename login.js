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
    const response = await fetch(
      'https://6945c839ed253f51719c4d69.mockapi.io/Lev/users'
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

    // ✅ SAVE USER
    localStorage.setItem('user', JSON.stringify(user));

    alert(`Welcome back, ${user.fullName}!`);
    window.location.href = 'index.html';

  } catch (err) {
    console.error(err);
    alert('Login failed. Try again.');
  }
}
