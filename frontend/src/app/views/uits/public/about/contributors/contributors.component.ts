import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Contributor} from '@app/shared/types/models/contributor.interface';

@Component({
  selector: 'app-contributors',
  templateUrl: './contributors.component.html',
  styleUrls: ['./contributors.component.css']
})
export class ContributorsComponent implements OnInit {
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;

  contributors: Contributor[] = [
    {
      id: 1,
      name: 'Чеканин Владислав Александрович',
      description: 'Руководитель',
      image: 'assets/images/contributors/chekanin-vladislav.jpg',
    },
    {
      id: 2,
      name: 'Малова Яна',
      description: 'Аналитик, менеджер, разработчик',
      image: 'assets/images/contributors/malova-iana.jpg',
    },
    {
      id: 3,
      name: 'Ерин Сергей',
      description: 'Разработчик',
      image: 'fdg',
    },
    {
      id: 4,
      name: 'Медведев Вадим',
      description: 'Разработчик, ревьюер кода',
      image: 'assets/images/contributors/medvedev-vadim.jpg',
    },
    {
      id: 5,
      name: 'Вдовенко Данил',
      description: 'Devops, ревьюер кода',
      image: 'assets/images/contributors/vdovenko-danil.jpg',
    },
    {
      id: 6,
      name: 'Осипова Ксения',
      description: 'Backend-разработчик',
      image: 'assets/images/contributors/osipova-ksenia.jpg',
    },
    {
      id: 7,
      name: 'Вежновец Дмитрий',
      description: 'Frontend-разработчик',
      image: 'assets/images/contributors/veznovets.jpg',
    },
    {
      id: 8,
      name: 'Рябцев Михаил',
      description: 'Backend-разработчик',
      image: 'assets/images/contributors/ryabtsev-michail.jpg',
    },
    {
      id: 9,
      name: 'Шостов Дмитрий',
      description: 'Backend-разработчик',
      image: 'fdg',
    },
    {
      id: 10,
      name: 'Лебедев Александр',
      description: 'Frontend-разработчик',
      image: 'assets/images/contributors/lebedev-alex.jpg',
    },
    {
      id: 11,
      name: 'Мокроусова Лариса',
      description: 'Frontend-разработчик',
      image: 'fdg',
    },
    {
      id: 12,
      name: 'Станьков Дмитрий',
      description: 'Frontend-разработчик',
      image: 'fdg',
    },
    {
      id: 13,
      name: 'Бадян Ксения',
      description: 'Frontend-разработчик',
      image: 'fdg',
    },
    {
      id: 14,
      name: 'Бадян Анастасия',
      description: 'Frontend-разработчик',
      image: 'fdg',
    },
    {
      id: 15,
      name: 'Золотухин Иван',
      description: 'Fullstack-разработчик',
      image: 'fdg',
    },
    {
      id: 16,
      name: 'Мальцев Тимофей',
      description: 'Backend-разработчик',
      image: 'fdg',
    },
    {
      id: 17,
      name: 'Вьев Сергей',
      description: 'Backend-разработчик',
      image: 'fdg',
    },
  ];

  constructor() { }

  ngOnInit(): void {
  }

  scrollLeft(): void {
    this.smoothScroll(-400);
  }

  scrollRight(): void {
    this.smoothScroll(400);
  }

  smoothScroll(offset: number) {
    if (this.scrollContainer) {
      const start = this.scrollContainer.nativeElement.scrollLeft;
      const target = start + offset;
      let startTime: number | null = null;
      const duration = 800; // Увеличиваем время для плавности

      const easeOutExpo = (t: number) => 1 - Math.pow(2, -10 * t); // Экспоненциальное замедление

      const animateScroll = (timestamp: number) => {
        if (!startTime) {startTime = timestamp;}
        const timeElapsed = timestamp - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const easedProgress = easeOutExpo(progress);

        this.scrollContainer.nativeElement.scrollLeft = start + (target - start) * easedProgress;

        if (timeElapsed < duration) {
          requestAnimationFrame(animateScroll);
        }
      };

      requestAnimationFrame(animateScroll);
    }
  }
}
