import { Directive, ElementRef, HostListener, Input, Renderer2, OnInit } from '@angular/core';

@Directive({
  selector: '[appHighlightHover]'
})
export class HighlightHoverDirective implements OnInit {
  @Input('appHighlightHover') highlightColor: string = '#f8f9fa';
  @Input() originalColor: string = 'white';

  constructor(private el: ElementRef, private renderer: Renderer2) {}
  
  ngOnInit() {
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'pointer');
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'all 0.3s ease');
    this.renderer.setStyle(this.el.nativeElement, 'position', 'relative');
    
    this.renderer.setStyle(this.el.nativeElement, 'background-color', this.originalColor);
    
    this.makeChildrenTransparent();
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.renderer.setStyle(this.el.nativeElement, 'background-color', this.highlightColor);
    
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(-5px) scale(1.02)');
    this.renderer.setStyle(this.el.nativeElement, 'box-shadow', '0 8px 25px rgba(128, 0, 128, 0.2)');
    this.renderer.setStyle(this.el.nativeElement, 'z-index', '10');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.renderer.setStyle(this.el.nativeElement, 'background-color', this.originalColor);
    
    this.renderer.removeStyle(this.el.nativeElement, 'transform');
    this.renderer.removeStyle(this.el.nativeElement, 'box-shadow');
    this.renderer.removeStyle(this.el.nativeElement, 'z-index');
  }

  private makeChildrenTransparent() {
    const childrenToMakeTransparent = [
      'ion-card-header',
      'ion-card-content', 
      '.card-actions',
      '.avatar-container',
      '.click-indicator',
      '.user-info'
    ];

    childrenToMakeTransparent.forEach(selector => {
      const children = this.el.nativeElement.querySelectorAll(selector);
      children.forEach((child: HTMLElement) => {
        this.renderer.setStyle(child, 'background', 'transparent');
        this.renderer.setStyle(child, 'background-color', 'transparent');
      });
    });

    const directChildren = this.el.nativeElement.children;
    for (let i = 0; i < directChildren.length; i++) {
      const child = directChildren[i];
      if (!child.tagName.toLowerCase().includes('img') && 
          !child.tagName.toLowerCase().includes('ion-avatar')) {
        this.renderer.setStyle(child, 'background', 'transparent');
      }
    }
  }
}