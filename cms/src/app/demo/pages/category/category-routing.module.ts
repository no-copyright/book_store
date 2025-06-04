import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./list-category/list-category.component').then(c => c.ListCategoryComponent)
  },
  {
    path: 'add',
    loadComponent: () => import('./add-category/add-category.component').then(c => c.AddCategoryComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./edit-category/edit-category.component').then(c => c.EditCategoryComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryRoutingModule { }