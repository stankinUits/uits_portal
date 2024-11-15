import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewsComponent } from './news/news.component';
import { TeachersComponent } from './employee/teachers/teachers.component';
import { UVPComponent } from './employee/uvp/uvp.component';
import { FieldsOfStudyComponent } from './fields-of-study/fields-of-study.component';
import { DepartmentComponent } from './documents/department/department.component';
import { UniversityComponent } from './documents/university/university.component';
import { ContactsComponent } from './contacts/contacts.component';
import { PostComponent } from './news/post/post.component';
import { AnnouncementPostComponent } from './announcements/announcement-post/announcement-post.component';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { TeacherComponent } from './employee/teachers/teacher/teacher.component';
import { ScheduleComponent } from './employee/teachers/teacher/components/schedule/schedule.component';
import { DisciplinesComponent } from './employee/teachers/teacher/components/disciplines/disciplines.component';

const routes: Routes = [
  { path: 'news', component: NewsComponent },
  { path: 'news/:id', component: PostComponent },
  { path: 'announcements', component: AnnouncementsComponent },
  { path: 'announcements/:id', component: AnnouncementPostComponent },
  { path: 'employee/teachers', component: TeachersComponent },
  { path: 'employee/teachers/:id', component: TeacherComponent },
  { path: 'employee/teachers/schedule/:id', component: ScheduleComponent },
  { path: 'employee/teachers/schedule/:id/disciplines', component: DisciplinesComponent },
  { path: 'employee/uvp', component: UVPComponent },
  { path: 'fields-of-study', component: FieldsOfStudyComponent },
  { path: 'documents/department', component: DepartmentComponent },
  { path: 'documents/university', component: UniversityComponent },
  { path: 'contacts', component: ContactsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AboutRoutingModule { }
