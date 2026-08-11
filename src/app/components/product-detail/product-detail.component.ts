import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ProductDetail } from '../../models/product.model';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);

  // estado reactivo con signals
  readonly product = signal<ProductDetail | null>(null);
  readonly loading = signal<boolean>(true);
  readonly error = signal<string | null>(null);
  
  // variantes seleccionadas
  readonly selectedColorCode = signal<number | null>(null);
  readonly selectedStorageCode = signal<number | null>(null);

  // feedback al añadir al carrito
  readonly isAddingToCart = signal<boolean>(false);
  readonly addSuccessMessage = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProductDetail(id);
    } else {
      this.error.set('No se ha proporcionado un identificador de producto válido.');
      this.loading.set(false);
    }
  }

  // cargar el detalle del producto (con cache 1h)
  private loadProductDetail(id: string): void {
    this.loading.set(true);
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.product.set(data);
        this.loading.set(false);
        this.initializeDefaultSelections(data);
      },
      error: (err) => {
        console.error('Error al cargar detalle del producto', err);
        this.error.set('No se pudo cargar la información del producto.');
        this.loading.set(false);
      }
    });
  }

  // preseleccionar automaticamente si solo hay 1 opcion (requisito del PDF)
  private initializeDefaultSelections(product: ProductDetail): void {
    if (product.options?.colors?.length) {
      this.selectedColorCode.set(product.options.colors[0].code);
    }
    if (product.options?.storages?.length) {
      this.selectedStorageCode.set(product.options.storages[0].code);
    }
  }

  // cambiar color seleccionado
  selectColor(code: number): void {
    this.selectedColorCode.set(code);
  }

  // cambiar capacidad seleccionada
  selectStorage(code: number): void {
    this.selectedStorageCode.set(code);
  }

  // anadir al carrito
  addToCart(): void {
    const currentProduct = this.product();
    const colorCode = this.selectedColorCode();
    const storageCode = this.selectedStorageCode();

    if (!currentProduct || colorCode === null || storageCode === null) {
      return;
    }

    this.isAddingToCart.set(true);
    this.addSuccessMessage.set(null);

    this.cartService.addToCart({
      id: currentProduct.id,
      colorCode,
      storageCode
    }).subscribe({
      next: () => {
        this.isAddingToCart.set(false);
        this.addSuccessMessage.set('¡Producto añadido al carrito con éxito!');
        setTimeout(() => this.addSuccessMessage.set(null), 3000);
      },
      error: (err) => {
        console.error('Error al añadir al carrito', err);
        this.isAddingToCart.set(false);
      }
    });
  }

  // formatear arrays de camaras o texto
  formatCamera(camera: string | string[] | undefined): string {
    if (!camera) return 'No especificada';
    if (Array.isArray(camera)) return camera.join(', ');
    return camera;
  }
}
