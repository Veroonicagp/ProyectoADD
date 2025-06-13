import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-camera-modal',
  templateUrl: './camera-modal.component.html',
  styleUrls: ['./camera-modal.component.scss'],
})
export class CameraModalComponent implements OnInit, OnDestroy {
  @Input() onCapture!: (imageData: string) => void;
  @Input() onCancel!: () => void;
  
  private stream!: MediaStream;
  private video!: HTMLVideoElement;

  constructor(private modalCtrl: ModalController) {}

  async ngOnInit() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      setTimeout(() => {
        this.video = document.querySelector('.camera-video') as HTMLVideoElement;
        if (this.video) {
          this.video.srcObject = this.stream;
        }
      }, 100);

    } catch (error) {
      console.error('Error accediendo a la cámara:', error);
      this.cancel();
    }
  }

  capturePhoto() {
    if (!this.video || !this.stream) return;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = this.video.videoWidth;
    canvas.height = this.video.videoHeight;

    context?.drawImage(this.video, 0, 0);

    const dataURL = canvas.toDataURL('image/jpeg', 0.8);

    this.stopStream();
    
    if (this.onCapture) {
      this.onCapture(dataURL);
    }
    
    this.modalCtrl.dismiss();
  }

  cancel() {
    this.stopStream();
    if (this.onCancel) {
      this.onCancel();
    }
    this.modalCtrl.dismiss();
  }

  private stopStream() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
  }

  ngOnDestroy() {
    this.stopStream();
  }
}