import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '@firebase/auth';
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
    private mediaService:BaseMediaService,
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
      if(user){
          this.adven = await lastValueFrom(this.advenService.getByUserId(user.id));
          console.log(this.adven);
          if (this.adven) {
            const updatedAdven: any = {
              ...this.adven,
              userId:user.id,
              media: typeof this.adven.media === 'object' ? 
                           this.adven.media.url : 
                           undefined
            };
            this.formGroup.patchValue(updatedAdven);
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
        const changedValues = {} as Record<keyof Adven, any>;
        Object.keys(this.formGroup.controls).forEach(key => {
          if (this.formGroup.get(key)?.dirty) {
            changedValues[key as keyof Adven] = this.formGroup.get(key)?.value;
          }
        });

        if(changedValues.media){
          // Convertir base64 a Blob
          const base64Response = await fetch(changedValues.media);
          const blob = await base64Response.blob();
          const uploadedBlob = await lastValueFrom(this.mediaService.upload(blob));
          changedValues.media = uploadedBlob[0];
        } 
        
        await lastValueFrom(this.advenService.update(this.adven.id, changedValues));
        
        const toast = await this.toastController.create({
          message: await this.translateService.get('Actualizado correctamente').toPromise(),
          duration: 3000,
          position: 'bottom'
        });
        await toast.present();
      } catch (error) {
        console.error(error);
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
