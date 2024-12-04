import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription, interval, BehaviorSubject } from 'rxjs';
import { CalendarEventMetaLesson, Schedule } from '@app/shared/types/models/schedule';
import { CalendarEvent } from 'angular-calendar';
import { startOfWeek } from 'date-fns'; // Для работы с датами

@Component({
  selector: 'app-schedule-summary',
  templateUrl: './schedule-summary.component.html',
  styleUrls: ['./schedule-summary.component.scss']
})
export class ScheduleSummaryComponent implements OnInit, OnDestroy {

  // Создаем BehaviorSubject для хранения расписания
  schedules$ = new BehaviorSubject<Schedule[]>([]); // поток расписания
  events$ = new BehaviorSubject<CalendarEvent<CalendarEventMetaLesson>[]>([]); // События как поток данных
  error: string | null = null;
  refreshInterval: number = 200000; // Интервал обновления в миллисекундах
  viewDate: Date = startOfWeek(new Date(), { weekStartsOn: 1 }); // Начало текущей недели
  subscription: Subscription | null = null; // Для управления подпиской на автообновление

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.startAutoRefresh(); // Запуск автообновления
    this.fetchSchedules(); // Первоначальная загрузка расписания
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // Автообновление данных
  startAutoRefresh(): void {
    this.subscription = interval(this.refreshInterval).subscribe(() => {
      console.log('Автообновление данных...');
      this.fetchSchedules();
    });
  }

  // Получение расписания преподавателей
  fetchSchedules(): void {
    this.http.get<any>('/api/department/employee/teachers/all-schedule')
      .subscribe({
        next: (data) => {
          console.log('Data received:', data);
          const schedules = data.map((teacherSchedule: any) => Schedule.fromResponse(teacherSchedule));
          this.schedules$.next(schedules); // Обновляем поток расписания
          this.updateCalendarEvents(schedules); // Обновляем события
        },
        error: (err) => {
          this.error = 'Не удалось загрузить расписание.';
          console.error('Ошибка при загрузке расписания:', err);
        }
      });
  }

  // Обновление событий календаря
  updateCalendarEvents(schedules: Schedule[]): void {
    const events: CalendarEvent<CalendarEventMetaLesson>[] = [];
    schedules.forEach((schedule: Schedule) => {
      events.push(...schedule.toCalendarEvents());
    });
    this.events$.next(events); // Обновляем поток событий
    console.log('Converted Calendar Events:', events);
  }

  // Обработка кликов по событиям
  onCalendarEventClick(event: any): void {
    console.log('Event clicked:', event);
  }
}
