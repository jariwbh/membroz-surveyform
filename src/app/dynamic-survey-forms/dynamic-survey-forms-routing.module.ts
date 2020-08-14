import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DynamicSurveyFormsComponent } from './dynamic-survey-forms.component';

const routes: Routes = [
  { path: '', component: DynamicSurveyFormsComponent },
  { path: ':formid', component: DynamicSurveyFormsComponent}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class DynamicSurveyFormsRoutingModule { }

