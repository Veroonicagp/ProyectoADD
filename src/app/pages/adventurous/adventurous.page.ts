import { Component, OnInit } from '@angular/core';
import { AdvenService } from 'src/app/core/services/impl/adven.service';

@Component({
  selector: 'app-adventurous',
  templateUrl: './adventurous.page.html',
  styleUrls: ['./adventurous.page.scss'],
})
export class AdventurousPage implements OnInit {

  constructor(
    private advenSvc: AdvenService
  ) { }

  ngOnInit() {
  }

}
