import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { AchievementService } from '../achievement.service';

import { AuthService } from '@app/shared/services/auth.service';
import { ApiConfig } from '@app/configs/api.config';


@Component({
  selector: 'app-achievement-detail',
  templateUrl: './achievement-detail.component.html',
  styleUrls: ['./achievement-detail.component.scss']
})
export class AchievementDetailComponent implements OnInit {
  achievement: any = null;
  errorMessage: string | null = null;
  isLoading: boolean = true;

  isAdmin: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private achievementService: AchievementService,

    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.checkAdminRights();


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

      this.isAdmin = canEdit;
      this.cdr.detectChanges();

    });
  }

  loadAchievement(id: string): void {
    this.achievementService.retrieveAchievement(id).subscribe({
      next: (data) => {
        this.achievement = data;
        this.isLoading = false;

        this.cdr.detectChanges();

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
      const adminUrl = ApiConfig.department.achievements.redact.one(this.achievement.id);

      window.open(adminUrl, '_blank');
    }
  }
}
