import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-achievement-list',
  templateUrl: './achievement-list.component.html',
  styleUrls: ['./achievement-list.component.scss']
})
export class AchievementListComponent implements OnInit {

  achievements = [
    {
      id: 27,
      title: "Достижение в области исследований",
      description: "Исследование в области экологии, проведенное совместно с университетами Европы.\n\nЭто важный шаг для защиты окружающей среды.\n\n*Научный вклад*: Повышение осведомленности о воздействии загрязнения на экосистемы.",
      content: "Детальное описание исследовательского процесса и результаты экспериментов.",
      image: "http://127.0.0.1:8000/media/photos/2024/10/13/kotenok-malysh-trava.jpg",
      created_at: "2024-10-13T17:12:55.819891Z",
      is_published: true,
      teacher: "Рябцев Михаил Иванович",
    },
    {
      id: 28,
      title: "Инновационная технология в образовании",
      description: "Новаторский метод обучения, который был апробирован на базе нашей кафедры.\n\nМетод включает интерактивные мультимедийные материалы, позволяя студентам усваивать материал быстрее и проще.",
      content: "Метод внедрения инновационных технологий в учебный процесс и их результаты.",
      image: "http://127.0.0.1:8000/media/photos/2024/10/13/kotenok-malysh-trava_lBvUtcf.jpg",
      created_at: "2024-10-13T17:29:14.929013Z",
      is_published: true,
      teacher: "Рябцев Михаил Иванович",
    },
    {
      id: 29,
      title: "Секреты математического анализа",
      description: "Математические исследования в области вычислительных технологий и их применения в практике.\n\nВключает методы для повышения точности вычислений в различных научных задачах.",
      content: "Как математический анализ помогает в решении сложных вычислительных задач.",
      image: "http://127.0.0.1:8000/media/photos/2024/10/13/kotenok-malysh-trava_Fd4Ozox.jpg",
      created_at: "2024-10-13T17:34:39.088824Z",
      is_published: true,
      teacher: "Рябцев Михаил Иванович",
    },
    {
      id: 30,
      title: "Новые горизонты в астрономии",
      description: "Открытия, сделанные в области астрономии, и их влияние на современную науку.\n\n*Ключевые темы*: Исследования черных дыр, новые экзопланеты и космическая радиация.",
      content: "Эти открытия изменяют наше понимание вселенной и возможных форм жизни за пределами Земли.",
      image: "http://127.0.0.1:8000/media/photos/2024/10/13/kotenok-malysh-trava_GUywjGR.jpg",
      created_at: "2024-10-13T17:34:56.372911Z",
      is_published: true,
      teacher: null, // Здесь преподаватель не указан
    }
  ];



  constructor(private router: Router) {}

  onSelectAchievement(achievement: any) {
    console.log(`Достижение id:`, achievement);
    this.router.navigate(['/scientific-activities/achievements', achievement.id], {
      state: { achievement: achievement }
    });
  }

  ngOnInit(): void {}
}
