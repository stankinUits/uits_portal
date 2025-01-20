import { Component, OnInit, Input } from '@angular/core';
import { NavMenu } from '@app/shared/types/nav-menu.interface';
import { navConfiguration } from '@app/configs/nav.config';
import { NavMenuColor } from '@app/shared/types/app-config.interface';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'header-navbar',
    templateUrl: './header-navbar.component.html',
    host: {
      '[class.header-navbar]': 'true',
      '[class.nav-menu-light]': 'color === "light"',
      '[class.nav-menu-dark]': 'color === "dark"'
    }
})
export class HeaderNavbarComponent implements OnInit {

    menu: NavMenu[] = []; // Меню для отображения
    @Input() color: NavMenuColor = 'light';
    isProfilePage: boolean = false; // Флаг для определения корпоративной страницы

    constructor(
      private router: Router,
      private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        // Инициализация меню при загрузке компонента
        this.updateMenuVisibility();

        // Подписка на изменения маршрута для обновления видимости меню
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe(() => {
            console.log('Обновляем видимость меню после изменения маршрута: ', this.router.url);
            this.updateMenuVisibility();
        });
    }

    updateMenuVisibility(): void {
        // Проверяем, находится ли текущий URL в разделе корпоративного портала
        this.isProfilePage = this.router.url.startsWith('/corp');

        if (this.isProfilePage) {
            console.log('Корпоративный портал: скрываем меню');
            this.menu = []; // Очистка меню
        } else {
            console.log('Обычная страница: показываем меню');
            this.menu = navConfiguration; // Установка стандартной конфигурации меню
        }

        // Принудительное обновление представления
        this.cdr.detectChanges();
    }
}