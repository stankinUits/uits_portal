export const ApiConfig = {
  telegram: {
    user: 'api/telegram/user',
    events: {
      notify: 'api/telegram/events',
    },
  },
  auth: {
    users: 'api/users/',
    user: 'api/users/auth/user/',
    login: 'api/users/auth/login/',
    logout: 'api/users/auth/logout/',
  },
  user: {
    update_info: 'api/users/update_profile/'
  },
  department: {
    postgraduate: 'api/department/postgraduate',
    news: {
      posts: 'api/department/news/posts/',
      announcements: 'api/department/news/announcements/',
      conferences: {
        all: 'api/department/news/conference-announcements',
        byID: (id: number | string) => `api/department/news/conference-announcements/${id}`
      },
    },
    achievements: {
      base: 'api/department/achievements/',
      retrieve: (id: string | number) => `api/department/achievements/${id}/`,
      redact: {
        all: 'api/department/achievements/achievement/',
        one: (id: string | number) =>
          `achievements/achievement/${id}/change/`,
      },
    },
    employee: {
      teacher: {
        info: 'api/department/employee/teachers/',
        uvp: 'api/department/employee/teachers/uvp/',
        schedule: {
          import: (id: number) =>
            `api/department/employee/teachers/${id}/schedule/import`,
          retrieve: (id: number) =>
            `api/department/employee/teachers/${id}/schedule`,
        },
        exam_schedule: {
          with_graduation: '/api/department/employee/teachers/with-graduation-exam-schedule/',
          with_non_graduation: '/api/department/employee/teachers/with-non-graduation-exam-schedule/',
        },
        publications: (name: string) => `/api/department/scientific_publications/get/${name}`,
        subject: {
          disciplines: (teacherId: number) => `api/department/employee/teachers/${teacherId}/subject`
        },
        achievements: (teacherId: number) => `api/department/achievements/teacher/${teacherId}/`,
      },
    },
  },
  teacher_user: {
    info: 'api/users/teacher_info/'
  },
  editableContentPage: 'api/editable-pages/',
  events: {
    read: 'api/users/events/',
    write: (id: number) => `api/users/events/${id}`,
  },
};
