import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserManagementPage } from './user-management.page';

describe('UserManagementPage', () => {
  let component: UserManagementPage;
  let fixture: ComponentFixture<UserManagementPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManagementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});