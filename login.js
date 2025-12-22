console.log('login.js loaded')
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// 🔑 Supabase client
const supabase = createClient(
  'https://baghbpdaykkfekvprwto.supabase.co',
  'sb_publishable_9_V52GxiWdaCzhStTCk6xg_xMfdiLbQ'
)

// DOM elements
const emailInput = document.getElementById('email')
const loginBtn = document.getElementById('login-btn')

// Login click
loginBtn?.addEventListener('click', login)

// ✉️ Email login with verification
async function login() {
  const email = emailInput.value.trim()

  if (!email) {
    alert('Please enter your email.')
    return
  }

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      // 👇 where user goes AFTER clicking "Verify"
      emailRedirectTo: `${window.location.origin}/index.html`
    }
  })

  if (error) {
    console.error(error)
    alert('Failed to send verification email.')
    return
  }

  alert('Verification email sent! Please check your inbox.')
}

// 🔁 Listen for login (ALL METHODS)
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN' && session?.user) {
    const user = session.user

    // Save email to DB
    await saveUserEmail(user.id, user.email)

    // Optional: local login flag (for UI)
    localStorage.setItem('isLoggedIn', 'true')

    // Always go back to home
    window.location.href = 'index.html'
  }
})

// 💾 Upsert email into Supabase
async function saveUserEmail(id, email) {
  const { error } = await supabase
    .from('users')
    .upsert(
      { id, email },
      { onConflict: 'email' }
    )

  if (error) {
    console.error('Error saving user:', error)
  }
}
