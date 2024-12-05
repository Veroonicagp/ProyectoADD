import { Component } from '@angular/core';
import { LanguageService } from './core/services/language.service';
import { BaseAuthenticationService } from './core/services/impl/base-authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(
    //private languageService: LanguageService,
    public authSvc: BaseAuthenticationService,
    private router: Router
  ) {
  }


  logout() {
    this.authSvc.signOut().subscribe(()=>{
      this.router.navigate(['/login']);
    });
  }
}
