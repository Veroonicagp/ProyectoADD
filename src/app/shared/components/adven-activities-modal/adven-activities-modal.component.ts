import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Activity } from 'src/app/core/models/activity.model';
import { Adven } from 'src/app/core/models/adven.model';
import { ActivitiesService } from 'src/app/core/services/impl/activities.service';
import { ActivityInfoComponent } from '../activity-info/activity-info.component';

@Component({
  selector: 'app-adven-activities-modal',
  templateUrl: './adven-activities-modal.component.html',
  styleUrls: ['./adven-activities-modal.component.scss'],
})
export class AdvenActivitiesModalComponent implements OnInit {
  @Input() adven!: Adven;
  
  private _activities = new BehaviorSubject<Activity[]>([]);
  activities$ = this._activities.asObservable();
  
  isLoading = true;
  hasActivities = false;

  constructor(
    private modalCtrl: ModalController,
    private activitiesService: ActivitiesService
  ) { }

  ngOnInit() {
    this.loadAdvenActivities();
  }

  loadAdvenActivities() {
    if (!this.adven?.id) {
      console.error('No adven ID provided');
      this.isLoading = false;
      return;
    }

    console.log('Cargando actividades para el aventurero:', this.adven.name, 'ID:', this.adven.id);
    
    this.activitiesService.getAllActivitiesByAdvenId(this.adven.id).subscribe({
      next: (activities) => {
        console.log('Actividades encontradas:', activities);
        this._activities.next(activities);
        this.hasActivities = activities.length > 0;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading activities:', error);
        this.isLoading = false;
        this.hasActivities = false;
      }
    });
  }

  async openActivityDetail(activity: Activity) {
    const modal = await this.modalCtrl.create({
      component: ActivityInfoComponent,
      componentProps: {
        activity
      }
    });
    await modal.present();
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}