import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastController } from '@ionic/angular';
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

  registrationError: string = '';
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authSvc: BaseAuthenticationService,
    public translate: TranslateService,
    private languageService: LanguageService, 
    private advenSvc: AdvenService,
    private toastController: ToastController
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
      this.registrationError = '';
      
      this.authSvc.signUp(this.registerForm.value).subscribe({
        next: (resp: User) => {
          const userData = {
            ...this.registerForm.value,
            userId: resp.id.toString()
          };
          
          this.advenSvc.add(userData).subscribe({
            next: resp => {
              this.showSuccessToast();
              const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/activities';
              this.router.navigateByUrl(returnUrl);
            },
            error: err => {
              console.error('Error creando perfil de aventurero:', err);
              this.showErrorToast('Error al crear el perfil. Inténtelo de nuevo.');
            }
          });
        },
        error: err => {
          console.error('Error en registro:', err);
          this.handleRegistrationError(err);
        }
      });
    } else {
      console.log('Formulario no válido');
    }
  }

  private handleRegistrationError(error: any) {
    if (error?.code) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          this.registrationError = 'EMAIL_ALREADY_EXISTS';
          this.showErrorToast('Este email ya está registrado. Inténtelo con otro email.');
          break;
        case 'auth/weak-password':
          this.registrationError = 'WEAK_PASSWORD';
          this.showErrorToast('La contraseña es muy débil. Use al menos 6 caracteres.');
          break;
        case 'auth/invalid-email':
          this.registrationError = 'INVALID_EMAIL';
          this.showErrorToast('El formato del email no es válido.');
          break;
        case 'auth/operation-not-allowed':
          this.registrationError = 'OPERATION_NOT_ALLOWED';
          this.showErrorToast('El registro está deshabilitado temporalmente.');
          break;
        default:
          this.registrationError = 'UNKNOWN_ERROR';
          this.showErrorToast('Error en el registro. Inténtelo de nuevo.');
      }
    } else if (error?.message) {
      if (error.message.includes('email-already-in-use') || 
          error.message.includes('already in use')) {
        this.registrationError = 'EMAIL_ALREADY_EXISTS';
        this.showErrorToast('Este email ya está registrado. Inténtelo con otro email o inicie sesión.');
      } else {
        this.registrationError = 'UNKNOWN_ERROR';
        this.showErrorToast('Error en el registro. Inténtelo de nuevo.');
      }
    } else {
      this.registrationError = 'UNKNOWN_ERROR';
      this.showErrorToast('Error en el registro. Inténtelo de nuevo.');
    }
  }

  private async showSuccessToast() {
    const message = await this.translate.get('Cuenta creada exitosamente').toPromise();
    const toast = await this.toastController.create({
      message: message || 'Cuenta creada exitosamente',
      duration: 3000,
      position: 'bottom',
      color: 'success'
    });
    await toast.present();
  }

  private async showErrorToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
      position: 'bottom',
      color: 'danger'
    });
    await toast.present();
  }

  changeLanguage() {
    const currentLang = this.translate.currentLang;
    const newLang = currentLang === 'en' ? 'es' : 'en';
    this.translate.use(newLang);
  }

  onLogin(){
    this.registerForm.reset();
    this.registrationError = '';
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/login';
    this.router.navigate(['/login'], {queryParams:{ returnUrl:returnUrl}, replaceUrl:true});
  }

  get name(){
    return this.registerForm.controls['name'];
  }

  get surname(){
    return this.registerForm.controls['surname'];
  }

  get email(){
    return this.registerForm.controls['email'];
  }

  get password(){
    return this.registerForm.controls['password'];
  }

  get confirmPassword(){
    return this.registerForm.controls['confirmPassword'];
  }

  get hasEmailExistsError(): boolean {
    return this.registrationError === 'EMAIL_ALREADY_EXISTS';
  }
}