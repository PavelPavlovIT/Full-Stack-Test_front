import { useMemo } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import api from '../api/client.js'
import utils from '../utils/formatting.js'

function useInvoiceData({ studentId, courseId }) {
  const studentsQuery = useQuery({
    queryKey: ['students'],
    queryFn: api.getStudents,
  })

  const coursesQuery = useQuery({
    queryKey: ['courses'],
    queryFn: api.getCourses,
  })

  const previewMutation = useMutation({
    mutationFn: () =>
      api.getInvoicePreview({
        studentId: utils.normalizeId(studentId),
        courseId: utils.normalizeId(courseId),
      }),
  })

  const students = useMemo(() => (Array.isArray(studentsQuery.data) ? studentsQuery.data : []), [studentsQuery.data])
  const courses = useMemo(() => (Array.isArray(coursesQuery.data) ? coursesQuery.data : []), [coursesQuery.data])

  const isInitialLoading = studentsQuery.isLoading || coursesQuery.isLoading

  const previewResult = useMemo(() => {
    const data = previewMutation.data
    if (!data || typeof data !== 'object') return null

    const status = data.status
    const basePrice = data.basePrice
    const calculatedPrice = data.calculatedPrice

    const hasStatus = status !== null && status !== undefined && status !== ''
    const hasBasePrice = basePrice !== null && basePrice !== undefined && basePrice !== ''
    const hasCalculatedPrice = calculatedPrice !== null && calculatedPrice !== undefined && calculatedPrice !== ''

    if (!hasStatus || !hasBasePrice || !hasCalculatedPrice) return null

    return { status, basePrice, calculatedPrice }
  }, [previewMutation.data])

  return {
    studentsQuery,
    coursesQuery,
    previewMutation,
    students,
    courses,
    isInitialLoading,
    previewResult,
  }
}

export default useInvoiceData
