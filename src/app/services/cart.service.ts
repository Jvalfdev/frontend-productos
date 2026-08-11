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

  // signal reactivo para el total de productos en el carrito
  private readonly _count = signal<number>(0);
  readonly count = this._count.asReadonly();

  // enviar producto al carrito
  addToCart(payload: AddToCartPayload): Observable<AddToCartResponse> {
    return this.http.post<AddToCartResponse>(this.apiUrl, payload).pipe(
      tap(response => {
        if (response && response.count) {
          // sumamos al contador actual lo que devuelve la api
          this._count.update(current => current + response.count);
        }
      })
    );
  }
}
