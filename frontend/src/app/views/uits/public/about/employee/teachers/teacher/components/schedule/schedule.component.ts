import {Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {IEmployee} from '@app/shared/types/models/employee';
import {CalendarEvent} from 'angular-calendar';
import {EmployeeService} from '@app/views/uits/public/about/employee/employee.service';
import {BehaviorSubject, Subject, takeUntil} from 'rxjs';
import {CalendarEventMetaLesson, Schedule} from '@app/shared/types/models/schedule';
import {AuthService} from '@app/shared/services/auth.service';
import {AlertService} from '@app/shared/services/alert.service';
import {PagesConfig} from '@app/configs/pages.config';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit, OnDestroy {
  @ViewChild('confirmImportSchedule') confirmImportSchedule: TemplateRef<any>;
  @ViewChild('confirmRedirectToEditScheduleLesson') confirmRedirectToEditScheduleLesson: TemplateRef<any>;

  teacherID: number;
  selectedScheduleFile: File = null;
  schedule: BehaviorSubject<Schedule>;
  viewDate: Date;
  modalRef: BsModalRef;
  chosenEditLessonId: number = null;

  private destroy$ = new Subject<void>();

  constructor(private employeeService: EmployeeService,
              private authService: AuthService,
              private route: ActivatedRoute,
              private alertService: AlertService,
              private modalService: BsModalService) {
    this.schedule = new BehaviorSubject<Schedule>(null);
    this.setViewDate();
  }

  get profile() {
    return this.authService.profile$;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe(params => {
      this.teacherID = +params.get('id')!;
      this.refreshSchedule();
    });
  }

  refreshSchedule() {
    this.employeeService.retrieveSchedule(this.teacherID)
      .pipe(takeUntil(this.destroy$)).subscribe(schedule => {
      console.log(schedule);
      this.schedule.next(schedule);
    });
  }

  setViewDate() {
    this.viewDate = new Date();
  }

  getEvents(): CalendarEvent<CalendarEventMetaLesson>[] {
    const schedule = this.schedule.getValue();
    if (!schedule) {
      return [];
    }

    const events = schedule.toCalendarEvents();
    console.log('CalendarEvents', events);
    return events;
  }

  onScheduleFileSelected($event: Event) {
    // @ts-ignore
    this.selectedScheduleFile = <File>$event.target.files[0];
    console.log(this.selectedScheduleFile);


    this.openModal(this.confirmImportSchedule);
    // $event.target.clear()
  }

  importScheduleFromSelectedFile() {
    if (this.modalRef) {
      this.modalRef.hide();
    }
    this.employeeService.importSchedule(this.teacherID, this.selectedScheduleFile)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: response => {
          console.log(response);
          this.alertService.add('Расписание успешно импортировано');
          this.refreshSchedule();
        },
        error: error => {
          console.log(error);
          this.alertService.add('Ошибка. Возможно неверный формат файла.', 'danger');
        }
      });
  }

  cancelImportSchedule() {
    this.modalRef.hide();
    this.selectedScheduleFile = null;
  }

  navigateToScheduleEdit() {
    if (this.schedule.getValue()) {
      window.open(`${PagesConfig.admin}/schedule/schedulelesson/?schedule__teacher__id__exact=${this.teacherID}`);
    } else {
      window.open();
    }
  }

  openModal(template) {
    this.modalRef = this.modalService.show(template);
  }

  onCalendarEventClick($event: { event: CalendarEvent<CalendarEventMetaLesson>; sourceEvent: any }) {
    console.log('clicked', $event);
    this.chosenEditLessonId = $event.event.meta.id;
    this.authService.canEdit().pipe(
      takeUntil(this.destroy$)
    ).subscribe(
      ok => {
        console.log('ok??', ok);
        if (ok) {
          this.openModal(this.confirmRedirectToEditScheduleLesson);
        }
      },
    );
  }

  onConfirmRedirectToEditScheduleLesson() {
    window.open(`${PagesConfig.admin}/schedule/schedulelesson/${this.chosenEditLessonId}/change/`);
    this.modalRef.hide();
  }

  cancelRedirectToEditScheduleLesson() {
    this.chosenEditLessonId = null;
    this.modalRef.hide();
  }
}
