import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseAuthenticationService } from 'src/app/core/services/impl/base-authentication.service';

@Component({
  selector: 'app-porfile',
  templateUrl: './porfile.page.html',
  styleUrls: ['./porfile.page.scss'],
})
export class PorfilePage implements OnInit {

  constructor(
    public authSvc: BaseAuthenticationService,
    private router: Router
  ) { }

  ngOnInit() {
  }

}
