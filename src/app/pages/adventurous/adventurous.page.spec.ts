import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdventurousPage } from './adventurous.page';

describe('AdventurousPage', () => {
  let component: AdventurousPage;
  let fixture: ComponentFixture<AdventurousPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdventurousPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
