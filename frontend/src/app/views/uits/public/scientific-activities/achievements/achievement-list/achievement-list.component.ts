import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AchievementService } from '../achievement.service';

@Component({
  selector: 'app-achievement-list',
  templateUrl: './achievement-list.component.html',
  styleUrls: ['./achievement-list.component.scss'],
})
export class AchievementListComponent implements OnInit {
  achievements: any[] = [];
  isLoading = true; // Индикатор загрузки
  errorMessage: string | null = null; // Сообщение об ошибке

  constructor(
    private achievementService: AchievementService,
    private router: Router,
    private cdr: ChangeDetectorRef // Добавлено ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchAchievements();
  }

  fetchAchievements() {
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

  reloadPage() {
    this.isLoading = true;
    this.errorMessage = null;
    this.fetchAchievements();
  }

  onSelectAchievement(achievement: any) {
    this.router.navigate([
      '/scientific-activities/achievements',
      achievement.id,
    ]);
  }
}
