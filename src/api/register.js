// src/api/register.js

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export async function submitRegistration(formData) {
  const response = await fetch(`${API_URL}/api/registrations/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Registration failed. Please try again.')
  }

  // Free ticket — return success directly
  if (data.free) {
    return data
  }

  // Paid ticket — redirect to Stripe Checkout
  if (data.url) {
    window.location.href = data.url
    return data
  }

  return data
}
