import { Component, OnInit } from '@angular/core';
import { ActivitiesService } from 'src/app/core/services/impl/activities.service';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.page.html',
  styleUrls: ['./activities.page.scss'],
})
export class ActivitiesPage implements OnInit {

  constructor(
   
    private actSvc: ActivitiesService
  ) { }

  ngOnInit() {
  }

}