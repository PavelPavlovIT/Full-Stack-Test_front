function normalizeId(value) {
  if (value === '' || value == null) return value
  const asNumber = Number(value)
  return Number.isFinite(asNumber) && String(asNumber) === String(value).trim() ? asNumber : value
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

const utils = {
  normalizeId,
  formatUsd,
  getStudentLabel,
  getCourseLabel,
}

export { normalizeId, formatUsd, getStudentLabel, getCourseLabel }
export default utils
