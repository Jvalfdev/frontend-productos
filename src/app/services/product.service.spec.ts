import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ProductService } from './product.service';
import { Product, ProductDetail } from '../models/product.model';

describe('ProductService', () => {
  let service: ProductService;
  let httpTesting: HttpTestingController;
  let storage: Record<string, string> = {};

  const mockProducts: Product[] = [
    {
      id: '1',
      brand: 'Acer',
      model: 'Iconia',
      price: '170',
      imgUrl: 'https://test.com/1.jpg',
    },
  ];

  const mockDetail: ProductDetail = {
    id: '1',
    brand: 'Acer',
    model: 'Iconia',
    price: '170',
    imgUrl: 'https://test.com/1.jpg',
    cpu: 'Quad Core',
    ram: '2 GB',
    options: {
      colors: [{ code: 1000, name: 'Black' }],
      storages: [{ code: 2000, name: '16 GB' }],
    },
  };

  beforeEach(() => {
    storage = {};
    const mockLocalStorage = {
      getItem: (key: string) => storage[key] ?? null,
      setItem: (key: string, value: string) => {
        storage[key] = value;
      },
      removeItem: (key: string) => {
        delete storage[key];
      },
      clear: () => {
        storage = {};
      },
    };

    Object.defineProperty(globalThis, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
      configurable: true,
    });

    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), ProductService],
    });

    service = TestBed.inject(ProductService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('debe obtener la lista de productos desde la API y guardarla en localStorage', () => {
    service.getProducts().subscribe((products) => {
      expect(products.length).toBe(1);
      expect(products[0].brand).toBe('Acer');
    });

    const req = httpTesting.expectOne('https://itx-frontend-test.onrender.com/api/product');
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);

    // verificar que se guardo en cache
    const cachedItem = globalThis.localStorage.getItem('products_list');
    expect(cachedItem).not.toBeNull();
  });

  it('debe devolver los productos desde localStorage si la cache es menor a 1 hora sin llamar a la API', () => {
    // preparar cache valida
    globalThis.localStorage.setItem(
      'products_list',
      JSON.stringify({
        data: mockProducts,
        timestamp: Date.now(),
      }),
    );

    service.getProducts().subscribe((products) => {
      expect(products.length).toBe(1);
      expect(products[0].model).toBe('Iconia');
    });

    // no debe haber peticiones HTTP pendientes
    httpTesting.expectNone('https://itx-frontend-test.onrender.com/api/product');
  });

  it('debe obtener el detalle del producto y guardarlo en su cache individual', () => {
    service.getProductById('1').subscribe((detail) => {
      expect(detail.id).toBe('1');
      expect(detail.cpu).toBe('Quad Core');
    });

    const req = httpTesting.expectOne('https://itx-frontend-test.onrender.com/api/product/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockDetail);

    expect(globalThis.localStorage.getItem('product_1')).not.toBeNull();
  });
});
