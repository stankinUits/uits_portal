import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription, BehaviorSubject, interval, takeUntil, Subject, forkJoin, Observable } from 'rxjs';
import { CalendarEvent } from 'angular-calendar';
import { startOfWeek } from 'date-fns';
import { EmployeeService } from '../../../about/employee/employee.service';
import { Schedule } from '@app/shared/types/models/schedule';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { ScheduleComponent } from '../../../about/employee/teachers/teacher/components/schedule/schedule.component';
import {IEmployee} from "@app/shared/types/models/employee";
import { ApiConfig } from '@app/configs/api.config';
@Component({
  selector: 'app-schedule-summary',
  templateUrl: './schedule-summary.component.html',
  styleUrls: ['./schedule-summary.component.scss']
})
export class ScheduleSummaryComponent implements OnInit, OnDestroy {
  schedules$ = new BehaviorSubject<Schedule[]>([]); // Все расписания
  events$ = new BehaviorSubject<CalendarEvent[]>([]); // События для календаря
  filteredEvents$ = new BehaviorSubject<CalendarEvent[]>([]); // Фильтрованные события
  teachers$ = this.employeeService.teacher$; // Список преподавателей
  selectedTeacherIds: number[] = []; // Выбранные ID преподавателей
  teacher: IEmployee;
  error: string | null = null;
  refreshInterval: number = 200000; // Интервал обновления в миллисекундах
  viewDate: Date = startOfWeek(new Date(), { weekStartsOn: 1 }); // Начало текущей недели
  subscription: Subscription | null = null;
  private destroy$ = new Subject<void>();
  schedule: BehaviorSubject<Schedule>;
  teacher$: BehaviorSubject<IEmployee>;
  teachersForSelect: { id: number, fullName: string }[] = [];
  selectedEvent: CalendarEvent | null = null; // Хранит выбранное событие
  popupPosition = { top: '0px', left: '0px' }; // Позиция всплывающего окна
  currentView: string = 'week'; // Устанавливаем вид по умолчанию

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.fetchSchedules();
    this.employeeService.getAllTeachers().subscribe(); // Загружаем список преподавателей
    this.onFilterChange()
    this.mapFill()
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.destroy$.next();
      this.destroy$.complete();
    }
  }

  retrieveTeacher(id: number): Observable<IEmployee> {
    return this.http.get<IEmployee>(`${ApiConfig.department.employee.teacher.info}${id}`);
  }

  get shortName() {
    const teacher = this.teacher$.getValue();

    return `${teacher.last_name} ${teacher.first_name[0]}. ${teacher.patronymic ? teacher.patronymic[0] + '.' : ''}`
  }
  
  startAutoRefresh(): void {
    this.subscription = interval(this.refreshInterval).subscribe(() => {
      console.log('Автообновление данных...');
      this.fetchSchedules();
    });
  }

  fetchSchedules(): void {
    this.http.get<any>('/api/department/employee/teachers/all-schedule').subscribe({
      next: (data) => {
        const schedules = data.map((teacherSchedule: any) => Schedule.fromResponse(teacherSchedule));
        this.schedules$.next(schedules); // Сохраняем все расписания
        this.updateCalendarEvents(schedules); // Обновляем события календаря
      },
      error: (err) => {
        this.error = 'Не удалось загрузить расписание.';
        console.error('Ошибка при загрузке расписания:', err);
      }
    });
  }

  teacherMap: { [id: number]: string } = {};

  mapFill(): void {
    this.http.get<any>('/api/department/employee/teachers/all-schedule').subscribe({
      next: (data) => {
        const uniqueTeacherIds = Array.from(new Set(data.map((schedule: any) => schedule.teacher)));
        this.employeeService.getAllTeachers().subscribe(teachers => {
          const filteredTeachers = teachers.filter(teacher => uniqueTeacherIds.includes(teacher.id));
  
          this.teacherMap = filteredTeachers.reduce((map, teacher) => {
            map[teacher.id] = `${teacher.last_name} ${teacher.first_name[0]}. ${teacher.patronymic ? teacher.patronymic[0] + '.' : ''}`;
            return map;
          }, {});
  
          // Преобразуем мапу в массив для селектора
          this.teachersForSelect = filteredTeachers.map(teacher => ({
            id: teacher.id,
            fullName: this.teacherMap[teacher.id]
          }));
        });
      },
      error: (err) => {
        console.error('Ошибка при загрузке расписаний:', err);
      }
    });
  }

  updateCalendarEvents(schedules: Schedule[]): void {
    const events: CalendarEvent[] = [];
    schedules.forEach((schedule) => {
      events.push(...schedule.toCalendarEvents());
      //console.log('schedule', schedule);
    });
    this.events$.next(events); // Обновляем все события
    this.filteredEvents$.next(events); // По умолчанию показываем все события
    console.log('updatedCalendarEvents', events);
  }

  refreshSchedule(teacherId: number): void {
    this.employeeService.retrieveSchedule(teacherId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(schedule => {
        console.log('refresh schedule', schedule);
        this.schedule.next(schedule); // Записываем данные расписания в поток
      });
  }

  onFilterChange(): void {
    if (this.selectedTeacherIds.length === 0) {
      this.updateCalendarEvents(this.schedules$.value);
     // console.log('Все расписания добавлены', this.schedules$.value);
    } else {
      const requests = this.selectedTeacherIds.map((teacherId) => {
        return this.employeeService.retrieveSchedule(teacherId);
      });
  
      forkJoin(requests).subscribe({
        next: (schedules) => {
          const events: CalendarEvent[] = [];
          schedules.forEach((schedule) => {
            events.push(...schedule.toCalendarEvents());
            //console.log('Добавлено расписание', schedule);
          });
  
          // После того как все данные загружены и обработаны, обновляем события
          this.events$.next(events);
          this.filteredEvents$.next(events);
          console.log('Обновленные события', events);
        },
        error: (err) => {
          console.error('Ошибка при загрузке расписаний:', err);
        }
      });
    }
  }




onCalendarEventClick({ event, sourceEvent }: { event: CalendarEvent, sourceEvent: MouseEvent }): void {
  this.selectedEvent = event;

  // Определяем позицию всплывающего окна
  this.popupPosition = {
    top: `${sourceEvent.clientY}px`,
    left: `${sourceEvent.clientX}px`
  };
}


onViewChange(view: string): void {
  this.currentView = view;
  //console.log(view)
}


}
