import { ElementRef, Renderer2 } from '@angular/core';
import { HighlightHoverDirective } from './high-light-hover.directive';

describe('HighlightHoverDirective', () => {
  it('should create an instance', () => {
    // Crear mocks simples para las dependencias
    const mockElementRef = { nativeElement: {} } as ElementRef;
    const mockRenderer = {
      setStyle: jasmine.createSpy('setStyle'),
      removeStyle: jasmine.createSpy('removeStyle')
    } as unknown as Renderer2;

    const directive = new HighlightHoverDirective(mockElementRef, mockRenderer);
    expect(directive).toBeTruthy();
  });
});