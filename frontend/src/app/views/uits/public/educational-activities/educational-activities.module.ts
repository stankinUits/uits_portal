import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EducationalActivitiesRoutingModule } from './educational-activities-routing.module';
import { BachelorEduPlansComponent } from './bachelor/bachelor-edu-plans/bachelor-edu-plans.component';
import { BachelorGraduateComponent } from './bachelor/bachelor-graduate/bachelor-graduate.component';
import { BachelorPracticesComponent } from './bachelor/bachelor-practices/bachelor-practices.component';
import { MasterEduPlansComponent } from './master/master-edu-plans/master-edu-plans.component';
import { MasterGraduateComponent } from './master/master-graduate/master-graduate.component';
import { MasterPracticesComponent } from './master/master-practices/master-practices.component';
import { ScheduleSummaryComponent } from './schedule/schedule-summary/schedule-summary.component';
import { LayoutModule } from '@app/layout/layout.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { DateFnsModule } from 'ngx-date-fns';
import { ModalModule } from 'ngx-bootstrap/modal';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import {
  CalendarModule,
  DateAdapter,
} from 'angular-calendar';
import { AboutModule } from '../about/about.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExamScheduleComponent } from './schedule/exam-schedule/exam-schedule.component';
import {SharedModule} from "@app/shared/shared.module";

@NgModule({
  declarations: [
    ScheduleSummaryComponent,
    BachelorEduPlansComponent,
    BachelorGraduateComponent,
    BachelorPracticesComponent,
    MasterEduPlansComponent,
    MasterGraduateComponent,
    MasterPracticesComponent,
    ExamScheduleComponent
  ],
  imports: [
    CommonModule,
    EducationalActivitiesRoutingModule,
    LayoutModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    NgSelectModule,
    DateFnsModule,
    ModalModule.forRoot(),
    AboutModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class EducationalActivitiesModule { }
