import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// ---- Supabase setup
const supabase = createClient(
  'https://jxqgghfdvrlmpqeykkmx.supabase.co',
  'sb_publishable_BzVnuUeh0PxJxW2ezXGXwg_9OjLy5NE'
)

// ---- Get form
const form = document.getElementById('signup-form')

if (!form) {
  console.error('Signup form not found')
  return
}

// ---- Handle submit
form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const fullName = document.getElementById('full-name').value.trim()
  const email = document.getElementById('email').value.trim()
  const phone = document.getElementById('phone').value.trim()

  if (!fullName || !email) {
    alert('Please fill in required fields')
    return
  }

  // 1️⃣ Create auth user (email OTP)
  const { data: authData, error: authError } =
    await supabase.auth.signInWithOtp({ email })

  if (authError) {
    alert(authError.message)
    return
  }

  // Safety check
  if (!authData.user) {
    alert('Check your email to complete sign-up')
    return
  }

  // 2️⃣ Insert into Clients table
  const { error: insertError } = await supabase
    .from('Clients')
    .insert({
      id: authData.user.id, // REQUIRED for RLS
      full_name: fullName,
      email,
      phone
    })

  if (insertError) {
    alert(insertError.message)
    return
  }

  // 3️⃣ Redirect to homepage
  window.location.href = 'index.html'
})
