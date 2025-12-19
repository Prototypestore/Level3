function login() {
  const email = document.getElementById('email').value.trim();

  if(email === "") {
    alert("Please enter your email.");
    return;
  }

  // Show profile section
  document.getElementById('login-section').style.display = 'none';
  document.getElementById('profile-section').style.display = 'block';

  // Fill in profile info (for demo purposes)
  document.getElementById('user-display').textContent = email.split('@')[0];
  document.getElementById('profile-email').textContent = email;
}

function logout() {
  document.getElementById('profile-section').style.display = 'none';
  document.getElementById('login-section').style.display = 'block';
  document.getElementById('email').value = '';
}

// Social login demo (alert only)
document.querySelector('.facebook').onclick = () => alert("Facebook login clicked!");
document.querySelector('.google').onclick = () => alert("Google login clicked!");
document.querySelector('.apple').onclick = () => alert("Apple login clicked!");
