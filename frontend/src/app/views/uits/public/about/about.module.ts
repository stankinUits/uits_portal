import {NgModule} from '@angular/core';
import {CommonModule, formatDate, NgOptimizedImage} from '@angular/common';

import {AboutRoutingModule} from './about-routing.module';
import {NewsComponent} from '@app/views/uits/public/about/news/news.component';
import {FieldsOfStudyComponent} from '@app/views/uits/public/about/fields-of-study/fields-of-study.component';
import {TeachersComponent} from '@app/views/uits/public/about/employee/teachers/teachers.component';
import {UVPComponent} from '@app/views/uits/public/about/employee/uvp/uvp.component';
import {DepartmentComponent} from '@app/views/uits/public/about/documents/department/department.component';
import {UniversityComponent} from '@app/views/uits/public/about/documents/university/university.component';
import {ContactsComponent} from '@app/views/uits/public/about/contacts/contacts.component';
import {QuillConfigModule, QuillEditorComponent, QuillViewComponent} from 'ngx-quill';
import {ModalModule} from 'ngx-bootstrap/modal';
import {modules} from '@app/configs/quill.config';
import {SharedModule} from '@app/shared/shared.module';
import {NgBootstrapFormValidationModule} from 'ng-bootstrap-form-validation';
import {CrudActionModule} from '@app/shared/components/crud-action/crud-action.module';
import {PostComponent} from './news/post/post.component';
import {DateFnsModule} from 'ngx-date-fns';
import {AnnouncementsComponent} from './announcements/announcements.component';
import {AnnouncementPostComponent} from './announcements/announcement-post/announcement-post.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {TeacherComponent} from './employee/teachers/teacher/teacher.component';
import {
  CalendarDateFormatter,
  CalendarModule,
  CalendarNativeDateFormatter,
  DateAdapter,
  DateFormatterParams
} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import {ScheduleComponent} from './employee/teachers/teacher/components/schedule/schedule.component';
import {registerLocaleData} from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import {AngularMarkdownEditorModule} from 'angular-markdown-editor';
import {MarkdownModule} from 'ngx-markdown';
import {LayoutModule} from '@app/layout/layout.module';
import {CreateButtonComponent} from '@app/shared/components/create-button/create-button.component';
import {EditButtonComponent} from '@app/shared/components/edit-button/edit-button.component';
import {PaginationModule} from 'ngx-bootstrap/pagination';
import {DisciplinesComponent} from './employee/teachers/teacher/components/disciplines/disciplines.component';
import {
  HistoryOfDepartmentComponent
} from '@app/views/uits/public/about/history-of-department/history-of-department.component';
import {ContributorsComponent} from './contributors/contributors.component';
import { GeneralComponent } from './employee/teachers/teacher/components/general/general.component';
import { ManagementComponent } from './employee/teachers/teacher/components/management/management.component';
import { PublicationsTeacherComponent } from './employee/teachers/teacher/components/publications/publications-teacher.component';
import { AchievementsTeacherComponent } from './employee/teachers/teacher/components/achievements/achievements-teacher.component';
import { DetailsModalComponent } from './employee/teachers/teacher/components/disciplines/details-modal/details-modal.component';
import {DeleteButtonComponent} from "@app/shared/components/delete-button/delete-button.component";
import {PaginationComponent} from "@app/shared/components/pagination/pagination.component";
import {
  ProfileCardComponent
} from "@app/views/uits/public/scientific-publications/common-ui/profile-card/profile-card.component";
import { PartnersComponent } from './partners/partners.component';

registerLocaleData(localeRu);


class CustomDateFormatter extends CalendarNativeDateFormatter {

  public dayViewHour({date, locale}: DateFormatterParams): string {
    // change this to return a different date format
    // return new Intl.DateTimeFormat(locale).format(date);
    return formatDate(date, 'HH:mm', locale);
  }

  public weekViewHour({date, locale}: DateFormatterParams): string {
    return this.dayViewHour({date, locale});
  }

}

@NgModule({
  declarations: [
    ContactsComponent,
    DepartmentComponent,
    UniversityComponent,
    NewsComponent,
    FieldsOfStudyComponent,
    TeachersComponent,
    UVPComponent,
    PostComponent,
    AnnouncementsComponent,
    AnnouncementPostComponent,
    TeacherComponent,
    ScheduleComponent,
    DisciplinesComponent,
    HistoryOfDepartmentComponent,
    ContributorsComponent,
    GeneralComponent,
    ManagementComponent,
    PublicationsTeacherComponent,
    AchievementsTeacherComponent,
    DetailsModalComponent,
    PartnersComponent
  ],
  exports: [
    NewsComponent,
  ],
  imports: [
    CommonModule,
    AboutRoutingModule,
    QuillViewComponent,
    ModalModule,
    QuillEditorComponent,
    QuillConfigModule.forRoot({
      modules
    }),
    SharedModule,
    NgBootstrapFormValidationModule,
    CrudActionModule,
    DateFnsModule,
    NgSelectModule,
    NgOptimizedImage,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    AngularMarkdownEditorModule.forRoot({iconlibrary: 'fa'}),
    MarkdownModule.forRoot(),
    LayoutModule,
    CreateButtonComponent,
    EditButtonComponent,
    DeleteButtonComponent,
    PaginationModule,
    PaginationComponent,
    ProfileCardComponent,
  ],
  providers: [
    {provide: CalendarDateFormatter, useClass: CustomDateFormatter}
  ]
})
export class AboutModule {
}
