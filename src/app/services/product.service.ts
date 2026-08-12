import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { Product, ProductDetail } from '../models/product.model';

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://itx-frontend-test.onrender.com/api';

  // ttl de 1 hora
  private readonly CACHE_DURATION_MS = 1000 * 60 * 60;

  getProducts(): Observable<Product[]> {
    const cacheKey = 'products_list';
    const cached = this.getFromCache<Product[]>(cacheKey);

    if (cached) {
      return of(cached);
    }

    return this.http
      .get<Product[]>(`${this.baseUrl}/product`)
      .pipe(tap((products) => this.saveToCache(cacheKey, products)));
  }

  getProductById(id: string): Observable<ProductDetail> {
    const cacheKey = `product_${id}`;
    const cached = this.getFromCache<ProductDetail>(cacheKey);

    if (cached) {
      return of(cached);
    }

    return this.http
      .get<ProductDetail>(`${this.baseUrl}/product/${id}`)
      .pipe(tap((product) => this.saveToCache(cacheKey, product)));
  }

  private getFromCache<T>(key: string): T | null {
    try {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) return null;

      const item: CacheItem<T> = JSON.parse(itemStr);
      const isExpired = Date.now() - item.timestamp > this.CACHE_DURATION_MS;

      if (isExpired) {
        localStorage.removeItem(key);
        return null;
      }

      return item.data;
    } catch {
      return null;
    }
  }

  private saveToCache<T>(key: string, data: T): void {
    try {
      const item: CacheItem<T> = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error('Error al guardar en cache local', error);
    }
  }
}
