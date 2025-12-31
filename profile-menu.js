import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabase = createClient(
  'https://jxqgghfdvrlmpqeykkmx.supabase.co',
  'sb_publishable_BzVnuUeh0PxJxW2ezXGXwg_9OjLy5NE'
)

(async function() {
  const hamburger = document.getElementById('open-profile-menu')
  const hamburgerLink = hamburger?.closest('a')

  if (!hamburger || !hamburgerLink) return

  // Get logged-in user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return  // Not logged in → default behavior (go to login.html)

  // Create the side menu popup
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

  // Load client data
  const { data: client } = await supabase
    .from('Clients')
    .select('full_name, email')
    .eq('id', user.id)
    .single()

  if (client) {
    nameEl.textContent = client.full_name
    emailEl.textContent = client.email
  }

  // Override hamburger click
  hamburgerLink.removeAttribute('href')
  let open = false

  hamburgerLink.addEventListener('click', (e) => {
    e.preventDefault()
    open = !open
    popup.classList.toggle('open', open)
  })

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!popup.contains(e.target) && !hamburger.contains(e.target)) {
      popup.classList.remove('open')
      open = false
    }
  })
})()
