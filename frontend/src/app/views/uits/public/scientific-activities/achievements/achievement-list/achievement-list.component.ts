import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { AchievementService } from '../achievement.service';
import { AuthService } from '@app/shared/services/auth.service'; // Импорт AuthService
import { Router } from '@angular/router';

@Component({
  selector: 'app-achievement-list',
  templateUrl: './achievement-list.component.html',
  styleUrls: ['./achievement-list.component.scss'],
})
export class AchievementListComponent implements OnInit {
  achievements: any[] = [];
  isLoading = true; // Индикатор загрузки
  errorMessage: string | null = null; // Сообщение об ошибке
  isAdmin = false; // Флаг для проверки прав администратора

  constructor(
    private achievementService: AchievementService,
    private authService: AuthService, // Внедрение AuthService
    private router: Router,
    private cdr: ChangeDetectorRef // ChangeDetectorRef для ручного обновления
  ) {}

  ngOnInit(): void {
    this.checkAdminRights(); // Проверка прав администратора
    this.fetchAchievements();
  }

  checkAdminRights(): void {
    this.authService.canEdit().subscribe((canEdit: boolean) => {
      this.isAdmin = canEdit; // Обновляем флаг
      this.cdr.detectChanges(); // Обновляем представление вручную
    });
  }

  fetchAchievements(): void {
    this.achievementService.getAchievements().subscribe({
      next: (data) => {
        this.achievements = data.results;
        this.isLoading = false;
        this.cdr.detectChanges(); // Обновить изменения
      },
      error: (error) => {
        this.errorMessage = error;
        this.isLoading = false;
        this.cdr.detectChanges(); // Обновить изменения
      },
    });
  }

  reloadPage(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.fetchAchievements();
  }

  onSelectAchievement(achievement: any): void {
    this.router.navigate([
      '/scientific-activities/achievements',
      achievement.id,
    ]);
  }

redirectToAdminPanel(): void {
    window.open('http://127.0.0.1:8000/admin/achievements/achievement/', '_blank');
}
}
