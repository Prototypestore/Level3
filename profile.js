async function login() {
  const email = document.getElementById('email').value.trim();
  if (!email) {
    alert("Please enter your email.");
    return;
  }

  try {
    // Fetch user info from your MockAPI
    const response = await fetch(`https://6945c839ed253f51719c4d69.mockapi.io/Lev/users?email=${email}`);
    const data = await response.json();

    if (data.length === 0) {
      alert("Email not found!");
      return;
    }

    const user = data[0];

    // Populate profile section
    document.getElementById('user-display').textContent = user.name;
    document.getElementById('profile-email').textContent = user.email;
    document.getElementById('profile-member').textContent = user.memberSince;

    // Show profile section, hide login
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('profile-section').style.display = 'block';

    // Optional: send email using EmailJS (later)
    // emailjs.send("service_id", "template_id", { user_email: user.email });

  } catch (error) {
    console.error(error);
    alert("Failed to fetch user info.");
  }
}

function logout() {
  // Hide profile and show login
  document.getElementById('profile-section').style.display = 'none';
  document.getElementById('login-section').style.display = 'block';
  document.getElementById('email').value = '';
}

// Demo social login alerts
document.querySelector('.facebook').onclick = () => alert("Facebook login clicked!");
document.querySelector('.google').onclick = () => alert("Google login clicked!");
document.querySelector('.apple').onclick = () => alert("Apple login clicked!");
