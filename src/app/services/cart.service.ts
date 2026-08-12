import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AddToCartPayload, AddToCartResponse } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://itx-frontend-test.onrender.com/api/cart';
  private readonly CART_STORAGE_KEY = 'cart_count';

  // estado del carrito persistido en localstorage
  private readonly _count = signal<number>(this.getSavedCartCount());
  readonly count = this._count.asReadonly();

  private getSavedCartCount(): number {
    try {
      const saved = localStorage.getItem(this.CART_STORAGE_KEY);
      return saved ? parseInt(saved, 10) || 0 : 0;
    } catch {
      return 0;
    }
  }

  // anadir producto y actualizar contador
  addToCart(payload: AddToCartPayload): Observable<AddToCartResponse> {
    return this.http.post<AddToCartResponse>(this.apiUrl, payload).pipe(
      tap(response => {
        if (response && response.count) {
          this._count.update(current => {
            const newTotal = current + response.count;
            try {
              localStorage.setItem(this.CART_STORAGE_KEY, newTotal.toString());
            } catch (e) {
              console.error('Error al persistir contador del carrito', e);
            }
            return newTotal;
          });
        }
      })
    );
  }
}
