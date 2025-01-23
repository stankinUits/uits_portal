import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NewsComponent} from './news/news.component';
import {TeachersComponent} from './employee/teachers/teachers.component';
import {UVPComponent} from './employee/uvp/uvp.component';
import {FieldsOfStudyComponent} from './fields-of-study/fields-of-study.component';
import {DepartmentComponent} from './documents/department/department.component';
import {UniversityComponent} from './documents/university/university.component';
import {ContactsComponent} from './contacts/contacts.component';
import {PostComponent} from './news/post/post.component';
import {AnnouncementPostComponent} from './announcements/announcement-post/announcement-post.component';
import {AnnouncementsComponent} from './announcements/announcements.component';
import {TeacherComponent} from './employee/teachers/teacher/teacher.component';
import {ScheduleComponent} from './employee/teachers/teacher/components/schedule/schedule.component';
import {DisciplinesComponent} from './employee/teachers/teacher/components/disciplines/disciplines.component';
import {
  HistoryOfDepartmentComponent
} from '@app/views/uits/public/about/history-of-department/history-of-department.component';
import {ContributorsComponent} from '@app/views/uits/public/about/contributors/contributors.component';
import {CustomPageComponent} from '@app/views/uits/public/custom-page/custom-page.component';
import {
  ManagementComponent
} from '@app/views/uits/public/about/employee/teachers/teacher/components/management/management.component';
import {
  GeneralComponent
} from '@app/views/uits/public/about/employee/teachers/teacher/components/general/general.component';
import {
  PublicationsTeacherComponent
} from '@app/views/uits/public/about/employee/teachers/teacher/components/publications/publications-teacher.component';
import {
  AchievementsTeacherComponent
} from '@app/views/uits/public/about/employee/teachers/teacher/components/achievements/achievements-teacher.component';

const routes: Routes = [
  {path: 'news', component: NewsComponent},
  {path: 'news/:id', component: PostComponent},
  {path: 'announcements', component: AnnouncementsComponent},
  {path: 'announcements/:id', component: AnnouncementPostComponent},
  {path: 'employee/teachers', component: TeachersComponent},
  {
    path: 'employee/teachers/:id',
    component: TeacherComponent,
    children: [
      {path: '', redirectTo: 'general', pathMatch: 'full'},
      {path: 'general', component: GeneralComponent},
      {path: 'schedule', component: ScheduleComponent},
      {path: 'disciplines', component: DisciplinesComponent},
      {path: 'management', component: ManagementComponent},
      {path: 'publications', component: PublicationsTeacherComponent},
      {path: 'achievements', component: AchievementsTeacherComponent},
    ]
  },
  {path: 'employee/uvp', component: UVPComponent},
  {path: 'fields-of-study', component: FieldsOfStudyComponent},
  {path: 'documents/department', component: DepartmentComponent},
  {path: 'documents/university', component: UniversityComponent},
  {path: 'contacts', component: ContactsComponent},
  {path: 'history-of-department', component: HistoryOfDepartmentComponent},
  {path: 'contributors', component: ContributorsComponent},
  // {
  //   path: 'page/:slug',
  //   component: CustomPageComponent
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AboutRoutingModule {
}
