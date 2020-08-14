import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule,  
  MatFormFieldModule
} from '@angular/material';

import { routing } from './app.routing';
import { AppComponent } from './app.component';

import { Configuration } from './app.constants';
import { PublicService } from './core/services/public/public.service';
import { LookupsService } from './core/services/lookups/lookup.service';
import { AuthService } from './core/services/common/auth.service';
import { CommonService } from './core/services/common/common.service';
import { FieldsService } from './core/services/fields/fields.service';
import { CommonDataService } from "./core/services/common/common-data.service";
import { FormdataService } from "./core/services/formdata/formdata.service";
import { FormsService } from "./core/services/forms/forms.service";
import { CompanySettingService } from "./core/services/admin/company-setting.service";
import { RoleService } from "./core/services/role/role.service";
import { LangresourceService } from "./core/services/langresource/langresource.service";
import { SafeHtmlPipe } from "./core/pipes/safehtml.pipe";

// Cloudinary module
import { Cloudinary } from 'cloudinary-core';
import { CloudinaryModule, CloudinaryConfiguration } from '@cloudinary/angular-5.x';
import { config } from './config';

const cloudinaryLib = {
  Cloudinary: Cloudinary
};


@NgModule({
  exports: [
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatFormFieldModule
  ]
})
export class MaterialModule {}


import {Injector} from '@angular/core';
import {setAppInjector} from './app-injector';


import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    routing,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    CloudinaryModule.forRoot(cloudinaryLib, config),
    MaterialModule,
    AngularMultiSelectModule
  ],
  declarations: [
    AppComponent,
    SafeHtmlPipe,
  ],
  providers: [
    Configuration,
    PublicService,
    LookupsService,
    AuthService,
    CommonService,
    FieldsService,
    CommonDataService,
    FormdataService,
    LangresourceService,
    FormsService,
    CompanySettingService,
    RoleService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(injector: Injector) {
    setAppInjector(injector);
  }
 }
