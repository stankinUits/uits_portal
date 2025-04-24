import {NavMenu} from '@app/shared/types/nav-menu.interface';
import {PagesConfig} from '@app/configs/pages.config';

const main: NavMenu[] = [
  {
    path: '/home',
    title: 'Main',
    translateKey: 'NAV.HOME',
    type: 'item',
    iconType: 'feather',
    icon: 'icon-home',
    key: 'main',
    submenu: []
  },
];

const about: NavMenu[] = [
  {
    path: '/about',
    title: 'About',
    translateKey: 'NAV.ABOUT',
    type: 'title',
    iconType: 'feather',
    icon: 'icon-info',
    key: 'about',
    submenu: [
      {
        path: 'about/history-of-department',
        title: 'History',
        translateKey: 'NAV.HISTORY',
        type: 'item',
        iconType: 'line-awesome',
        icon: 'la-comment',
        key: 'about/history-of-department',
        submenu: []
      },
      {
        path: 'about/news',
        title: 'News',
        translateKey: 'NAV.NEWS',
        type: 'item',
        iconType: 'line-awesome',
        icon: 'la-newspaper',
        key: 'about/news',
        submenu: []
      },
      {
        path: 'about/announcements',
        title: 'Announcements',
        translateKey: 'NAV.ANNOUNCEMENTS',
        type: 'item',
        iconType: 'line-awesome',
        icon: 'la la-bullhorn',
        key: 'about/announcements',
        submenu: []
      },
      {
        path: 'about/employee',
        title: 'Employee',
        translateKey: 'NAV.EMPLOYEE',
        type: 'item',
        iconType: 'feather',
        icon: 'icon-users',
        key: 'about/employee',
        submenu: [
          {
            path: 'about/employee/teachers',
            title: 'Teachers',
            translateKey: 'NAV.TEACHERS',
            type: 'item',
            iconType: 'feather',
            icon: 'icon-user',
            key: 'about/employee/teachers',
            submenu: []
          },
          {
            path: 'about/employee/uvp',
            title: 'Uvp',
            translateKey: 'NAV.UVP',
            type: 'item',
            iconType: 'feather',
            icon: 'icon-user',
            key: 'about/employee/uvp',
            submenu: []
          }
        ]
      },
      {
        path: 'about/fields-of-study',
        title: 'FieldsOfStudy',
        translateKey: 'NAV.FIELD_OF_STUDY',
        type: 'item',
        iconType: 'feather',
        icon: 'icon-list',
        key: 'about/fieldsOfStudy',
        submenu: []
      },
      {
        path: 'about/documents',
        title: 'Documents',
        translateKey: 'NAV.DOCUMENTS.TITLE',
        type: 'item',
        iconType: 'feather',
        icon: 'icon-folder',
        key: 'about/documents',
        submenu: [
          {
            path: 'about/documents/department',
            title: 'DepartmentDocuments',
            translateKey: 'NAV.DOCUMENTS.DEPARTMENT',
            type: 'item',
            iconType: 'feather',
            icon: 'icon-file-text',
            key: 'about/documents/departmentDocuments',
            submenu: []
          },
          {
            path: 'about/documents/university',
            title: 'University',
            translateKey: 'NAV.DOCUMENTS.UNIVERSITY',
            type: 'item',
            iconType: 'feather',
            icon: 'icon-file-text',
            key: 'about/documents/university',
            submenu: []
          },
        ]
      },
      {
        path: 'about/contacts',
        title: 'Contacts',
        translateKey: 'NAV.CONTACTS',
        type: 'item',
        iconType: 'feather',
        icon: 'icon-phone',
        key: 'about/contacts',
        submenu: []
      },
      {
        // path: PagesConfig.editable('contributors'),
        path: 'about/contributors',
        title: 'Contributors',
        translateKey: 'NAV.CONTRIBUTORS',
        type: 'item',
        iconType: 'feather',
        icon: 'icon-star',
        key: 'about/contributors',
        submenu: []
      }
    ]
  }
];

const educationActivities: NavMenu[] = [
  {
    path: '/educational-activities',
    title: 'EducationActivities',
    translateKey: 'NAV.EDUCATION_ACTIVITIES.TITLE',
    type: 'title',
    iconType: 'feather',
    icon: 'icon-book',
    key: 'educationActivities',
    submenu: [
      {
        path: '/bachelor',
        title: 'Bachelor',
        translateKey: 'NAV.EDUCATION_ACTIVITIES.BACHELOR.TITLE',
        type: 'item',
        iconType: 'line-awesome',
        icon: 'la la-school',
        key: 'bachelor',
        submenu: [
          {
            path: PagesConfig.educationalActivities.bachelor.eduPlans,
            title: 'StudyPlan',
            translateKey: 'NAV.EDUCATION_ACTIVITIES.BACHELOR.STUDY_PLAN',
            type: 'item',
            iconType: 'line-awesome',
            icon: 'la la-clipboard-list',
            key: 'studyPlan',
            submenu: []
          },
          {
            path: PagesConfig.educationalActivities.bachelor.graduate,
            title: 'Graduation',
            translateKey: 'NAV.EDUCATION_ACTIVITIES.BACHELOR.GRADUATION.TITLE',
            type: 'item',
            iconType: 'line-awesome',
            icon: 'la la-graduation-cap',
            key: 'graduation',
            submenu: []
          },
          {
            path: PagesConfig.educationalActivities.bachelor.practices,
            title: 'Practices',
            translateKey: 'NAV.EDUCATION_ACTIVITIES.BACHELOR.PRACTICES.TITLE',
            type: 'item',
            iconType: 'line-awesome',
            icon: 'la la-file-code',
            key: 'practices',
            submenu: []
          }
        ],
      },
      {
        path: '/master',
        title: 'Magistracy',
        translateKey: 'NAV.EDUCATION_ACTIVITIES.MAGISTRACY.TITLE',
        type: 'item',
        iconType: 'line-awesome',
        icon: 'la la-landmark',
        key: 'magistracy',
        submenu: [
          {
            path: PagesConfig.educationalActivities.master.eduPlans,
            title: 'StudyPlan',
            translateKey: 'NAV.EDUCATION_ACTIVITIES.BACHELOR.STUDY_PLAN',
            type: 'item',
            iconType: 'line-awesome',
            icon: 'la la-clipboard-list',
            key: 'studyPlan',
            submenu: []
          },
          {
            path: PagesConfig.educationalActivities.master.graduate,
            title: 'Graduation',
            translateKey: 'NAV.EDUCATION_ACTIVITIES.BACHELOR.GRADUATION.TITLE',
            type: 'item',
            iconType: 'line-awesome',
            icon: 'la la-graduation-cap',
            key: 'graduation',
            submenu: []
          },
          {
            path: PagesConfig.educationalActivities.master.practices,
            title: 'Practices',
            translateKey: 'NAV.EDUCATION_ACTIVITIES.BACHELOR.PRACTICES.TITLE',
            type: 'item',
            iconType: 'line-awesome',
            icon: 'la la-file-code',
            key: 'practices',
            submenu: []
          }
        ]
      },
      {
        path: '/schedule',
        title: 'Schedule',
        translateKey: 'NAV.EDUCATION_ACTIVITIES.SCHEDULES.TITLE',
        type: 'item',
        iconType: 'feather',
        icon: 'icon-calendar',
        key: 'schedule',
        submenu: [
          {
            path: PagesConfig.educationalActivities.schedule.summary,
            title: 'Summary',
            translateKey: 'NAV.EDUCATION_ACTIVITIES.SCHEDULES.SUMMARY.TITLE',
            type: 'item',
            iconType: 'feather',
            icon: 'icon-list',
            key: 'summary',
            submenu: []
          },
          {
            path: PagesConfig.educationalActivities.schedule.exams,
            title: 'ExamsSchedule',
            translateKey: 'NAV.EDUCATION_ACTIVITIES.SCHEDULES.EXAMS.TITLE',
            type: 'item',
            iconType: 'feather',
            icon: 'icon-clipboard',
            key: 'examsSchedule',
            submenu: []
          }
        ]
      }
    ]
  }
];
const scientificActivity: NavMenu[] = [
  {
    path: '/scientificActivity',
    title: 'ScientificActivity',
    translateKey: 'NAV.SCIENTIFIC_ACTIVITY.TITLE',
    type: 'title',
    iconType: 'line-awesome',
    icon: 'la-superscript',
    key: 'scientificActivity',
    submenu: [
      // {
      //   path: PagesConfig.scientificActivities.research,
      //   title: 'ScientificActivity/Research',
      //   translateKey: 'NAV.SCIENTIFIC_ACTIVITY.RESEARCH',
      //   type: 'item',
      //   iconType: 'line-awesome',
      //   icon: 'la-flask',
      //   key: 'scientificActivity/research',
      //   submenu: []
      // },
      {
        path: PagesConfig.scientificActivities.postgraduate,
        title: 'ScientificActivity/PostGraduate',
        translateKey: 'NAV.SCIENTIFIC_ACTIVITY.POST_GRADUATE.TITLE',
        type: 'item',
        iconType: 'line-awesome',
        icon: 'la la-user-graduate',
        key: 'scientificActivity/postGraduate',
        submenu: []
      },
      {
        path: PagesConfig.scientificActivities.mainSciencePage,
        title: 'SciencePublications',
        translateKey: 'NAV.SCIENTIFIC_ACTIVITY.SCIENTIFIC_PUBLICATIONS.TITLE',
        type: 'item',
        iconType: 'line-awesome',
        icon: 'la la-book',
        key: 'sciencePublications',
        submenu: []
      },
      {
        path: PagesConfig.scientificActivities.achievements,
        title: 'Achievements',
        translateKey: 'NAV.SCIENTIFIC_ACTIVITY.ACHIEVEMENTS.TITLE',
        type: 'item',
        iconType: 'line-awesome',
        icon: 'la la-award',
        key: 'scientificActivity/achievements',
        submenu: []
      },
      {
        path: PagesConfig.scientificActivities.conferences,
        title: 'Conferences',
        translateKey: 'NAV.SCIENTIFIC_ACTIVITY.CONFERENCES',
        type: 'item',
        iconType: 'feather',
        icon: 'icon-mic',
        key: 'scientificActivity/conferences',
        submenu: []
      },
      // {
      //   path: PagesConfig.scientificActivities.forum,
      //   title: 'Forum',
      //   translateKey: 'NAV.SCIENTIFIC_ACTIVITY.FORUM',
      //   type: 'item',
      //   iconType: 'line-awesome',
      //   icon: 'la la-users',
      //   key: 'scientificActivity/forum',
      //   submenu: []
      // }
    ]
  }
];


export const navConfiguration: NavMenu[] = [
  ...main,
  ...about,
  ...educationActivities,
  ...scientificActivity,
];
