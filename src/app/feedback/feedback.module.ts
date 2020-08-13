import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FeedbackRoutingModule } from './feedback-routing.module';

import { FeedbackComponent } from './feedback.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {FileUploadModule} from 'ng2-file-upload';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FeedbackRoutingModule,
    NgbModule,
    FileUploadModule,
    NguiAutoCompleteModule
  ],
  declarations: [
    FeedbackComponent
  ]
})
export class FeedbackModule { }
