import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list-product',
    pathMatch: 'full'
  },
  {
    path: 'list-product',
    loadComponent: () => import('./list-product/list-product.component').then(c => c.ListProductComponent)
  },
  {
    path: 'add-product',
    loadComponent: () => import('./add-product/add-product.component').then(c => c.AddProductComponent)
  },
  {
    path: 'edit-product/:id',
    loadComponent: () => import('./edit-product/edit-product.component').then(c => c.EditProductComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }