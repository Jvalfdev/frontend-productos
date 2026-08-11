import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { CartService } from './cart.service';
import { AddToCartPayload } from '../models/product.model';

describe('CartService', () => {
  let service: CartService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        CartService
      ]
    });

    service = TestBed.inject(CartService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('debe inicializar el contador del carrito en 0', () => {
    expect(service.count()).toBe(0);
  });

  it('debe enviar la peticion POST /api/cart y actualizar el signal del contador', () => {
    const payload: AddToCartPayload = {
      id: 'ZmGrkLRPXOTpxsU4jjAcv',
      colorCode: 1000,
      storageCode: 2000
    };

    service.addToCart(payload).subscribe(response => {
      expect(response.count).toBe(1);
    });

    const req = httpTesting.expectOne('https://itx-frontend-test.onrender.com/api/cart');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);

    req.flush({ count: 1 });

    expect(service.count()).toBe(1);
  });
});
