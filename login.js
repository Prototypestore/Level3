import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// ---- Supabase
const supabase = createClient(
  'https://jxqgghfdvrlmpqeykkmx.supabase.co',
  'sb_publishable_BzVnuUeh0PxJxW2ezXGXwg_9OjLy5NE'
)

// ---- Hamburger elements
const hamburger = document.getElementById('open-profile-menu')
const hamburgerLink = hamburger?.closest('a')

if (!hamburger || !hamburgerLink) {
  console.warn('Hamburger menu not found')
  return
}

// ---- Inject profile popup (JS ONLY)
const profilePopup = document.createElement('div')
profilePopup.style.position = 'absolute'
profilePopup.style.top = '60px'
profilePopup.style.right = '20px'
profilePopup.style.background = '#fff'
profilePopup.style.borderRadius = '8px'
profilePopup.style.padding = '12px'
profilePopup.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
profilePopup.style.display = 'none'
profilePopup.style.zIndex = '9999'

const nameEl = document.createElement('p')
nameEl.style.margin = '0'
nameEl.style.fontWeight = '600'

const emailEl = document.createElement('p')
emailEl.style.margin = '4px 0 0'
emailEl.style.fontSize = '14px'
emailEl.style.color = '#555'

profilePopup.appendChild(nameEl)
profilePopup.appendChild(emailEl)
document.body.appendChild(profilePopup)

let menuOpen = false

// ---- Get session
const { data: { user } } = await supabase.auth.getUser()

// ---- If NOT logged in → default link behavior
if (!user) {
  console.log('User not logged in')
  return
}

// ---- Logged in → override click
hamburgerLink.removeAttribute('href')

hamburgerLink.addEventListener('click', async (e) => {
  e.preventDefault()
  menuOpen = !menuOpen
  profilePopup.style.display = menuOpen ? 'block' : 'none'
})

// ---- Load client data
const { data: client, error } = await supabase
  .from('clients')
  .select('full_name, email')
  .eq('id', user.id)
  .single()

if (error) {
  console.error('Client fetch error:', error)
} else {
  nameEl.textContent = client.full_name
  emailEl.textContent = client.email
}

// ---- Close popup on outside click
document.addEventListener('click', (e) => {
  if (!profilePopup.contains(e.target) && !hamburger.contains(e.target)) {
    profilePopup.style.display = 'none'
    menuOpen = false
  }
})

// ---- CHECK & APPLY COUPON FOR LOGGED-IN USER
export async function applyCoupon(userId, code, cartTotal) {
  const { data: coupon, error } = await supabase
    .from('user_coupons')
    .select('*')
    .eq('user_id', userId)
    .eq('code', code)
    .eq('used', false)
    .single()

  if (error || !coupon) throw new Error('Invalid or used coupon')
  if (new Date(coupon.expires_at) < new Date()) throw new Error('Coupon expired')
  if (cartTotal < coupon.min_spend) throw new Error(`Minimum spend £${coupon.min_spend}`)

  return cartTotal * (coupon.discount_percent / 100)
}

// ---- MARK COUPON AS USED
export async function markCouponUsed(userId, code) {
  const { error } = await supabase
    .from('user_coupons')
    .update({ used: true })
    .eq('user_id', userId)
    .eq('code', code)

  if (error) console.error('Error marking coupon used:', error)
}

// ---- GUEST COUPONS (localStorage)
export function getGuestCoupons() {
  const data = JSON.parse(localStorage.getItem('guestCoupons')) || []
  const now = Date.now()
  return data.filter(c => now < c.expires)
}

export function createGuestCoupons() {
  const now = Date.now()
  const coupons = Array.from({ length: 4 }).map(() => ({
    code: generateCouponCode(),
    discount_percent: 10,
    expires: now + 24 * 60 * 60 * 1000 // 24 hours
  }))
  localStorage.setItem('guestCoupons', JSON.stringify(coupons))
  return coupons
}
