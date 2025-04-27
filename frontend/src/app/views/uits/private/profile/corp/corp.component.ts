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
  isCollapsed = false;
  isMobilePanelOpen = false;
  currentPanel = 'default';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.profile$.pipe(
      map(profile => {
        const userPermissions = getUserPermissions(profile);
        if (userPermissions.includes(Permission.SUPERUSER)) {
          this.corporateMenu = [
            { title: 'Профиль', route: 'personal', icon: 'feather icon-user', key: 'Аккаунт' },
            { title: 'Календарь событий', route: 'calendar', icon: 'feather icon-calendar', key: 'Календарь событий' },
          ];
        } else if (userPermissions.includes(Permission.TEACHER)) {
          this.isTeacher = true;
          this.corporateMenu = [
            { title: 'Профиль', route: 'personal', icon: 'feather icon-user', key: 'Аккаунт' },
            { title: 'Календарь событий', route: 'calendar', icon: 'feather icon-calendar', key: 'Календарь событий' },
          ];
        }
      })
    ).subscribe();
  }

  navigateToHome(): void {
    this.router.navigate(['/home']);
  }

  toggleMenu() {
    this.isCollapsed = !this.isCollapsed;
  }

  // Метод для проверки, находится ли пользователь на корпоративной странице
  isCorporateRoute(): boolean {
    return this.router.url.startsWith('/corp');
  }
}
