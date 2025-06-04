import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./list-order/list-order.component').then(c => c.ListOrderComponent)
  },
  {
    path: 'list-order',
    loadComponent: () => import('./list-order/list-order.component').then(c => c.ListOrderComponent)
  },
  {
    path: 'order-detail/:id',
    loadComponent: () => import('./order-detail/order-detail.component').then(c => c.OrderDetailComponent)
  },
  // ✅ Alternative routing patterns
  {
    path: 'detail/:id',
    redirectTo: 'order-detail/:id'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }