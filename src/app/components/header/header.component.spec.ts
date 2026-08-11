import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { describe, it, expect, beforeEach } from 'vitest';
import { HeaderComponent } from './header.component';
import { CartService } from '../../services/cart.service';

describe('HeaderComponent', () => {
  let cartService: CartService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        CartService
      ]
    }).compileComponents();

    cartService = TestBed.inject(CartService);
  });

  it('debe renderizar el título de la cabecera', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const titleElement = compiled.querySelector('.navbar-title');
    expect(titleElement?.textContent?.trim()).toBe('Prueba Técnica');
  });

  it('debe mostrar el contador del carrito reactivamente', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const badgeElement = compiled.querySelector('.cart-badge');
    expect(badgeElement?.textContent?.trim()).toBe('0');
  });
});
