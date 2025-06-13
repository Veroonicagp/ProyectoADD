import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { User } from 'src/app/core/models/auth.model';
import { AdvenService } from 'src/app/core/services/impl/adven.service';
import { BaseAuthenticationService } from 'src/app/core/services/impl/base-authentication.service';
import { LanguageService } from 'src/app/core/services/language.service';
import { passwordsMatchValidator, passwordValidator } from 'src/app/core/utils/validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm: FormGroup;
  private returnUrl: string = '/activities';
  
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authSvc: BaseAuthenticationService,
    public translate: TranslateService,
    private languageService: LanguageService, 
    private advenSvc: AdvenService
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, passwordValidator]],
      confirmPassword: ['', [Validators.required]]
    },
    { validators: passwordsMatchValidator });
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/activities';
    
    this.authSvc.authenticated$.subscribe(isAuthenticated => {
      if (isAuthenticated) {
        console.log('Usuario ya autenticado en register, redirigiendo...');
        this.router.navigate([this.returnUrl]);
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.authSvc.signUp(this.registerForm.value).subscribe({
        next: (resp: User) => {
          const userData = {
            ...this.registerForm.value,
            userId: resp.id.toString()
          };
          
          this.advenSvc.add(userData).subscribe({
            next: resp => {
              console.log('Registro exitoso, redirigiendo a:', this.returnUrl);
              this.registerForm.reset();
              this.router.navigate([this.returnUrl]);
            },
            error: err => {
              console.error('Error creando perfil de aventurero:', err);
            }
          });
        },
        error: err => {
          console.error('Error en registro:', err);
        }
      });
    } else {
      console.log('Formulario no válido');
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
    }
  }

  onLogin() {
    this.registerForm.reset();
    this.router.navigate(['/login'], { 
      queryParams: { returnUrl: this.returnUrl }, 
      replaceUrl: true 
    });
  }

  changeLanguage() {
    const currentLang = this.translate.currentLang;
    const newLang = currentLang === 'en' ? 'es' : 'en';
    
    const languageBtn = document.querySelector('.language-btn');
    if (languageBtn) {
      languageBtn.classList.add('changing');
      setTimeout(() => {
        languageBtn.classList.remove('changing');
      }, 600);
    }
    
    this.translate.use(newLang);
    
    this.languageService.storeLanguage(newLang);
    
    console.log(`Idioma cambiado a: ${newLang}`);
  }

  get name() {
    return this.registerForm.controls['name'];
  }

  get surname() {
    return this.registerForm.controls['surname'];
  }

  get email() {
    return this.registerForm.controls['email'];
  }

  get password() {
    return this.registerForm.controls['password'];
  }

  get confirmPassword() {
    return this.registerForm.controls['confirmPassword'];
  }
}