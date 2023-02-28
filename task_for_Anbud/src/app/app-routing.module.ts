import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookDataComponent } from './book-data/book-data.component';

const routes: Routes = [
  { path: '', component: BookDataComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
