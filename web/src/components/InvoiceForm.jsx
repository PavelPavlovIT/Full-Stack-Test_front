import utils from '../utils/formatting.js'

function InvoiceForm({
  studentId,
  courseId,
  onStudentChange,
  onCourseChange,
  students,
  courses,
  studentsError,
  coursesError,
  onPreview,
  isPreviewPending,
}) {
  return (
    <>
      <div className="formGrid">
        <label className="field">
          <span className="label">Student</span>
          <select value={studentId} onChange={onStudentChange} disabled={Boolean(studentsError)}>
            <option value="">Select a student…</option>
            {students.map((student, index) => (
              <option
                key={String(student.id ?? student.studentId ?? student._id ?? index)}
                value={String(student.id ?? student.studentId ?? student._id ?? '')}
              >
                {utils.getStudentLabel(student)}
              </option>
            ))}
          </select>
          {studentsError ? <span className="hint error">{studentsError}</span> : null}
        </label>

        <label className="field">
          <span className="label">Course</span>
          <select value={courseId} onChange={onCourseChange} disabled={Boolean(coursesError)}>
            <option value="">Select a course…</option>
            {courses.map((course, index) => (
              <option
                key={String(course.id ?? course.courseId ?? course._id ?? index)}
                value={String(course.id ?? course.courseId ?? course._id ?? '')}
              >
                {utils.getCourseLabel(course)}
              </option>
            ))}
          </select>
          {coursesError ? <span className="hint error">{coursesError}</span> : null}
        </label>
      </div>

      <div className="actions">
        <button
          type="button"
          className="primary"
          onClick={onPreview}
          disabled={!studentId || !courseId || isPreviewPending}
        >
          {isPreviewPending ? 'Previewing…' : 'Preview'}
        </button>
      </div>
    </>
  )
}

export default InvoiceForm
