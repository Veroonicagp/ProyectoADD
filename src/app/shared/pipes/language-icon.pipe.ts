import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'languageIcon'
})
export class LanguageIconPipe implements PipeTransform {
  
  transform(langCode: string): string {
    switch (langCode) {
      case 'es':
        return '🇪🇸';
      case 'en':
        return '🇺🇸';
      default:
        return '🌐';
    }
  }
}

@Pipe({
  name: 'languageIonicIcon'
})
export class LanguageIonicIconPipe implements PipeTransform {
  
  transform(langCode: string): string {
    switch (langCode) {
      case 'es':
        return 'language-outline';
      case 'en':
        return 'globe-outline';
      default:
        return 'earth-outline';
    }
  }
}