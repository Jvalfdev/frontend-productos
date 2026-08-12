import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

/**
 * Componente de cabecera global con título de la tienda y contador reactivo del carrito.
 */
@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private readonly cartService = inject(CartService);

  // signal del contador del carrito
  readonly cartCount = this.cartService.count;
}
