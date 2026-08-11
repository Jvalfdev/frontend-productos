import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  imports: [RouterLink],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  private readonly productService = inject(ProductService);

  // estado reactivo con signals
  readonly products = signal<Product[]>([]);
  readonly searchTerm = signal<string>('');
  readonly loading = signal<boolean>(true);
  readonly error = signal<string | null>(null);

  // lista filtrada calculada en tiempo real segun el buscador
  readonly filteredProducts = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const list = this.products();

    if (!term) {
      return list;
    }

    // filtrar si coincide en la marca o en el modelo
    return list.filter(p =>
      p.brand.toLowerCase().includes(term) ||
      p.model.toLowerCase().includes(term)
    );
  });

  ngOnInit(): void {
    this.loadProducts();
  }

  // cargar productos desde el servicio (con soporte de cache 1h)
  private loadProducts(): void {
    this.loading.set(true);
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar productos', err);
        this.error.set('No se pudieron cargar los productos. Inténtalo más tarde.');
        this.loading.set(false);
      }
    });
  }

  // actualizar el signal del buscador cuando el usuario escribe
  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }
}
