export interface GraduateStudents {
  id: number,
  student: {
    full_name: string,
    diploma_theme: string,
    speciality: string,
    admission_year: number
  },
  teacher: {
    full_name: string
  }
}
