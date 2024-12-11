import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AchievementListComponent } from './achievement-list.component';

describe('AchievementListComponent', () => {
  let component: AchievementListComponent;
  let fixture: ComponentFixture<AchievementListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AchievementListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AchievementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
