// ----- Dummy login function -----
function login() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  // Simple validation (for demo only)
  if(username === "" || password === "") {
    alert("Please enter both username and password.");
    return;
  }

  // Show profile section
  document.getElementById('login-section').style.display = 'none';
  document.getElementById('profile-section').style.display = 'block';

  // Fill in profile info
  document.getElementById('user-display').textContent = username;
  document.getElementById('profile-username').textContent = username;
}

function logout() {
  // Hide profile, show login
  document.getElementById('profile-section').style.display = 'none';
  document.getElementById('login-section').style.display = 'block';

  // Clear input fields
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
}
