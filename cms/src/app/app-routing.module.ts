import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: '/auth/signin',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./demo/dashboard/dashboard.component').then((c) => c.DashboardComponent)
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./demo/extra/sample-page/sample-page.component')
      },
      {
        path: 'product',
        loadChildren: () => import('./demo/pages/product/product.module').then((m) => m.ProductModule)
      },
      {
        path: 'order',
        loadChildren: () => import('./demo/pages/order/order.module').then((m) => m.OrderModule)
      },
      {
        path: 'article',
        loadChildren: () => import('./demo/pages/article/article.module').then((m) => m.ArticleModule)
      },
      {
        path: 'category',
        loadChildren: () => import('./demo/pages/category/category.module').then((m) => m.CategoryModule)
      },
      {
        path: 'users',  
        loadChildren: () => import('./demo/pages/users/users.module').then((m) => m.UsersModule)
      },
      {
        path: 'evaluate',
        loadChildren: () => import('./demo/pages/evaluate/evaluate.module').then((m) => m.EvaluateModule)
      },
      {
        path: 'homepage',
        loadChildren: () => import('./demo/pages/homepage/homepage.module').then((m) => m.HomepageModule)
      },
      {
        path: 'request-consultation',
        loadChildren: () => import('./demo/pages/request-consultation/request-consultation.module').then((m) => m.RequestConsultationModule)
      }
    ]
  },
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'auth',
        loadChildren: () => import('./demo/pages/authentication/authentication.module').then((m) => m.AuthenticationModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
