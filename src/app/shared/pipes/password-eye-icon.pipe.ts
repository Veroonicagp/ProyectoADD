import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'passwordEyeIcon'
})
export class PasswordEyeIconPipe implements PipeTransform {
  transform(isVisible: boolean): string {
    return isVisible ? 'eye-off-outline' : 'eye-outline';
  }
}