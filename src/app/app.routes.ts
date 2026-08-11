import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';

export const routes: Routes = [
  {
    path: '',
    component: ProductListComponent,
    title: 'Catálogo de Móviles'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
