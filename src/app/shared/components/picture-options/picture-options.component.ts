import { Component, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-picture-options',
  templateUrl: './picture-options.component.html'
})
export class PictureOptionsComponent {
  @Input() mode: 'profile' | 'activity' = 'profile';
  @Input() hasCameraFeature: boolean = false;

  get showCamera(): boolean {
    return this.mode === 'profile' && this.hasCameraFeature;
  }

  constructor(private popoverCtrl: PopoverController) {}

  onOption(option: string) {
    this.popoverCtrl.dismiss(option);
  }
}