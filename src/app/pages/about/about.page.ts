import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/core/services/language.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  constructor(    
    public translate: TranslateService,
    private languageService: LanguageService,
  ) { }

  ngOnInit() {
  }

  changeLanguage() {
    const currentLang = this.translate.currentLang;
    const newLang = currentLang === 'en' ? 'es' : 'en';
    
    const languageBtn = document.querySelector('.corner-language-btn');
    if (languageBtn) {
      languageBtn.classList.add('changing');
      setTimeout(() => {
        languageBtn.classList.remove('changing');
      }, 600);
    }
    
    // Cambiar idioma
    this.translate.use(newLang);
    
    // Actualizar idioma almacenado
    this.languageService.storeLanguage(newLang);
    
    console.log(`Idioma cambiado a: ${newLang}`);
  }

  signOut(){
  }
}