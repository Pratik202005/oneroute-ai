const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const processRequest = async (formData) => {
  const res = await fetch(`${API_URL}/api/process-request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  })

  // handle non-200 errors cleanly
  const payload = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(payload?.error || 'Failed to process request')
  }

  return payload // should be: { success: true, data: {...} }
}