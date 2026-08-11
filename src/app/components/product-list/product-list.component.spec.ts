import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

describe('ProductListComponent', () => {
  let mockProductService: { getProducts: ReturnType<typeof vi.fn> };

  const sampleProducts: Product[] = [
    { id: '1', brand: 'Acer', model: 'Iconia Talk S', price: '170', imgUrl: 'https://test.com/1.jpg' },
    { id: '2', brand: 'Apple', model: 'iPhone 13', price: '800', imgUrl: 'https://test.com/2.jpg' },
    { id: '3', brand: 'Samsung', model: 'Galaxy S21', price: '750', imgUrl: 'https://test.com/3.jpg' }
  ];

  beforeEach(async () => {
    mockProductService = {
      getProducts: vi.fn().mockReturnValue(of(sampleProducts))
    };

    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [
        provideRouter([]),
        { provide: ProductService, useValue: mockProductService }
      ]
    }).compileComponents();
  });

  it('debe cargar los productos al iniciar', () => {
    const fixture = TestBed.createComponent(ProductListComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    expect(component.products().length).toBe(3);
    expect(component.loading()).toBe(false);
  });

  it('debe filtrar en tiempo real por marca o modelo', () => {
    const fixture = TestBed.createComponent(ProductListComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    
    // filtrar por 'apple'
    component.searchTerm.set('apple');
    expect(component.filteredProducts().length).toBe(1);
    expect(component.filteredProducts()[0].brand).toBe('Apple');

    // filtrar por modelo 'galaxy'
    component.searchTerm.set('galaxy');
    expect(component.filteredProducts().length).toBe(1);
    expect(component.filteredProducts()[0].model).toBe('Galaxy S21');

    // limpiar filtro
    component.searchTerm.set('');
    expect(component.filteredProducts().length).toBe(3);
  });
});
