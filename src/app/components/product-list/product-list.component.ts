import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  imports: [RouterLink],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  private readonly productService = inject(ProductService);

  readonly products = signal<Product[]>([]);
  readonly searchTerm = signal<string>('');
  readonly loading = signal<boolean>(true);
  readonly error = signal<string | null>(null);

  // filtrado en tiempo real por marca o modelo
  readonly filteredProducts = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const list = this.products();

    if (!term) {
      return list;
    }

    return list.filter(
      (p) => p.brand.toLowerCase().includes(term) || p.model.toLowerCase().includes(term),
    );
  });

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.loading.set(true);
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar productos', err);
        this.error.set('No se pudieron cargar los productos.');
        this.loading.set(false);
      },
    });
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }
}
