import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BaseAuthenticationService } from 'src/app/core/services/impl/base-authentication.service';
import { LanguageService } from 'src/app/core/services/language.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  currentLang: string;
  loginError: string = '';
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authSvc: BaseAuthenticationService,
    private translate: TranslateService,
    private languageService: LanguageService,
  ) { 
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.currentLang = this.languageService.getStoredLanguage();
  }

  // Nueva función para alternar la visibilidad de la contraseña
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loginError = '';
      
      this.authSvc.signIn(this.loginForm.value).subscribe({
        next: resp => {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/activities';
          this.router.navigateByUrl(returnUrl);
        },
        error: err => {
          console.log(err);
          this.loginError = 'LOGIN.ERRORS.INVALID_CREDENTIALS';
        }
      });
      
    } else {
      console.log('Formulario no válido');
    }
  }

  onRegister() {
    this.loginForm.reset();
    this.loginError = '';
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/activities';
    this.router.navigate(['/register'], {queryParams: { returnUrl: returnUrl}, replaceUrl: true});
  }

  ngOnInit() {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/activities';
    this.router.navigateByUrl(returnUrl);
  }

  changeLanguage() {
    const currentLang = this.translate.currentLang;
    const newLang = currentLang === 'en' ? 'es' : 'en';
    this.translate.use(newLang);
  }

  get email() {
    return this.loginForm.controls['email'];
  }

  get password() {
    return this.loginForm.controls['password'];
  }
}