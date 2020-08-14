import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseComponemntComponent } from './base-componemnt.component';
import { BaseLiteComponemntComponent } from './base-lite-componemnt/base-lite-componemnt.component';



@NgModule({
  declarations: [BaseComponemntComponent, BaseLiteComponemntComponent],
  imports: [
    CommonModule
  ]
})
export class BaseComponemntModule { }
