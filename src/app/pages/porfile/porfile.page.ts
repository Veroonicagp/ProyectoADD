import { Component, OnInit, OnDestroy, Inject, ChangeDetectorRef, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom, Subscription } from 'rxjs';
import { Adven } from 'src/app/core/models/adven.model';
import { AdvenService } from 'src/app/core/services/impl/adven.service';
import { BaseAuthenticationService } from 'src/app/core/services/impl/base-authentication.service';
import { BaseMediaService } from 'src/app/core/services/impl/base-media.service';
import { ADVEN_COLLECTION_SUBSCRIPTION_TOKEN } from 'src/app/core/repositories/repository.tokens';
import { CollectionChange, ICollectionSubscription } from 'src/app/core/services/interfaces/collection-subcription.interface';

@Component({
  selector: 'app-porfile',
  templateUrl: './porfile.page.html',
  styleUrls: ['./porfile.page.scss'],
})
export class PorfilePage implements OnInit, OnDestroy {
  formGroup: FormGroup;
  adven?: Adven | null;
  
  private originalAdven?: Adven | null;
  private subscription?: Subscription;
  private currentUserId: string = '';
  private currentAdvenId: string = '';
  
  constructor(
    private formBuilder: FormBuilder,
    public authSvc: BaseAuthenticationService,
    private router: Router,
    private advenService: AdvenService,
    private mediaService: BaseMediaService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private translateService: TranslateService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    @Inject(ADVEN_COLLECTION_SUBSCRIPTION_TOKEN)
    private userSubscription: ICollectionSubscription<Adven>
  ) {
    this.formGroup = this.formBuilder.group({
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      media: ['']
    });
  }

  async ngOnInit() {
    const loading = await this.loadingController.create();
    await loading.present();

    try {
      const user = await this.authSvc.getCurrentUser();
      
      if(user){
          this.currentUserId = user.id;
          this.adven = await lastValueFrom(this.advenService.getByUserId(user.id));
          
          if (this.adven) {
            this.currentAdvenId = this.adven.id;
            await this.updateFormWithAdvenData(user);
          }
      }
    } catch (error) {
      console.error('Error en ngOnInit:', error);
      const toast = await this.toastController.create({
        message: await lastValueFrom(this.translateService.get('Error en la actualización')),
        duration: 3000,
        position: 'bottom'
      });
      await toast.present();
    } finally {
      await loading.dismiss();
    }

    this.setupRealtimeSubscription();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    
    if (this.userSubscription) {
      this.userSubscription.unsubscribe('adventurers');
    }
  }

  private setupRealtimeSubscription() {
    if (!this.currentUserId || !this.currentAdvenId || !this.userSubscription) {
      return;
    }

    try {
      const observable = this.userSubscription.subscribe('adventurers');
      
      this.subscription = observable.subscribe({
        next: (change: CollectionChange<Adven>) => {
          this.handleSubscriptionChange(change);
        },
        error: (error) => {
          console.error('Error en la suscripción del perfil:', error);
        }
      });
    } catch (error) {
      console.error('Error en setupRealtimeSubscription:', error);
    }
  }

  private async handleSubscriptionChange(change: CollectionChange<Adven>) {
    const isMyAdvenDocument = change.id === this.currentAdvenId;
    const isMyUserData = change.data?.userId === this.currentUserId;
    
    if (!isMyAdvenDocument && !isMyUserData) {
      return;
    }

    switch(change.type) {
      case 'added':
        if (isMyUserData && !isMyAdvenDocument) {
          this.currentAdvenId = change.id;
          this.advenService.triggerUpdate();
        }
        
        if (change.data) {
          this.ngZone.run(async () => {
            this.adven = change.data;
            const user = await this.authSvc.getCurrentUser();
            if (user) {
              await this.updateFormWithAdvenData(user);
            }
            this.cdr.detectChanges();
          });
        }
        break;
        
      case 'modified':
        if (change.data) {
          this.ngZone.run(async () => {
            this.adven = change.data;
            const user = await this.authSvc.getCurrentUser();
            if (user) {
              await this.updateFormWithAdvenData(user);
            }
            this.cdr.detectChanges();
            this.advenService.triggerUpdate();
          });
        }
        break;
        
      case 'removed':
        if (isMyAdvenDocument) {
          this.ngZone.run(() => {
            this.router.navigate(['/login']);
          });
        }
        break;
    }
  }

  private async updateFormWithAdvenData(user: any) {
    if (this.adven) {
      const updatedAdven: any = {
        ...this.adven,
        email: user.email,
        userId: user.id,
        media: typeof this.adven.media === 'object' ? 
                       this.adven.media.url : 
                       undefined
      };
      
      this.originalAdven = { ...this.adven };
      this.formGroup.patchValue(updatedAdven);
      this.formGroup.markAsPristine();
    }
  }

  async onImageChanged() {
    if (!this.adven) return;

    try {
      const changedValues = await this.getChangedValues();
      
      if ('media' in changedValues) {
        const loading = await this.loadingController.create({
          message: 'Actualizando imagen...',
          duration: 3000
        });
        await loading.present();

        try {
          await lastValueFrom(this.advenService.update(this.adven.id, changedValues));
          
          const toast = await this.toastController.create({
            message: 'Imagen actualizada correctamente',
            duration: 2000,
            position: 'bottom',
            color: 'success'
          });
          await toast.present();
        } catch (error) {
          console.error('Error actualizando imagen:', error);
          const toast = await this.toastController.create({
            message: 'Error al actualizar la imagen',
            duration: 3000,
            position: 'bottom',
            color: 'danger'
          });
          await toast.present();
        } finally {
          await loading.dismiss();
        }
      }
    } catch (error) {
      console.error('Error en actualización automática:', error);
    }
  }

  private async getChangedValues(): Promise<any> {
    const formValues = this.formGroup.value;
    const changedValues = {} as any;

    if (formValues.name !== this.originalAdven?.name) {
      changedValues.name = formValues.name;
    }
    
    if (formValues.surname !== this.originalAdven?.surname) {
      changedValues.surname = formValues.surname;
    }
    
    if (formValues.email !== this.originalAdven?.email) {
      changedValues.email = formValues.email;
    }

    const currentMedia = formValues.media || '';
    const originalMedia = this.originalAdven?.media?.url || this.originalAdven?.media || '';

    if (currentMedia !== originalMedia) {
      changedValues.media = currentMedia;
    }

    if ('media' in changedValues) {
      const mediaValue = changedValues.media;
      
      if (!mediaValue || mediaValue === '') {
        changedValues.media = null;
      } else if (mediaValue.startsWith('data:')) {
        const base64Response = await fetch(mediaValue);
        const blob = await base64Response.blob();
        const uploadedBlob = await lastValueFrom(this.mediaService.upload(blob));
        changedValues.media = uploadedBlob[0];
      }
    }

    return changedValues;
  }

  async onSubmit() {
    if (this.formGroup.valid && this.adven) {
      const loading = await this.loadingController.create();
      await loading.present();

      try {
        const changedValues = await this.getChangedValues();

        if (Object.keys(changedValues).length === 0) {
          const toast = await this.toastController.create({
            message: 'No hay cambios para actualizar',
            duration: 2000,
            position: 'bottom'
          });
          await toast.present();
          await loading.dismiss();
          return;
        }
        
        await lastValueFrom(this.advenService.update(this.adven.id, changedValues));
        
        const toast = await this.toastController.create({
          message: await this.translateService.get('Actualizado correctamente').toPromise(),
          duration: 3000,
          position: 'bottom'
        });
        await toast.present();
        
      } catch (error) {
        console.error('Error al actualizar:', error);
        const toast = await this.toastController.create({
          message: await this.translateService.get('No se a podido actualizar').toPromise(),
          duration: 3000,
          position: 'bottom'
        });
        await toast.present();
      } finally {
        await loading.dismiss();
      }
    }
  }

  get name() {
    return this.formGroup.controls['name'];
  }

  get surname() {
    return this.formGroup.controls['surname'];
  }

  get email() {
    return this.formGroup.controls['email'];
  }

  logout() {
    this.authSvc.signOut().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}