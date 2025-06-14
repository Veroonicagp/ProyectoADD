// src/app/pages/login/login.page.ts - VERSIÓN FINAL
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BaseAuthenticationService } from 'src/app/core/services/impl/base-authentication.service';
import { LanguageService } from 'src/app/core/services/language.service'; // ✅ AGREGADO

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
  private returnUrl: string = '/activities';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authSvc: BaseAuthenticationService,
    public translate: TranslateService, // ✅ PÚBLICO para template
    private languageService: LanguageService // ✅ AGREGADO
  ) { 
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.currentLang = this.languageService.getStoredLanguage();
  }

  ngOnInit() {
    // Obtener la URL de retorno de los query params
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/activities';
    
    // Verificar si ya está autenticado (por si el guard falla)
    this.authSvc.authenticated$.subscribe(isAuthenticated => {
      if (isAuthenticated) {
        console.log('Usuario ya autenticado en login, redirigiendo...');
        this.router.navigate([this.returnUrl]);
      }
    });
  }

  // ✅ MÉTODO MEJORADO PARA TOGGLE DE CONTRASEÑA
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loginError = '';
      
      this.authSvc.signIn(this.loginForm.value).subscribe({
        next: resp => {
          console.log('Login exitoso, redirigiendo a:', this.returnUrl);
          // Limpiar el formulario
          this.loginForm.reset();
          // Redirigir a la URL original o a /activities por defecto
          this.router.navigate([this.returnUrl]);
        },
        error: err => {
          console.error('Error en login:', err);
          this.loginError = 'LOGIN.ERRORS.INVALID_CREDENTIALS';
        }
      });
      
    } else {
      console.log('Formulario no válido');
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }

  onRegister() {
    // Limpiar el formulario antes de ir a register
    this.loginForm.reset();
    this.loginError = '';
    // Mantener la returnUrl al ir a register
    this.router.navigate(['/register'], { 
      queryParams: { returnUrl: this.returnUrl },
      replaceUrl: true 
    });
  }

  // ✅ MÉTODO MEJORADO PARA CAMBIAR IDIOMA CON ANIMACIÓN
  changeLanguage() {
    const currentLang = this.translate.currentLang;
    const newLang = currentLang === 'en' ? 'es' : 'en';
    
    // Agregar clase de animación
    const languageBtn = document.querySelector('.language-btn');
    if (languageBtn) {
      languageBtn.classList.add('changing');
      setTimeout(() => {
        languageBtn.classList.remove('changing');
      }, 600);
    }
    
    // Cambiar idioma
    this.translate.use(newLang);
    
    // Actualizar idioma almacenado
    this.languageService.storeLanguage(newLang);
    this.currentLang = newLang;
    
    console.log(`Idioma cambiado a: ${newLang}`);
  }

  // Getters para acceder fácilmente a los controles del formulario
  get email() {
    return this.loginForm.controls['email'];
  }

  get password() {
    return this.loginForm.controls['password'];
  }
}