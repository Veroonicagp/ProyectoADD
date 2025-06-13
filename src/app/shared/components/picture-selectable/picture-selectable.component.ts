import { Component, Input, OnDestroy, OnInit, ViewChild, forwardRef, Injector, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { ModalController, ActionSheetController, PopoverController, AlertController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { Camera, CameraResultType, CameraSource, CameraDirection } from '@capacitor/camera';
import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { PictureOptionsComponent } from '../picture-options/picture-options.component';
import { CameraModalComponent } from '../camera-modal/camera-modal.component';

export const PICTURE_SELECTABLE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => PictureSelectableComponent),
  multi: true
};

export type PictureMode = 'profile' | 'activity';

@Component({
  selector: 'app-picture-selectable',
  templateUrl: './picture-selectable.component.html',
  styleUrls: ['./picture-selectable.component.scss'],
  providers:[PICTURE_SELECTABLE_VALUE_ACCESSOR]
})
export class PictureSelectableComponent implements OnInit, ControlValueAccessor, OnDestroy {

  private _picture = new BehaviorSubject("");
  public picture$ = this._picture.asObservable();
  isDisabled:boolean = false;
  hasValue:boolean = false;
  hasCameraFeature: boolean = false;

  @Input() mode: PictureMode = 'profile';
  @Output() onImageChanged = new EventEmitter<void>();

  get isActivityMode(): boolean {
    return this.mode === 'activity';
  }

  get defaultImage(): string {
    return this.mode === 'activity' ? 'assets/imgs/aventura.png' : 'assets/imgs/perfil.jpg';
  }

  get isDefaultImage(): boolean {
    const currentPicture = this._picture.value;
    
    if (this.mode === 'activity') {
      return !currentPicture || 
             currentPicture === '' || 
             currentPicture === 'assets/imgs/aventura.png';
    } else {
      return !currentPicture || 
             currentPicture === '' || 
             currentPicture === 'assets/imgs/perfil.jpg';
    }
  }

  private onTouched = () => {};
  private ngControl: NgControl | null = null;

  constructor(
    private pictureModal: ModalController,
    private platform: Platform,
    private actionSheetCtrl: ActionSheetController,
    private popoverCtrl: PopoverController,
    private alertCtrl: AlertController,
    private injector: Injector
  ) {
    this.checkCameraAvailability();
  }

  ngOnDestroy(): void {
    this._picture.complete();
  }

  ngOnInit() {
    try {
      this.ngControl = this.injector.get(NgControl, null);
    } catch (e) {
      this.ngControl = null;
    }
    
    if (this.mode === 'activity' && !this._picture.value) {
      this._picture.next('assets/imgs/aventura.png');
    }
  }

  propagateChange = (obj: any) => {
  }

  writeValue(obj: any): void {
    if (this.mode === 'activity') {
      if (obj && obj.length > 0 && obj !== 'assets/imgs/aventura.png') {
        this.hasValue = true;
        this._picture.next(obj);
      } else {
        this.hasValue = false;
        this._picture.next('assets/imgs/aventura.png');
      }
    } else {
      if (obj && obj.length > 0) {
        this.hasValue = true;
        this._picture.next(obj);
      } else {
        this.hasValue = false;
        this._picture.next('');
      }
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  changePicture(picture: string) {
    if (this.mode === 'activity') {
      this.hasValue = picture !== '' && picture !== 'assets/imgs/aventura.png';
    } else {
      this.hasValue = picture !== '';
    }
    
    this._picture.next(picture);
    this.propagateChange(picture);
    this.onTouched();
    
    if (this.ngControl?.control) {
      this.ngControl.control.markAsDirty();
      this.ngControl.control.markAsTouched();
    }
    
    this.onImageChanged.emit();
  }

  onChangePicture(event:Event, fileLoader:HTMLInputElement){
    event.stopPropagation();
    fileLoader.onchange = ()=>{
      if(fileLoader.files && fileLoader.files?.length>0){
        var file = fileLoader.files[0];
        var reader = new FileReader();
        reader.onload = () => {
          this.changePicture(reader.result as string);
        };
        reader.onerror = (error) =>{
          console.log(error);
        }
        reader.readAsDataURL(file);
      }
    }
    fileLoader.click();
  }

  async onDeletePicture(event: Event) {
    event.stopPropagation();
    
    const alert = await this.alertCtrl.create({
      header: 'Eliminar foto',
      message: '¿Estás seguro de que quieres eliminar esta foto?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            if (this.mode === 'activity') {
              this.changePicture('assets/imgs/aventura.png');
            } else {
              this.changePicture('');
            }
            
            this.onImageChanged.emit();
          }
        }
      ]
    });

    await alert.present();
  }

  close(){
    this.pictureModal?.dismiss();
  }

  private async checkCameraAvailability() {
    if (Capacitor.isNativePlatform()) {
      try {
        const permission = await Camera.checkPermissions();
        
        if (permission.camera === 'granted') {
          this.hasCameraFeature = true;
        } else if (permission.camera === 'prompt' || permission.camera === 'prompt-with-rationale') {
          const requestResult = await Camera.requestPermissions();
          this.hasCameraFeature = requestResult.camera === 'granted';
        } else {
          this.hasCameraFeature = false;
        }
      } catch (error) {
        console.error('Error verificando permisos móvil:', error);
        this.hasCameraFeature = false;
      }
    } else {
      try {
        if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
          this.hasCameraFeature = true;
        } else {
          this.hasCameraFeature = false;
        }
      } catch (error) {
        console.error('Error verificando cámara web:', error);
        this.hasCameraFeature = false;
      }
    }
  }

  async presentPictureOptions(event: Event, fileLoader: HTMLInputElement) {
    event.stopPropagation();
    
    const buttons = [];
    
    if (this.mode === 'profile' && this.hasCameraFeature) {
      buttons.push({
        text: 'Tomar foto',
        icon: 'camera',
        handler: () => {
          this.takePicture();
        }
      });
    }
    
    buttons.push({
      text: 'Seleccionar de galería',
      icon: 'image',
      handler: () => {
        this.onChangePicture(event, fileLoader);
      }
    });
    
    buttons.push({
      text: 'Cancelar',
      icon: 'close',
      role: 'cancel'
    });

    if (window.innerHeight < window.innerWidth) {
      const popover = await this.popoverCtrl.create({
        component: PictureOptionsComponent,
        componentProps: {
          mode: this.mode,
          hasCameraFeature: this.hasCameraFeature
        },
        event: event,
        alignment: 'center',
        translucent: true,
        size: 'auto'
      });
      await popover.present();
      const { data } = await popover.onDidDismiss();
      
      if (data === 'camera') {
        this.takePicture();
      } else if (data === 'gallery') {
        this.onChangePicture(event, fileLoader);
      }
    } else {
      const actionSheet = await this.actionSheetCtrl.create({
        buttons: buttons
      });
      await actionSheet.present();
    }
  }

  async takePicture() {
    try {
      if (Capacitor.isNativePlatform()) {
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.Base64,
          source: CameraSource.Camera,
          direction: CameraDirection.Rear,
          presentationStyle: 'fullscreen'
        });
        
        if (image.base64String) {
          const dataUrl = `data:image/${image.format};base64,${image.base64String}`;
          this.changePicture(dataUrl);
        }
      } else {
        await this.takePictureWeb();
      }
    } catch (error) {
      console.error('Error al tomar foto:', error);
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      if (errorMessage.includes('cancelled') || errorMessage.includes('canceled') || errorMessage.includes('User cancelled')) {
        return;
      }
      
      this.showCameraError();
    }
  }

  private async takePictureWeb() {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia no está disponible');
      }

      const modal = await this.pictureModal.create({
        component: CameraModalComponent,
        componentProps: {
          onCapture: (imageData: string) => {
            this.changePicture(imageData);
          },
          onCancel: () => {
          }
        },
        cssClass: 'camera-modal'
      });

      await modal.present();

    } catch (error) {
      console.error('Error accediendo a la cámara:', error);
      
      const errorAlert = await this.alertCtrl.create({
        header: 'Error de cámara',
        message: 'No se pudo acceder a la cámara. ¿Quieres seleccionar una imagen de la galería?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: 'Abrir galería',
            handler: () => {
              this.useFileInputFallback();
            }
          }
        ]
      });
      
      await errorAlert.present();
    }
  }

  private async showCameraError() {
    const alert = await this.alertCtrl.create({
      header: 'Cámara no disponible',
      message: 'No se pudo acceder a la cámara. Esto puede deberse a permisos denegados o que el sitio no sea seguro (HTTPS). ¿Quieres seleccionar una imagen de la galería?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Abrir galería',
          handler: () => {
            this.useFileInputFallback();
          }
        }
      ]
    });
    
    await alert.present();
  }

  private useFileInputFallback() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    
    fileInput.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          this.changePicture(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
    
    fileInput.click();
  }
}