import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleSummaryComponent } from './schedule-summary.component';

describe('ScheduleSummaryComponent', () => {
  let component: ScheduleSummaryComponent;
  let fixture: ComponentFixture<ScheduleSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
