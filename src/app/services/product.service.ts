import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { Product, ProductDetail } from '../models/product.model';

// estructura para guardar los datos con su fecha de guardado
interface CacheItem<T> {
  data: T;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://itx-frontend-test.onrender.com/api';

  // 1 hora de expiracion en milisegundos (60 min * 60 seg * 1000 ms)
  private readonly CACHE_DURATION_MS = 1000 * 60 * 60;

  // obtener listado de productos (con cache de 1 hora)
  getProducts(): Observable<Product[]> {
    const cacheKey = 'products_list';
    const cached = this.getFromCache<Product[]>(cacheKey);

    // si tenemos datos validos en cache, los devolvemos sin llamar a la api
    if (cached) {
      console.log('[CACHE] Listado de productos cargado desde localStorage');
      return of(cached);
    }

    // si no hay cache o ha expirado, llamamos a la api y guardamos
    console.log('[API] Obteniendo listado de productos desde la API');
    return this.http.get<Product[]>(`${this.baseUrl}/product`).pipe(
      tap(products => this.saveToCache(cacheKey, products))
    );
  }

  // obtener detalle de un producto (con cache de 1 hora por id)
  getProductById(id: string): Observable<ProductDetail> {
    const cacheKey = `product_${id}`;
    const cached = this.getFromCache<ProductDetail>(cacheKey);

    if (cached) {
      console.log(`[CACHE] Detalle del producto ${id} cargado desde localStorage`);
      return of(cached);
    }

    console.log(`[API] Obteniendo detalle del producto ${id} desde la API`);
    return this.http.get<ProductDetail>(`${this.baseUrl}/product/${id}`).pipe(
      tap(product => this.saveToCache(cacheKey, product))
    );
  }

  // leer de localStorage comprobando que no haya pasado mas de 1 hora
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

  // guardar en localStorage con la hora actual
  private saveToCache<T>(key: string, data: T): void {
    try {
      const item: CacheItem<T> = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error('Error al guardar en cache local', error);
    }
  }
}
