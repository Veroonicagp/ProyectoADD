import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AdvenActivitiesModalComponent } from './adven-activities-modal.component';

describe('AdvenActivitiesModalComponent', () => {
  let component: AdvenActivitiesModalComponent;
  let fixture: ComponentFixture<AdvenActivitiesModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvenActivitiesModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AdvenActivitiesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});