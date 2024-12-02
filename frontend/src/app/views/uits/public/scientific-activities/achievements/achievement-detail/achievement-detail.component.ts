import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { AchievementService } from '../achievement.service';
import { AuthService } from '@app/shared/services/auth.service'; // Импорт AuthService

@Component({
  selector: 'app-achievement-detail',
  templateUrl: './achievement-detail.component.html',
  styleUrls: ['./achievement-detail.component.scss']
})
export class AchievementDetailComponent implements OnInit {
  achievement: any = null;
  errorMessage: string | null = null;
  isLoading: boolean = true;
  isAdmin: boolean = false; // Флаг для проверки прав администратора

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private achievementService: AchievementService,
    private authService: AuthService, // Внедрение AuthService
    private cdr: ChangeDetectorRef // Для ручного обновления
  ) { }

  ngOnInit(): void {
    this.checkAdminRights(); // Проверка прав администратора

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadAchievement(id);
    } else {
      this.errorMessage = 'ID достижения не найден';
      this.isLoading = false;
    }
  }

  checkAdminRights(): void {
    this.authService.canEdit().subscribe((canEdit: boolean) => {
      this.isAdmin = canEdit; // Обновляем флаг
      this.cdr.detectChanges(); // Обновляем представление вручную
    });
  }

  loadAchievement(id: string): void {
    this.achievementService.getAchievementById(id).subscribe({
      next: (data) => {
        this.achievement = data;
        this.isLoading = false;
        this.cdr.detectChanges(); // Ручное обновление
      },
      error: (err) => {
        console.error('Ошибка загрузки данных:', err);
        this.errorMessage = 'Ошибка загрузки данных достижения';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/scientific-activities/achievements']);
  }
  
  redirectToEditPage(): void {
    if (this.achievement?.id) {
      const adminUrl = `http://127.0.0.1:8000/admin/achievements/achievement/${this.achievement.id}/change/`;
      window.open(adminUrl, '_blank');
    }
  }
}
