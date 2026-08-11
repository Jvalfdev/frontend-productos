import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProductDetailComponent } from './product-detail.component';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ProductDetail } from '../../models/product.model';

describe('ProductDetailComponent', () => {
  let mockProductService: { getProductById: ReturnType<typeof vi.fn> };
  let mockCartService: { addToCart: ReturnType<typeof vi.fn> };

  const sampleDetail: ProductDetail = {
    id: '1',
    brand: 'Acer',
    model: 'Iconia Talk S',
    price: '170',
    imgUrl: 'https://test.com/1.jpg',
    cpu: 'Quad Core',
    ram: '2 GB',
    os: 'Android 6.0',
    displayResolution: '720 x 1280',
    battery: '3400 mAh',
    primaryCamera: ['13 MP', 'autofocus'],
    secondaryCmera: ['2 MP'],
    dimentions: '191.7 x 101 mm',
    weight: '260',
    options: {
      colors: [
        { code: 1000, name: 'Black' },
        { code: 1001, name: 'White' }
      ],
      storages: [
        { code: 2000, name: '16 GB' },
        { code: 2001, name: '32 GB' }
      ]
    }
  };

  beforeEach(async () => {
    mockProductService = {
      getProductById: vi.fn().mockReturnValue(of(sampleDetail))
    };

    mockCartService = {
      addToCart: vi.fn().mockReturnValue(of({ count: 1 }))
    };

    await TestBed.configureTestingModule({
      imports: [ProductDetailComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'id' ? '1' : null)
              }
            }
          }
        },
        { provide: ProductService, useValue: mockProductService },
        { provide: CartService, useValue: mockCartService }
      ]
    }).compileComponents();
  });

  it('debe cargar los detalles del producto y preseleccionar opciones por defecto', () => {
    const fixture = TestBed.createComponent(ProductDetailComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    expect(component.product()).toEqual(sampleDetail);
    expect(component.selectedColorCode()).toBe(1000);
    expect(component.selectedStorageCode()).toBe(2000);
  });

  it('debe permitir cambiar la seleccion de color y almacenamiento', () => {
    const fixture = TestBed.createComponent(ProductDetailComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;

    component.selectColor(1001);
    expect(component.selectedColorCode()).toBe(1001);

    component.selectStorage(2001);
    expect(component.selectedStorageCode()).toBe(2001);
  });

  it('debe llamar a CartService.addToCart al pulsar anadir al carrito', () => {
    const fixture = TestBed.createComponent(ProductDetailComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    component.addToCart();

    expect(mockCartService.addToCart).toHaveBeenCalledWith({
      id: '1',
      colorCode: 1000,
      storageCode: 2000
    });
  });
});
