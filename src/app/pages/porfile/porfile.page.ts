import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { Adven } from 'src/app/core/models/adven.model';
import { AdvenService } from 'src/app/core/services/impl/adven.service';
import { BaseAuthenticationService } from 'src/app/core/services/impl/base-authentication.service';
import { BaseMediaService } from 'src/app/core/services/impl/base-media.service';

@Component({
  selector: 'app-porfile',
  templateUrl: './porfile.page.html',
  styleUrls: ['./porfile.page.scss'],
})
export class PorfilePage implements OnInit {

  formGroup: FormGroup;
  adven?: Adven | null;
  
  constructor(
    private formBuilder: FormBuilder,
    public authSvc: BaseAuthenticationService,
    private router: Router,
    private advenService: AdvenService,
    private mediaService: BaseMediaService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private translateService: TranslateService
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
      console.log(user)
      if(user){
          this.adven = await lastValueFrom(this.advenService.getByUserId(user.id));
          console.log(this.adven);
          if (this.adven) {
            const updatedAdven: any = {
              ...this.adven,
              email: user.email,
              userId: user.id,
              media: typeof this.adven.media === 'object' ? 
                           this.adven.media.url : 
                           undefined
            };
            this.formGroup.patchValue(updatedAdven);
            this.formGroup.markAsPristine();
          }
      }
    } catch (error) {
      console.error(error);
      const toast = await this.toastController.create({
        message: await lastValueFrom(this.translateService.get('Error en la actualización')),
        duration: 3000,
        position: 'bottom'
      });
      await toast.present();
    } finally {
      await loading.dismiss();
    }
  }

  async onSubmit() {
    if (this.formGroup.valid && this.adven) {
      const loading = await this.loadingController.create();
      await loading.present();

      try {
        console.log('🚀 Iniciando proceso de actualización');
        
        // Obtener valores del formulario
        const formValues = this.formGroup.value;
        console.log('📝 Valores del formulario:', formValues);
        
        // Obtener valores originales
        const originalValues = {
          name: this.adven.name,
          surname: this.adven.surname,
          email: this.adven.email,
          media: this.adven.media?.url || this.adven.media || ''
        };
        console.log('📋 Valores originales:', originalValues);

        // Verificar el estado dirty de cada control
        console.log('🔍 Estado dirty de controles:');
        Object.keys(this.formGroup.controls).forEach(key => {
          const control = this.formGroup.get(key);
          console.log(`  ${key}: dirty=${control?.dirty}, value=${control?.value}`);
        });

        const changedValues = {} as any;

        // Verificar cambios campo por campo
        if (formValues.name !== originalValues.name) {
          changedValues.name = formValues.name;
          console.log('✅ Nombre cambió');
        }
        
        if (formValues.surname !== originalValues.surname) {
          changedValues.surname = formValues.surname;
          console.log('✅ Apellido cambió');
        }
        
        if (formValues.email !== originalValues.email) {
          changedValues.email = formValues.email;
          console.log('✅ Email cambió');
        }

        // Verificar media específicamente
        const currentMedia = formValues.media || '';
        const originalMedia = originalValues.media || '';
        
        console.log('🖼️ Comparación de media:');
        console.log('  Current:', `"${currentMedia}"`);
        console.log('  Original:', `"${originalMedia}"`);
        console.log('  Son iguales:', currentMedia === originalMedia);

        if (currentMedia !== originalMedia) {
          changedValues.media = currentMedia;
          console.log('✅ Media cambió, incluyendo en actualización');
        } else {
          console.log('❌ Media NO cambió');
        }

        console.log('🔄 Valores que cambiaron:', changedValues);

        // Si no hay cambios, mostrar mensaje
        if (Object.keys(changedValues).length === 0) {
          console.log('⚠️ No hay cambios para actualizar');
          const toast = await this.toastController.create({
            message: 'No hay cambios para actualizar',
            duration: 2000,
            position: 'bottom'
          });
          await toast.present();
          await loading.dismiss();
          return;
        }

        // Procesar el campo media
        if ('media' in changedValues) {
          const mediaValue = changedValues.media;
          console.log('🔧 Procesando media:', mediaValue);
          
          if (!mediaValue || mediaValue === '') {
            console.log('🗑️ Eliminando imagen del backend');
            changedValues.media = null;
          } else if (mediaValue.startsWith('data:')) {
            console.log('📤 Subiendo nueva imagen');
            const base64Response = await fetch(mediaValue);
            const blob = await base64Response.blob();
            const uploadedBlob = await lastValueFrom(this.mediaService.upload(blob));
            changedValues.media = uploadedBlob[0];
          } else {
            console.log('🔗 Manteniendo URL existente');
          }
        }
        
        console.log('📡 Enviando al backend:', changedValues);
        
        // Actualizar en el backend
        await lastValueFrom(this.advenService.update(this.adven.id, changedValues));
        
        const toast = await this.toastController.create({
          message: await this.translateService.get('Actualizado correctamente').toPromise(),
          duration: 3000,
          position: 'bottom'
        });
        await toast.present();

        // Recargar los datos
        await this.reloadUserData();
        
      } catch (error) {
        console.error('❌ Error al actualizar:', error);
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

  private async reloadUserData() {
    console.log('🔄 Recargando datos del usuario...');
    try {
      const user = await this.authSvc.getCurrentUser();
      if (user) {
        this.adven = await lastValueFrom(this.advenService.getByUserId(user.id));
        console.log('📊 Datos recargados del adven:', this.adven);
        if (this.adven) {
          const updatedAdven: any = {
            ...this.adven,
            email: user.email,
            userId: user.id,
            media: typeof this.adven.media === 'object' && this.adven.media ? 
                           this.adven.media.url : 
                           undefined
          };
          console.log('🔧 Datos preparados para el formulario:', updatedAdven);
          this.formGroup.patchValue(updatedAdven);
          this.formGroup.markAsPristine();
          console.log('✅ Formulario actualizado y marcado como pristine');
        }
      }
    } catch (error) {
      console.error('❌ Error recargando datos:', error);
    }
  }
                                                                        
  get name(){
    return this.formGroup.controls['name'];
  }

  get surname(){
    return this.formGroup.controls['surname'];
  }

  get email(){
    return this.formGroup.controls['email'];
  }

  logout() {
    this.authSvc.signOut().subscribe(()=>{
      this.router.navigate(['/login']);
    });
  }
}