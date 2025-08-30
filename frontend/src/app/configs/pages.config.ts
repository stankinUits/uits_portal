const eduActivitiesPrefix = '/educational-activities';
const sciActivitiesPrefix = '/scientific-activities';

export const PagesConfig = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
  },
  home: '/home',
  about: {
    news: '/about/news/',
    announcements: '/about/announcements/',

    employee: {
      teachers: '/about/employee/teachers/',
      schedule: '/about/employee/teachers/schedule/',
    },
    contributors: '/contributors',
    partners: '/partners'
  },
  admin: '/admin',
  profile: '/corp/personal',
  educationalActivities: {
    bachelor: {
      eduPlans: eduActivitiesPrefix + '/bachelor/edu-plans',
      graduate: eduActivitiesPrefix + '/bachelor/graduate',
      practices: eduActivitiesPrefix + '/bachelor/practices',
    },
    master: {
      eduPlans: eduActivitiesPrefix + '/master/edu-plans',
      graduate: eduActivitiesPrefix + '/master/graduate',
      practices: eduActivitiesPrefix + '/master/practices',
    },
    schedule: {
      summary: eduActivitiesPrefix + '/schedule/schedule-summary',
      exams: eduActivitiesPrefix + '/schedule/schedule-exams'
    }
  },
  scientificActivities: {
    // postgraduate: {
    //   practices: sciActivitiesPrefix + '/postgraduate/practices',
    //   specialties: sciActivitiesPrefix + '/postgraduate/specialties',
    //   dissertations: sciActivitiesPrefix + '/postgraduate/dissertations',
    // },
    postgraduate: sciActivitiesPrefix + '/postgraduate',
    research: sciActivitiesPrefix + '/research',
    conferences: sciActivitiesPrefix + '/conferences',
    forum: sciActivitiesPrefix + '/forum',
    publications: sciActivitiesPrefix + '/publications',
    scientificWork: sciActivitiesPrefix + '/scientific-work',
    // Добавляем пути для новых компонентов
    mainSciencePage: sciActivitiesPrefix + '/publications/main-science-page',
    registerSciencePublication: sciActivitiesPrefix + '/publications/serp-api-search',
    editAuthorPublication: sciActivitiesPrefix + '/publications/edit-author-publication',
    achievements: sciActivitiesPrefix + '/achievements',
  },
  editable: (slug: string) => `/page/${slug}`
};
