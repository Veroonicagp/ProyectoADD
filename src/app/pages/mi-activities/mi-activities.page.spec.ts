import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MiActivitiesPage } from './mi-activities.page';

describe('MiActivitiesPage', () => {
  let component: MiActivitiesPage;
  let fixture: ComponentFixture<MiActivitiesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MiActivitiesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
