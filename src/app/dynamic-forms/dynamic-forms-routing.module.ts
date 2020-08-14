import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DynamicFormsComponent } from './dynamic-forms.component';

const routes: Routes = [
  { path: '', component: DynamicFormsComponent },
  { path: ':formid', component: DynamicFormsComponent}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class DynamicFormsRoutingModule { }
