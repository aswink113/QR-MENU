const API_BASE_URL = 'http://localhost:8001/api/v1'

export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health/`)
    return await res.json()
  } catch (err) {
    console.warn('Backend not responding to health check', err)
    return null
  }
}

export async function fetchPublicMenu(slug = 'the-spice-route') {
  try {
    const res = await fetch(`${API_BASE_URL}/public/menu/${slug}/`)
    if (!res.ok) throw new Error('Failed to fetch public menu')
    return await res.json()
  } catch (err) {
    console.warn('Falling back to local data for public menu', err)
    return null
  }
}

export async function submitOrder(orderData: {
  restaurant_slug: string
  table_number: string
  items: any[]
  total_minor: number
}) {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    })
    return await res.json()
  } catch (err) {
    console.error('Error submitting order to PostgreSQL backend', err)
    return null
  }
}

export async function sendWaiterCall(restaurant_slug = 'the-spice-route', table_number = '14') {
  try {
    const res = await fetch(`${API_BASE_URL}/waiter-call/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ restaurant_slug, table_number })
    })
    return await res.json()
  } catch (err) {
    console.error('Error calling waiter', err)
    return null
  }
}

export async function fetchPlans() {
  try {
    const res = await fetch(`${API_BASE_URL}/plans/`)
    if (!res.ok) throw new Error('Failed to fetch plans')
    return await res.json()
  } catch (err) {
    console.warn('Falling back to local plans', err)
    return null
  }
}

export async function fetchSubscription(slug = 'the-spice-route') {
  try {
    const res = await fetch(`${API_BASE_URL}/billing/subscription/?slug=${slug}`)
    if (!res.ok) throw new Error('Failed to fetch subscription')
    return await res.json()
  } catch (err) {
    console.warn('Falling back to local subscription', err)
    return null
  }
}

export async function fetchAnalytics(slug = 'the-spice-route') {
  try {
    const res = await fetch(`${API_BASE_URL}/analytics/?slug=${slug}`)
    if (!res.ok) throw new Error('Failed to fetch analytics')
    return await res.json()
  } catch (err) {
    console.warn('Falling back to local analytics', err)
    return null
  }
}
