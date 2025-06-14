import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Observable, Subject, firstValueFrom } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { UserWithRole } from 'src/app/core/models/user-role.model';
import { UserService } from 'src/app/core/services/impl/user.service';
import { BaseAuthenticationService } from 'src/app/core/services/impl/base-authentication.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.page.html',
  styleUrls: ['./user-management.page.scss'],
})
export class UserManagementPage implements OnInit, OnDestroy {
  users$: Observable<UserWithRole[]>;
  isManager$: Observable<boolean>;
  currentUserId: string = '';
  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private authService: BaseAuthenticationService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private translate: TranslateService
  ) {
    this.users$ = this.userService.users$;
    this.isManager$ = this.userService.isManager();
  }

  async ngOnInit() {
    try {
      const currentUser = await this.authService.getCurrentUser();
      if (currentUser) {
        this.currentUserId = currentUser.id;
      }
    } catch (error) {
      console.error('Error obteniendo usuario actual:', error);
    }

    this.loadUsers();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByUserId(index: number, user: UserWithRole): string {
    return user.id;
  }

  async loadUsers() {
    const loading = await this.loadingController.create({
      message: await firstValueFrom(this.translate.get('USER_MANAGEMENT.LOADING_USERS'))
    });
    await loading.present();

    try {
      this.userService.getAllUsers().pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (users) => {
          console.log('Usuarios cargados:', users);
        },
        error: (error) => {
          console.error('Error cargando usuarios:', error);
          this.showToast('USER_MANAGEMENT.LOAD_USERS_ERROR', 'danger');
        },
        complete: () => {
          loading.dismiss();
        }
      });
    } catch (error) {
      await loading.dismiss();
      this.showToast('USER_MANAGEMENT.LOAD_USERS_ERROR', 'danger');
    }
  }

  async confirmDeleteUser(user: UserWithRole) {
    // Prevenir que el gestor se elimine a sí mismo
    if (user.id === this.currentUserId) {
      const cannotDeleteSelfMsg = await firstValueFrom(this.translate.get('USER_MANAGEMENT.CANNOT_DELETE_SELF_ERROR'));
      this.showToast(cannotDeleteSelfMsg, 'warning');
      return;
    }
  
    const translations = await firstValueFrom(this.translate.get([
      'USER_MANAGEMENT.CONFIRM_DELETE_TITLE',
      'USER_MANAGEMENT.CONFIRM_DELETE_SUBTITLE',
      'USER_MANAGEMENT.CONFIRM_DELETE_MESSAGE',
      'USER_MANAGEMENT.CANCEL',
      'USER_MANAGEMENT.DELETE_USER'
    ]));
  
    const message = translations['USER_MANAGEMENT.CONFIRM_DELETE_MESSAGE']
      .replace('{username}', user.username);
  
    const alert = await this.alertController.create({
      header: translations['USER_MANAGEMENT.CONFIRM_DELETE_TITLE'],
      subHeader: translations['USER_MANAGEMENT.CONFIRM_DELETE_SUBTITLE'],
      message: message,
      buttons: [
        {
          text: translations['USER_MANAGEMENT.CANCEL'],
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: translations['USER_MANAGEMENT.DELETE_USER'],
          cssClass: 'danger',
          handler: () => {
            this.deleteUser(user);
          }
        }
      ]
    });
  
    await alert.present();
  }

  async deleteUser(user: UserWithRole) {
    const loadingMessage = await firstValueFrom(this.translate.get('USER_MANAGEMENT.DELETING_USER'));
    const loading = await this.loadingController.create({
      message: loadingMessage
    });
    await loading.present();

    try {
      this.userService.deleteUserCompletely(user.id).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (success) => {
          if (success) {
            this.showToast('USER_MANAGEMENT.USER_DELETED_SUCCESS', 'success');
            this.loadUsers();
          }
        },
        error: (error) => {
          console.error('Error eliminando usuario:', error);
          this.showToast('USER_MANAGEMENT.DELETE_ERROR', 'danger');
        },
        complete: () => {
          loading.dismiss();
        }
      });
    } catch (error) {
      await loading.dismiss();
      this.showToast('USER_MANAGEMENT.DELETE_ERROR', 'danger');
    }
  }

  async refreshUsers() {
    this.loadUsers();
  }

  getRoleColor(role: string): string {
    switch (role.toLowerCase()) {
      case 'gestor':
      case 'manager':
        return 'danger';
      case 'usuario':
      case 'user':
        return 'primary';
      default:
        return 'medium';
    }
  }

  getRoleIcon(role: string): string {
    switch (role.toLowerCase()) {
      case 'gestor':
      case 'manager':
        return 'shield-checkmark';
      case 'usuario':
      case 'user':
        return 'person';
      default:
        return 'help';
    }
  }

  private async showToast(
    messageKey: string, 
    color: 'success' | 'danger' | 'warning' = 'success',
    interpolateParams?: any
  ) {
    const message = await firstValueFrom(this.translate.get(messageKey, interpolateParams));
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom',
      color
    });
    await toast.present();
  }
}