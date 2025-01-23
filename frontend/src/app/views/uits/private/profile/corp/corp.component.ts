import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/shared/services/auth.service';
import { Permission } from '@app/shared/types/permission.enum';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { getUserPermissions } from '@app/shared/types/models/auth';

interface CorporateMenu {
  title: string;
  route: string;
  icon?: string;
  key?: string;
}

@Component({
  selector: 'corp',
  templateUrl: './corp.component.html',
  styleUrls: ['./corp.component.css'],
})
export class CorporateComponent implements OnInit {
  corporateMenu: CorporateMenu[] = [];
  isTeacher = false;
  isMobile = false;
  isMobilePanelOpen = false;
  currentPanel = 'default';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.profile$.pipe(
      map(profile => {
        const userPermissions = getUserPermissions(profile);
        if (userPermissions.includes(Permission.MODERATOR)) {
          this.corporateMenu = [
            { title: 'Профиль', route: 'personal', icon: 'feather icon-user', key: 'Аккаунт' },
            { title: 'Модульные журналы', route: '/modular_journals', icon: 'feather icon-book', key: 'Журнал' },
            { title: 'Статистика модульных журналов', route: 'statistics', icon: 'feather icon-loader', key: 'Статистика' },
            { title: 'Календарь событий', route: 'calendar', icon: 'feather icon-calendar', key: 'Календарь событий' },
          ];
        } else if (userPermissions.includes(Permission.TEACHER) || userPermissions.includes(Permission.SUPERUSER)) {
          this.isTeacher = true;
          this.corporateMenu = [
            { title: 'Профиль', route: 'personal', icon: 'feather icon-user', key: 'Аккаунт' },
            { title: 'Публикации', route: 'publications', icon: 'feather icon-book', key: 'Публикации' },
            { title: 'Достижения', route: 'achievements', icon: 'feather icon-star', key: 'Достижения' },
            { title: 'Модульные журналы', route: 'modular_journals', icon: 'feather icon-book', key: 'Журнал' },
            { title: 'Календарь событий', route: 'calendar', icon: 'feather icon-calendar', key: 'Календарь событий' },
          ];
        }
      })
    ).subscribe();
  }

  navigateToHome(): void {
    this.router.navigate(['/home']);
  }

  // Метод для проверки, находится ли пользователь на корпоративной странице
  isCorporateRoute(): boolean {
    return this.router.url.startsWith('/corp');
  }
}
