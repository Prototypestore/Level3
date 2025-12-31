import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// ---- Supabase
const supabase = createClient(
  'https://jxqgghfdvrlmpqeykkmx.supabase.co',
  'sb_publishable_BzVnuUeh0PxJxW2ezXGXwg_9OjLy5NE'
)

// ---- Hamburger elements
const hamburger = document.getElementById('open-profile-menu')
const hamburgerLink = hamburger?.closest('a')

if (!hamburger || !hamburgerLink) return

// ---- Get current user
const { data: { user } } = await supabase.auth.getUser()

// ---- NOT logged in → leave hamburger as normal (login link)
if (!user) return

// ---- Create profile popup
const popup = document.createElement('div')
popup.className = 'profile-popup'
popup.innerHTML = `
  <p class="profile-name"></p>
  <p class="profile-email"></p>
  <a href="profile.html" class="profile-link">View Profile</a>
`
document.body.appendChild(popup)

const nameEl = popup.querySelector('.profile-name')
const emailEl = popup.querySelector('.profile-email')

// ---- Load client data
const { data: client, error } = await supabase
  .from('Clients')
  .select('full_name, email')
  .eq('id', user.id)
  .single()

if (!error && client) {
  nameEl.textContent = client.full_name || 'User'
  emailEl.textContent = client.email
}

// ---- Override hamburger click
hamburgerLink.removeAttribute('href')

let open = false

hamburgerLink.addEventListener('click', (e) => {
  e.preventDefault()
  e.stopPropagation()
  open = !open
  popup.classList.toggle('open', open)
})

// ---- Prevent popup clicks from closing it
popup.addEventListener('click', (e) => {
  e.stopPropagation()
})

// ---- Close popup on outside click
document.addEventListener('click', () => {
  popup.classList.remove('open')
  open = false
})
