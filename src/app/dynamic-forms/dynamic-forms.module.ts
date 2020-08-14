import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DynamicFormsRoutingModule } from './dynamic-forms-routing.module';
import { DynamicFormsComponent } from './dynamic-forms.component';
import { FormBuilderComponent } from './form-builder/form-builder.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {FileUploadModule} from 'ng2-file-upload';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

import {MatDatepickerModule} from '@angular/material/datepicker';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DynamicFormsRoutingModule,
    NgbModule,
    FileUploadModule,
    NguiAutoCompleteModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgxIntlTelInputModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    AngularMultiSelectModule,
    MatSlideToggleModule,
    MatRadioModule
  ],
  declarations: [
    DynamicFormsComponent,
    FormBuilderComponent
  ],
  exports:[
    FormBuilderComponent
  ]
})
export class DynamicFormsModule { }
