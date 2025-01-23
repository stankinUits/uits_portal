import { ChangeDetectionStrategy, NgModule } from '@angular/core';
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
import { NgSelectModule } from '@ng-select/ng-select'; // Если нужно для фильтров
import { DateFnsModule } from 'ngx-date-fns'; // Для работы с датами
import { ModalModule } from 'ngx-bootstrap/modal'; // Модальные окна, если они используются
import {adapterFactory} from "angular-calendar/date-adapters/date-fns";
import {
  CalendarDateFormatter,
  CalendarModule,
  CalendarNativeDateFormatter,
  DateAdapter,
  DateFormatterParams
} from "angular-calendar";
import { AboutModule } from '../about/about.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExamScheduleComponent } from './schedule/exam-schedule/exam-schedule.component';

@NgModule({
  declarations: [
    ScheduleSummaryComponent, // Компонент для календаря
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
    NgSelectModule, // Если нужно для выбора
    DateFnsModule, // Для работы с датами
    ModalModule.forRoot(), // Если используются модальные окна
    AboutModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class EducationalActivitiesModule { }
