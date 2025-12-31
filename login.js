import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// ---- Supabase setup
const SUPABASE_URL = 'https://jxqgghfdvrlmpqeykkmx.supabase.co'
const SUPABASE_KEY = 'sb_publishable_BzVnuUeh0PxJxW2ezXGXwg_9OjLy5NE'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

document.addEventListener('DOMContentLoaded', async () => {
  const hamburger = document.getElementById('open-profile-menu')
  if (!hamburger) return

  const hamburgerLink = hamburger.closest('a') || hamburger

  // Get logged-in user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) return  // Not logged in, do nothing

  // Create profile popup
  const popup = document.createElement('div')
  popup.className = 'profile-popup'
  popup.innerHTML = `
    <div class="popup-content">
      <h2 class="profile-name"></h2>
      <p class="profile-email"></p>
      <a href="profile.html">View Full Profile</a>
    </div>
  `
  document.body.appendChild(popup)

  const nameEl = popup.querySelector('.profile-name')
  const emailEl = popup.querySelector('.profile-email')

  // Load client data from Supabase
  const { data: client, error: clientError } = await supabase
    .from('Clients')
    .select('full_name, email')
    .eq('id', user.id)
    .single()

  if (clientError) {
    console.error('Failed to fetch client data:', clientError)
  } else if (client) {
    nameEl.textContent = client.full_name
    emailEl.textContent = client.email
  }

  // Handle hamburger click to toggle popup
  hamburgerLink.removeAttribute('href')
  let open = false
  hamburgerLink.addEventListener('click', (e) => {
    e.preventDefault()
    open = !open
    popup.classList.toggle('open', open)
  })

  // Close popup when clicking outside
  document.addEventListener('click', (e) => {
    if (!popup.contains(e.target) && !hamburger.contains(e.target)) {
      popup.classList.remove('open')
      open = false
    }
  })
})
