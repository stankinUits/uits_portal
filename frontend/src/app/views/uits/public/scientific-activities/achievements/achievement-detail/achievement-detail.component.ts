import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { AchievementService } from '../achievement.service';

@Component({
  selector: 'app-achievement-detail',
  templateUrl: './achievement-detail.component.html',
  styleUrls: ['./achievement-detail.component.scss']
})
export class AchievementDetailComponent implements OnInit {
  achievement: any = null;
  errorMessage: string | null = null;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private achievementService: AchievementService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadAchievement(id);
    } else {
      this.errorMessage = 'ID достижения не найден';
    }
  }

  loadAchievement(id: string): void {
    this.achievementService.getAchievementById(id).subscribe({
      next: (data) => {
        this.achievement = data;
        this.isLoading = false;
        this.cdr.detectChanges(); // Trigger change detection manually
      },
      error: (err) => {
        console.error('Ошибка загрузки данных:', err);
        this.errorMessage = 'Ошибка загрузки данных достижения';
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/scientific-activities/achievements']);
  }
}
