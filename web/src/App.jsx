import { useState } from 'react'
import './App.css'

import InvoiceForm from './components/InvoiceForm.jsx'
import InvoiceResult from './components/InvoiceResult.jsx'
import useInvoiceData from './hooks/useInvoiceData.js'

function App() {
  const [studentId, setStudentId] = useState('')
  const [courseId, setCourseId] = useState('')

  const { studentsQuery, coursesQuery, previewMutation, students, courses, isInitialLoading, previewResult } =
    useInvoiceData({ studentId, courseId })

  return (
    <main className="page">
      <header className="header">
        <h1>Invoice preview</h1>
        <p>Select a student and a course, then click Preview.</p>
      </header>

      <section className="card" aria-busy={isInitialLoading ? 'true' : 'false'}>
        {isInitialLoading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            <InvoiceForm
              studentId={studentId}
              courseId={courseId}
              onStudentChange={(e) => {
                previewMutation.reset()
                setStudentId(e.target.value)
              }}
              onCourseChange={(e) => {
                previewMutation.reset()
                setCourseId(e.target.value)
              }}
              students={students}
              courses={courses}
              studentsError={studentsQuery.isError ? studentsQuery.error?.message || 'Failed to load students' : null}
              coursesError={coursesQuery.isError ? coursesQuery.error?.message || 'Failed to load courses' : null}
              onPreview={() => previewMutation.mutate()}
              isPreviewPending={previewMutation.isPending}
            />

            <InvoiceResult
              isError={previewMutation.isError}
              errorMessage={previewMutation.error?.message || 'Preview request failed'}
              isSuccess={previewMutation.isSuccess}
              result={previewResult}
            />
          </>
        )}
      </section>
    </main>
  )
}

export default App
