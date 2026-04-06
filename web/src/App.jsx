import { useMemo, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import './App.css'

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

function normalizeId(value) {
  if (value === '' || value == null) return value
  const asNumber = Number(value)
  return Number.isFinite(asNumber) && String(asNumber) === String(value).trim()
    ? asNumber
    : value
}

function getStudentLabel(student) {
  if (!student || typeof student !== 'object') return String(student)
  return (
    student.name ||
    student.fullName ||
    [student.firstName, student.lastName].filter(Boolean).join(' ') ||
    student.email ||
    student.id ||
    student.studentId ||
    'Student'
  )
}

function getCourseLabel(course) {
  if (!course || typeof course !== 'object') return String(course)
  return course.title || course.name || course.code || course.id || course.courseId || 'Course'
}

function isPresent(value) {
  return value !== null && value !== undefined && value !== ''
}

function formatUsd(value) {
  if (!isPresent(value)) return ''
  if (typeof value === 'number' && Number.isFinite(value)) return `$${value.toFixed(2)}`
  const text = String(value).trim()
  if (!text) return ''
  return text.startsWith('$') ? text : `$${text}`
}

function App() {
  const [studentId, setStudentId] = useState('')
  const [courseId, setCourseId] = useState('')

  const studentsQuery = useQuery({
    queryKey: ['students'],
    queryFn: () => fetchJson(`${API_BASE_URL}/api/Students`),
  })

  const coursesQuery = useQuery({
    queryKey: ['courses'],
    queryFn: () => fetchJson(`${API_BASE_URL}/api/Courses`),
  })

  const previewMutation = useMutation({
    mutationFn: () =>
      fetchJson(`${API_BASE_URL}/api/Invoices/preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: normalizeId(studentId),
          courseId: normalizeId(courseId),
        }),
      }),
  })

  const students = useMemo(
    () => (Array.isArray(studentsQuery.data) ? studentsQuery.data : []),
    [studentsQuery.data],
  )
  const courses = useMemo(
    () => (Array.isArray(coursesQuery.data) ? coursesQuery.data : []),
    [coursesQuery.data],
  )

  const isInitialLoading = studentsQuery.isLoading || coursesQuery.isLoading

  const previewResult = useMemo(() => {
    const data = previewMutation.data
    if (!data || typeof data !== 'object') return null

    const status = data.status
    const basePrice = data.basePrice
    const calculatedPrice = data.calculatedPrice

    if (!isPresent(status) || !isPresent(basePrice) || !isPresent(calculatedPrice)) return null
    return { status, basePrice, calculatedPrice }
  }, [previewMutation.data])

  return (
    <main className="page">
      <header className="header">
        <h1>Invoice preview</h1>
        <p>Выберите студента и курс, затем нажмите Preview.</p>
      </header>

      <section className="card" aria-busy={isInitialLoading ? 'true' : 'false'}>
        {isInitialLoading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            <div className="formGrid">
              <label className="field">
                <span className="label">Student</span>
                <select
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  disabled={studentsQuery.isError}
                >
                  <option value="">Select a student…</option>
                  {students.map((s, index) => (
                    <option
                      key={String(s.id ?? s.studentId ?? s._id ?? index)}
                      value={String(s.id ?? s.studentId ?? s._id ?? '')}
                    >
                      {getStudentLabel(s)}
                    </option>
                  ))}
                </select>
                {studentsQuery.isError ? (
                  <span className="hint error">{studentsQuery.error?.message || 'Failed to load students'}</span>
                ) : null}
              </label>

              <label className="field">
                <span className="label">Course</span>
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  disabled={coursesQuery.isError}
                >
                  <option value="">Select a course…</option>
                  {courses.map((c, index) => (
                    <option
                      key={String(c.id ?? c.courseId ?? c._id ?? index)}
                      value={String(c.id ?? c.courseId ?? c._id ?? '')}
                    >
                      {getCourseLabel(c)}
                    </option>
                  ))}
                </select>
                {coursesQuery.isError ? (
                  <span className="hint error">{coursesQuery.error?.message || 'Failed to load courses'}</span>
                ) : null}
              </label>
            </div>

            <div className="actions">
              <button
                type="button"
                className="primary"
                onClick={() => previewMutation.mutate()}
                disabled={!studentId || !courseId || previewMutation.isPending}
              >
                {previewMutation.isPending ? 'Previewing…' : 'Preview'}
              </button>
            </div>

            <div className="result">
              {previewMutation.isError ? (
                <div className="errorBox" role="alert">
                  {previewMutation.error?.message || 'Preview request failed'}
                </div>
              ) : null}

              {previewMutation.isSuccess && previewResult ? (
                <div className="resultCard" aria-label="Invoice preview result">
                  <div className="resultRow">
                    <span className="resultKey">Student Status:</span>
                    <span className="resultValue">{String(previewResult.status)}</span>
                  </div>
                  <div className="resultRow">
                    <span className="resultKey">Base Price:</span>
                    <span className="resultValue">{formatUsd(previewResult.basePrice)}</span>
                  </div>
                  <div className="resultRow">
                    <span className="resultKey">Final Price:</span>
                    <span className="resultValue resultValueStrong">{formatUsd(previewResult.calculatedPrice)}</span>
                  </div>
                </div>
              ) : null}
            </div>
          </>
        )}
      </section>
    </main>
  )
}

export default App
