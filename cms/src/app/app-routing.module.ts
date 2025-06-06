import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

// ✅ Import components
import { ListProductComponent } from './demo/pages/product/list-product/list-product.component';
import { AddProductComponent } from './demo/pages/product/add-product/add-product.component';
import { EditProductComponent } from './demo/pages/product/edit-product/edit-product.component';
import { ListUsersComponent } from './demo/pages/users/list-users/list-users.component';
import { EditUserComponent } from './demo/pages/users/edit-user/edit-user.component';
import { ListArticleComponent } from './demo/pages/article/list-article/list-article.component';
import { AddArticleComponent } from './demo/pages/article/add-article/add-article.component';
import { EditArticleComponent } from './demo/pages/article/edit-article/edit-article.component';
import { ListCategoryComponent } from './demo/pages/category/list-category/list-category.component';
import { AddCategoryComponent } from './demo/pages/category/add-category/add-category.component';
import { EditCategoryComponent } from './demo/pages/category/edit-category/edit-category.component';
import { ListConsultationComponent } from './demo/pages/request-consultation/list-consultation/list-consultation.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: '/product/list-product',
        pathMatch: 'full'
      },
      // ✅ LOẠI BỎ dashboard route
      // {
      //   path: 'dashboard',
      //   loadComponent: () => import('./demo/dashboard/dashboard.component').then((c) => c.DashboardComponent),
      //   canActivate: [AuthGuard]
      // },
      
      // ✅ Product module - ADMIN và STAFF
      {
        path: 'product',
        canActivate: [AuthGuard],
        children: [
          { path: '', redirectTo: 'list-product', pathMatch: 'full' },
          { path: 'list-product', component: ListProductComponent },
          { path: 'add-product', component: AddProductComponent },
          { path: 'edit-product/:id', component: EditProductComponent }
        ]
      },
      // ✅ Order module - ADMIN và STAFF
      {
        path: 'order',
        canActivate: [AuthGuard],
        children: [
          { path: '', redirectTo: 'list-order', pathMatch: 'full' },
          {
            path: 'list-order',
            loadComponent: () => import('./demo/pages/order/list-order/list-order.component').then(c => c.ListOrderComponent)
          },
          {
            path: 'order-detail/:id',
            loadComponent: () => import('./demo/pages/order/order-detail/order-detail.component').then(c => c.OrderDetailComponent)
          }
        ]
      },
      // ✅ Category module - ADMIN và STAFF
      {
        path: 'category',
        canActivate: [AuthGuard],
        children: [
          { path: '', redirectTo: 'list-category', pathMatch: 'full' },
          { path: 'list-category', component: ListCategoryComponent },
          { path: 'add-category', component: AddCategoryComponent },
          { path: 'edit-category/:id', component: EditCategoryComponent } // ✅ ĐÚNG ROUTE
        ]
      },
      // ✅ Article module - ADMIN và STAFF
      {
        path: 'article',
        canActivate: [AuthGuard],
        children: [
          { path: '', redirectTo: 'list-article', pathMatch: 'full' },
          { path: 'list-article', component: ListArticleComponent },
          { path: 'add-article', component: AddArticleComponent },
          { path: 'edit-article/:id', component: EditArticleComponent }
        ]
      },
      // ✅ Consultation module - ADMIN và STAFF
      {
        path: 'request-consultation',
        canActivate: [AuthGuard],
        children: [
          { path: '', redirectTo: 'list-consultation', pathMatch: 'full' },
          { path: 'list-consultation', component: ListConsultationComponent }
        ]
      },
      // ✅ Users module - CHỈ ADMIN
      {
        path: 'users',
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['ADMIN'] },
        children: [
          { path: '', redirectTo: 'list', pathMatch: 'full' },
          { path: 'list', component: ListUsersComponent },
          { path: 'edit/:id', component: EditUserComponent }
        ]
      }
    ]
  },
  {
    path: 'auth',
    children: [
      { path: '', redirectTo: 'signin', pathMatch: 'full' },
      { 
        path: 'signin', 
        loadComponent: () => import('./demo/pages/authentication/auth-signin/auth-signin.component')
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/auth/signin'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
