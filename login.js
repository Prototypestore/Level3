console.log('login.js loaded')
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// ---- Supabase client
const supabase = createClient(
  'https://baghbpdaykkfekvprwto.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhZ2hicGRheWtrZmVrdnByd3RvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzODk1NDAsImV4cCI6MjA4MTk2NTU0MH0.C6InqOdzqlgJ1va0h2w-4R9H-xDJ9KrONX_YjNVM2M0'
)

// ---- DOM
const emailInput = document.getElementById('email')
const loginBtn = document.getElementById('login-btn')

// ---- Login button
loginBtn?.addEventListener('click', login)

// ---- Email login (magic link)
async function login() {
  const email = emailInput.value.trim()

  if (!email) {
    alert('Please enter your email.')
    return
  }

  console.log('Sending verification email to:', email)

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/index.html`
    }
  })

  if (error) {
    console.error(error)
    alert('Failed to send verification email.')
    return
  }

  alert('Verification email sent! Check your inbox.')
}

// ---- Auth state listener (RUNS AFTER VERIFY)
supabase.auth.onAuthStateChange(async (event, session) => {
  console.log('Auth event:', event)

  if (event === 'SIGNED_IN' && session?.user) {
    const { id, email } = session.user

    console.log('User signed in:', email)

    // Save email to DB
    await saveUserEmail(id, email)

    // Optional login flag (UI use)
    localStorage.setItem('isLoggedIn', 'true')

    // Always return to home
    window.location.href = 'index.html'
  }
})

// ---- Save / upsert email
async function saveUserEmail(id, email) {
  const { error } = await supabase
    .from('users')
    .upsert(
      { id, email },
      { onConflict: 'email' }
    )

  if (error) {
    console.error('Failed to save user:', error)
  } else {
    console.log('User saved/updated in DB')
  }
}
