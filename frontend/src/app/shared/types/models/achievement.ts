import { Snaked, SnakeObjectToCamelCase } from '@app/shared/utils/SnakeToCamelCase';

export interface IAchievement {
  id: number;
  title: string;
  description: string;
  image: string;
  createdAt: string;
  isPublished: boolean;
  teacher: string;
  teacherId: number;
}

abstract class BaseAchievement {
  id: number;
  title: string;
  description: string;
  image: string;
  createdAt: string;
  isPublished: boolean;
  teacher: string;
  teacherId: number;

  protected constructor(achievement: IAchievement) {
    const camelAchievement = SnakeObjectToCamelCase(achievement);
    this.id = camelAchievement.id;
    this.title = camelAchievement.title;
    this.description = camelAchievement.description;
    this.image = camelAchievement.image;
    this.createdAt = camelAchievement.createdAt;
    this.isPublished = camelAchievement.isPublished;
    this.teacher = camelAchievement.teacher;
    this.teacherId = camelAchievement.teacherId;
  }
}

export class ListAchievement extends BaseAchievement {
  constructor(snakedAchievement: Snaked<ListAchievement>) {
    super(snakedAchievement);
  }
}

export class Achievement extends BaseAchievement {
  content: string;

  constructor(snakedAchievement: Snaked<Achievement>) {
    super(snakedAchievement);
    this.content = snakedAchievement.content;
  }
}

