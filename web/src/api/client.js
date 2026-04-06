const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5093'

async function fetchJson(url, options) {
  const response = await fetch(url, options)
  const contentType = response.headers.get('content-type')
  const isJson = contentType?.includes('application/json')

  if (!response.ok) {
    const body = isJson ? await response.json().catch(() => null) : await response.text().catch(() => null)
    const message =
      (body && typeof body === 'object' && (body.message || body.error)) ||
      (typeof body === 'string' && body.trim()) ||
      `${response.status} ${response.statusText}`
    throw new Error(message)
  }

  if (response.status === 204) return null
  return isJson ? response.json() : response.text()
}

async function getStudents() {
  return fetchJson(`${API_BASE_URL}/api/students`)
}

async function getCourses() {
  return fetchJson(`${API_BASE_URL}/api/courses`)
}

async function getInvoicePreview({ studentId, courseId }) {
  return fetchJson(`${API_BASE_URL}/api/invoices/preview`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId, courseId }),
  })
}

const api = {
  API_BASE_URL,
  fetchJson,
  getStudents,
  getCourses,
  getInvoicePreview,
}

export { API_BASE_URL, fetchJson, getStudents, getCourses, getInvoicePreview }
export default api
