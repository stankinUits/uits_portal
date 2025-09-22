import {Component, OnInit, OnDestroy, ChangeDetectorRef} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subscription, BehaviorSubject, Subject} from 'rxjs';
import {CalendarEvent} from 'angular-calendar';
import {startOfWeek} from 'date-fns';
import {EmployeeService} from '../../../about/employee/employee.service';
import {Schedule} from '@app/shared/types/models/schedule';

@Component({
  selector: 'app-schedule-summary',
  templateUrl: './schedule-summary.component.html',
  styleUrls: ['./schedule-summary.component.scss']
})

export class ScheduleSummaryComponent implements OnInit, OnDestroy {
  schedules$ = new BehaviorSubject<Schedule[]>([]); // Все расписания
  events$ = new BehaviorSubject<CalendarEvent[]>([]); // События для календаря
  filteredEvents$ = new BehaviorSubject<CalendarEvent[]>([]); // Фильтрованные события
  selectedTeacherIds: number[] = []; // Выбранные ID преподавателей
  error: string | null = null;
  viewDate: Date = startOfWeek(new Date(), {weekStartsOn: 1}); // Начало текущей недели
  subscription: Subscription | null = null;
  private destroy$ = new Subject<void>();
  schedule: BehaviorSubject<Schedule>;
  teachersForSelect: { id: number, fullName: string }[] = [];
  currentView: string = 'week'; // Устанавливаем вид по умолчанию
  teacherMap: { [id: number]: string } = {};
  uniqTeachersIds: number[];
  onlyOffline: boolean = false;

  constructor(private http: HttpClient, private employeeService: EmployeeService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.fetchSchedules();
    this.employeeService.getAllTeachers().subscribe(); // Загружаем список преподавателей
    this.onFilterChange()
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.destroy$.next();
      this.destroy$.complete();
    }
  }

  fetchSchedules(): void {
    this.http.get<any>('/api/department/employee/teachers/all-schedule').subscribe({
      next: (data) => {
        const schedules = data.map((teacherSchedule: any) => Schedule.fromResponse(teacherSchedule));
        this.schedules$.next(schedules); // Сохраняем все расписания
        this.uniqTeachersIds = Array.from(new Set(data.map((schedule: any) => schedule.teacher)));
        this.mapFill()
        this.updateCalendarEvents(schedules); // Обновляем события календаря
      },
      error: (err) => {
        this.error = 'Не удалось загрузить расписание.';
        console.error('Ошибка при загрузке расписания:', err);
      }
    });
  }

  mapFill(): void {
    this.employeeService.getAllTeachers().subscribe(teachers => {
      const filteredTeachers = teachers.filter(teacher => this.uniqTeachersIds.includes(teacher.id));

      this.teacherMap = filteredTeachers.reduce((map, teacher) => {
        map[teacher.id] = `${teacher.last_name} ${teacher.first_name[0]}. ${teacher.patronymic ? teacher.patronymic[0] + '.' : ''}`;
        return map;
      }, {});

      // Преобразуем мапу в массив для селектора
      this.teachersForSelect = filteredTeachers.map(teacher => ({
        id: teacher.id,
        fullName: this.teacherMap[teacher.id]
      }));

      this.cdr.detectChanges();
    });
  }

  updateCalendarEvents(schedules: Schedule[]): void {
    const events: CalendarEvent[] = [];
    schedules.forEach((schedule) => {
      events.push(...schedule.toCalendarEvents());
    });
    this.events$.next(events); // Обновляем все события
    this.filteredEvents$.next(events); // По умолчанию показываем все события
  }

  onFilterChange(): void {
    console.log(this.onlyOffline);
    const allSchedules = this.schedules$.value;

    const filtered = this.selectedTeacherIds.length === 0
      ? allSchedules
      : allSchedules.filter(s => this.selectedTeacherIds.includes(s.teacher));

    let events = filtered.flatMap(s => s.toCalendarEvents());

    if (this.onlyOffline) {
      events = events.filter(ev => (ev.meta?.cabinet != ""));
    }

    this.filteredEvents$.next(events);
  }

  onViewChange(view: string): void {
    this.currentView = view;
  }
}
