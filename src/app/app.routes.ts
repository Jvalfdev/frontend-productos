import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';

export const routes: Routes = [
  {
    path: '',
    component: ProductListComponent,
    title: 'Catálogo de Móviles',
  },
  {
    path: 'product/:id',
    loadComponent: () =>
      import('./components/product-detail/product-detail.component').then(
        (m) => m.ProductDetailComponent,
      ),
    title: 'Detalle de Producto',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
