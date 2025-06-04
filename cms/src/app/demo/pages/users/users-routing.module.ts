import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./list-users/list-users.component').then(c => c.ListUsersComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./edit-user/edit-user.component').then(c => c.EditUserComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }