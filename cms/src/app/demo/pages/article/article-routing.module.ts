import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list-article',
    pathMatch: 'full'
  },
  {
    path: 'list-article',
    loadComponent: () => import('./list-article/list-article.component').then(c => c.ListArticleComponent)
  },
  {
    path: 'add-article',
    loadComponent: () => import('./add-article/add-article.component').then(c => c.AddArticleComponent)
  },
  {
    path: 'edit-article/:id',
    loadComponent: () => import('./edit-article/edit-article.component').then(c => c.EditArticleComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticleRoutingModule { }