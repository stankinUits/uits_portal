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
  department: {
    postgraduate: 'api/department/postgraduate',
    news: {
      posts: 'api/department/news/posts/',
      announcements: 'api/department/news/announcements/',
    },
    achievements: {
      base: 'api/department/achievements/',
      retrieve: (id: string | number) => `api/department/achievements/${id}/`,
      redact: {
        all: 'api/admin/achievements/achievement/',
        one: (id: string | number) =>
          `api/admin/achievements/achievement/${id}/change/`,
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
        subject: {
          disciplines: (teacherId: number) => `api/department/employee/teachers/${teacherId}/subject`
        },
        achievements: (teacherId: number) => `api/department/achievements/teacher/${teacherId}/`,
      },
    },
  },
  editableContentPage: 'api/editable-pages/',
  events: {
    read: 'api/users/events/',
    write: (id: number) => `api/users/events/${id}`,
  },
};
