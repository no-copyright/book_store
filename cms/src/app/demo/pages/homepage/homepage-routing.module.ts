import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./list-homepage/list-homepage.component').then(c => c.ListHomepageComponent)
  },
  {
    path: 'edit',
    loadComponent: () => import('./edit-homepage/edit-homepage.component').then(c => c.EditHomepageComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomepageRoutingModule { }