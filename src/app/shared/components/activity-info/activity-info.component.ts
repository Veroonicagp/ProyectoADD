import { Component, Input, OnInit } from '@angular/core';
import { ModalController, Platform, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Activity } from 'src/app/core/models/activity.model';
import { Share } from '@capacitor/share';

@Component({
  selector: 'app-activity-info',
  templateUrl: './activity-info.component.html',
  styleUrls: ['./activity-info.component.scss'],
})
export class ActivityInfoComponent implements OnInit {
  isMobile: boolean = false;

  private _activities: BehaviorSubject<Activity[]> = new BehaviorSubject<Activity[]>([]);
  public activities$: Observable<Activity[]> = this._activities.asObservable();
  activity: Activity = {
    id: '',
    title: '',
    description: '',
    location: '',
    price: '',
    advenId:''
  };

  
  @Input() set activities(activities: Activity[]) {
    this._activities.next(activities);
  }

  @Input() set activityData(_activity: Activity) {
    this.activity = _activity;
  }

  constructor(
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private translateService: TranslateService,
    private platform: Platform
  ) {
    this.isMobile = this.platform.is('ios') || this.platform.is('android');
  }

  ngOnInit() {}

  dismiss() {
    this.modalCtrl.dismiss();
  }


  async shareActivity() {
        await Share.share({
          title: this.activity.title,
          text: 'Hola, he visto esta aventura en Ready To Enjoy y creo que te podria gustar '+this.activity.title+' si te gusta logeate ',
          url: `https://readytoenjoy.netlify.app`,
          dialogTitle: this.translateService.instant('ACTIVIDADES.COMPARTIR')
        });
  }
  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }
}