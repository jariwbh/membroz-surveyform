
import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild, ViewChildren, AfterViewInit, AfterViewChecked , ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { Http, Headers } from '@angular/http';

import {
  BasicValidators, ValidUrlValidator, OnlyNumberValidator, ValidMobileNumberValidator, OnlyNumberOrDecimalValidator,
  ValidPercValidator, equalValidator, matchingPasswords
} from '../../core/components/basicValidators';

import { overEighteen } from '../../core/components/over-eighteen.validator';

import { FileUploader, FileUploaderOptions, ParsedResponseHeaders } from 'ng2-file-upload';
import { Cloudinary } from '@cloudinary/angular-5.x';

import { BaseLiteComponemntComponent } from '../../base-componemnt/base-lite-componemnt/base-lite-componemnt.component';

import * as moment from 'moment';

import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';

declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.css']
})
export class FormBuilderComponent extends BaseLiteComponemntComponent implements OnInit {

  @ViewChild('formtext', { static: false }) inputEl: ElementRef;

  _sectionLists: any[] = [];
  _groups: any[] = [];
  _groupLists: any[] = [];
  _groupAddedValue: any[] = [];

  dynamicForm: FormGroup;
  dynamicSubmitted: boolean;

  _labelSubmit: string;

  uploader: FileUploader;
  response: any[] = [];
  private title: string;
  customeUploader: any[] = [];

  formImageArray: any[] = [];
  groupformImageArray: any [] = [];
  _groupSelectedImage: any[] = [];
  
  quickfromstyle = "single";
  quickformschemaname = "users";

  deleteobj: any;
  ishidedeletebutton = false;

  Texts = {
    singleSelection: false,
    text: "Select Item",
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    badgeShowLimit: 5,
    classes: "myclass custom-class"
  };

  _loginUserRole: any;
  wfpermission: any;

   _wfpermissionlabelSubmit: any;
   isdisablesavebutton: boolean = false;
   reason: any;

   form: FormGroup;
   submitted: boolean;

   recprdEligibilityForWfPermission: boolean = false;

   _loginUserId: any;

    minDate: Date;
    maxDate: Date;

    allowedFileType = [ "xlsx", "xls", "doc", "docx", "ppt", "pptx", "csv", "pdf", "jpg", "jpeg", "gif", "png", "tif", "tiff" ]
    maxFileSize = 5 * 1024 * 1024;

    separateDialCode = true;
    SearchCountryField = SearchCountryField;
    TooltipLabel = TooltipLabel;
    CountryISO = CountryISO;
    preferredCountries: CountryISO[] = [CountryISO.India, CountryISO.UnitedStates, CountryISO.UnitedKingdom];

    startDate = new Date();

  constructor(
    private fb: FormBuilder,
    private _route: ActivatedRoute,
    private cloudinary: Cloudinary,
    private cdr: ChangeDetectorRef
  ) {

    super();
  }

  @Input('totalNumberOfTabs') totalNumberOfTabsValue: string;
  @Input('tabNumber') tabNumberValue: string;
  @Input('tabData') tabDataValue: any[] = [];
  @Input('formsModel') formsModelValue: any[] = [];
  @Input('allUsersLists') allUsersListsValue: any[] = [];
  @Input('allRolesLists') allRolesListsValue: any[] = [];
  
  @Input('inBuildlookupLists') inBuildlookupListsValue: any[] = [];
  @Input('defaultLanguage') defaultLanguage: any;
  @Input('langVisibility') langVisibility: any;
  @Input('langResource') langResource: any;
  @Input('gDateFormat') gDateFormat: any;
  @Input('isdisablesavebutton') isdisablesavebuttonValue: any = false;

  @Output() childSubmitData: EventEmitter<any> = new EventEmitter<any>();
  @Output() disabledDirtyForm: EventEmitter<any> = new EventEmitter<any>();

  async ngOnInit() {

    await super.ngOnInit();


    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 100, 0, 1);
    this.maxDate = new Date(currentYear + 100, 11, 31);

    this.getRoleDetail();

    this.recprdEligibilityForWfPermission = false;

    this.title = '';

    
    this.ishidedeletebutton = true;
    if (this.totalNumberOfTabsValue == this.tabNumberValue) {
      this._labelSubmit = "Save";
    } else {
      this._labelSubmit = "Save & Next";
    }
    

    this._sectionLists = this.groupBy(this.tabDataValue[0], 'sectionname');

    

    this._sectionLists.forEach(ele => {
      ele.forEach(element => {

        if (element.groupname) {
          this._groups.push(element);
        }

        if (element.fieldtype == "slide_toggle") {
          element.value = false;
        } else  if (element.fieldtype == "image" || element.fieldtype == "multi_image" || element.fieldtype == "attachment") {

          if (!this.formImageArray[element.fieldname]) {
            this.formImageArray[element.fieldname] = [];
          }

          

        } else if (element.fieldtype == 'radio') {
          if (element.value == null) {
            if (element.lookupdata.length !== 0) {
              element.lookupdata.forEach(elelookup => {
                if (elelookup.isDefault) {
                  element.value = elelookup.key;
                }
              });
            }
          }
        } else if (element.fieldtype == 'list') {
          if (element.value == null) {
            if (element.lookupdata.length !== 0) {
              element.lookupdata.forEach(elelookup => {
                if (elelookup.isDefault) {
                  element.value = elelookup.key;
                }
              });
            }
          }
        } else if (element.fieldtype == "lookup") {
          setTimeout(() => {
            if (element.value && element.inbuildlookupFieldValue) {

              element.inbuildlookupFieldValue.forEach(ele => {
                if (ele.id == element.value.toString()) {
                  element.value = {};
                  element.value = ele;
                }
              });
            }
          }, 2000);

        } else if (element.fieldtype == "form" || element.fieldtype == "formdata") {
          setTimeout(() => {
            if (element.value && element.formfieldfilterValue) {

              element.formfieldfilterValue.forEach(ele => {
                if (ele.id == element.value.toString()) {
                  element.value = {};
                  element.value = ele;
                }
              });
            }
          }, 3000);
        } else if (element.fieldtype == "form_multiselect") {        
          setTimeout(() => {
            let datalist = element.value;
            const formmultiselect: any[] = [];
            if (datalist && datalist.length != 0) {
              datalist.forEach(elemformfieldfilterValue => {
                if (element && element.formfieldfilterValue && element.formfieldfilterValue.length !== 0) {
                  element.formfieldfilterValue.forEach(e2 => { 
                    if (e2.id == elemformfieldfilterValue.id) {
                      formmultiselect.push(e2);
                    }
                  });
                }
              });
            }
            element.value = formmultiselect;

          }, 3000);
        } else if (element.fieldtype == "editor") {

          setTimeout(() => {

            $(function () {
              $('#summernote_' + element.fieldname).summernote({
                height: 250,   
                codemirror: { 
                  theme: 'monokai'
                }
              });
            });  

            if(element.value) {
              $('#summernote_' + element.fieldname).summernote('code', element.value);
            }

          }, 4000);
          
        } else if (element.fieldtype == "datepicker") {
          if(element.validationData && element.validationData == "dateOfBirthVal") {
            element.maxDate = new Date();
          }
        }
      });
    });

    if (this._groups.length !== 0) {
      this._groupLists = this.groupBy(this._groups, 'groupname');
    }

    this._groupLists.forEach(element => {
      this._groupAddedValue[element[0].groupname] = [];
    });

    setTimeout(() => {
      this.makeForm();
    }, 1000);

    this.imageConfigration();

    this.isdisablesavebutton = false;

    

  }

  ngAfterViewInit() {
    setTimeout(() => {

      if (this.inputEl != undefined) {
        if (this.inputEl.nativeElement[0] != undefined) {
          this.inputEl.nativeElement[0].focus();
          if (this.inputEl.nativeElement[0].autofocus != undefined) {
            this.inputEl.nativeElement[0].autofocus = true;
          }
        }
      }

      this.cdr.detectChanges();

    }, 2000);

    

  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  getRoleDetail() {

    if(this._loginUserRole && this._loginUserRole['permissions'] && this._loginUserRole['permissions'].length !== 0) {
      let cnt = 0;

      this._loginUserRole['permissions'].forEach(element => {

        if(element.formname == this.formsModelValue[0]['formname'] && element.wfpermission) {
          this.wfpermission = element.wfpermission;
          if(this.wfpermission == "approver") {
              this._wfpermissionlabelSubmit = "Approved";
            } else {
              this._wfpermissionlabelSubmit = "Reviewed";
            }
        }
      });
    }

    
  }

  imageConfigration() {

    this.tabDataValue[0].forEach(element => {

      if (element.fieldtype == 'image' || element.fieldtype == 'multi_image' || element.fieldtype == "attachment") {

        var auth_cloud_name = this._authService.auth_cloud_name ? this._authService.auth_cloud_name : this.cloudinary.config().cloud_name;

        const uploaderOptions: FileUploaderOptions = {
          url: `https://api.cloudinary.com/v1_1/${auth_cloud_name}/upload`,
          autoUpload: true,
          isHTML5: true,
          removeAfterUpload: true,
          headers: [
            {
              name: 'X-Requested-With',
              value: 'XMLHttpRequest'
            }
          ],
         // allowedFileType: element.allowedfiletype ? element.allowedfiletype : this.allowedFileType,
          //maxFileSize: element.maxfilesize ? element.maxfilesize : Number(this.maxFileSize)
          
        };
        let fieldname = element.fieldname;
        this.customeUploader[fieldname] = new FileUploader(uploaderOptions);

        this.customeUploader[fieldname].onBuildItemForm = (fileItem: any, form: FormData): any => {
          form.append('upload_preset', this.cloudinary.config().upload_preset);
          let tags = element.fieldname;

          if (this.title) {
            form.append('context', `photo=${element.fieldname}`);
            tags = element.fieldname;
          }
          form.append('tags', tags);
          form.append('file', fileItem);

          fileItem.withCredentials = false;
          return { fileItem, form };
        };

        const upsertResponse = fileItem => {

          $(".loading_" + element.fieldname).show();

          if (fileItem && fileItem.status == 200) {

            let fieldnameTags = fileItem.data.tags[0];

            if (!this.formImageArray[fieldnameTags]) {
              this.formImageArray[fieldnameTags] = [];
            }

            if (!this.groupformImageArray[fieldnameTags]) {
              this.groupformImageArray[fieldnameTags] = [];
            }

            if (!element.value) {
              element.value = "";
            }

            let extension: any;
            if (fileItem.file) {
              extension = fileItem.file.name.substr(fileItem.file.name.lastIndexOf('.') + 1);
            }

            let fileInfo = {
              attachment: fileItem.data.secure_url,
              extension: extension
            };

            this.formImageArray[fieldnameTags].push(fileInfo);
            this.groupformImageArray[fieldnameTags].push(fileInfo);

            

            element.value = fileItem.data.secure_url;

            

            $('#' + fieldnameTags).val(fileItem.data.secure_url);

            $(".loading_" + element.fieldname).hide();

          }

        };

        this.customeUploader[fieldname].onCompleteItem = (item: any, response: string, status: number, headers: ParsedResponseHeaders) =>
          upsertResponse(
            {
              file: item.file,
              status,
              data: JSON.parse(response)
            }
          );

        this.customeUploader[fieldname].onProgressItem = (fileItem: any, progress: any) =>
          upsertResponse(
            {
              file: fileItem.file,
              progress
            });

        this.customeUploader[fieldname].onWhenAddingFileFailed = (item: any, filter: any) => {
              let message = '';
              switch (filter.name) {
                case 'fileSize':
                  message = 'Warning ! \nThe uploaded file \"' + item.name + '\" is ' + this.formatBytes(item.size) + ', this exceeds the maximum allowed size of ' + this.formatBytes(element.maxfilesize ? element.maxfilesize : (Number(this.maxFileSize) * 1024 * 1024));
                  this.showNotification("top", "right", message, "danger");
                  break;
                default:
                  message = 'Error trying to upload file '+item.name;
                  this.showNotification("top", "right", message, "danger");
                  break;
              }
            };
      }

    });
  }

  formatBytes(bytes: any, decimals? : any) {
    if (bytes == 0) return '0 Bytes';
    const k = 1024,
      dm = decimals || 2,
      sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  makeForm() {
    const group: any = {};

    this._sectionLists.forEach(ele => {
      ele.forEach(element => {
        if (element.groupname) {
          group[element.fieldname] = new FormControl(null);
        } else {
          if (element.validationData) {
            if (element.validationData === 'requiredVal') {
              element.isAsterisk = true;
              if(element.fieldtype == "slide_toggle") {
                group[element.fieldname] = new FormControl(false, Validators.compose([Validators.requiredTrue]));
              } else {
                group[element.fieldname] = new FormControl(null, Validators.compose([Validators.required]));
              }
              

            } else if (element.validationData === 'emailVal') {
              
              if (element.isMandatory == "yes") {
                element.isAsterisk = true;
                group[element.fieldname] = new FormControl(null, Validators.compose([Validators.required, BasicValidators.email]));
              } else {
                group[element.fieldname] = new FormControl(null, Validators.compose([BasicValidators.email]));
              }
              
            } else if (element.validationData === 'urlVal') {
              
              if (element.isMandatory == "yes") {
                element.isAsterisk = true;
                group[element.fieldname] = new FormControl(null, Validators.compose([Validators.required, ValidUrlValidator.insertonlyvalidurl]));
              } else {
                group[element.fieldname] = new FormControl(null, Validators.compose([ValidUrlValidator.insertonlyvalidurl]));
              }

            } else if (element.validationData === 'onlyNumberVal') {
              
              if (element.isMandatory == "yes") {
                element.isAsterisk = true;
                group[element.fieldname] = new FormControl(null, Validators.compose([Validators.required, OnlyNumberValidator.insertonlynumber]));
              } else {
                group[element.fieldname] = new FormControl(null, Validators.compose([OnlyNumberValidator.insertonlynumber]));
              }
            } else if (element.validationData === 'mobileNumberVal') {
              
              if (element.isMandatory == "yes") {
                element.isAsterisk = true;
                group[element.fieldname] = new FormControl(null, Validators.compose([Validators.required, ValidMobileNumberValidator.onlyvalidmobilenumber]));
              } else {
                group[element.fieldname] = new FormControl(null, Validators.compose([ValidMobileNumberValidator.onlyvalidmobilenumber]));
              }
              
            } else if (element.validationData === 'onlyNumberOrDecimalVal') {
              
              if (element.isMandatory == "yes") {
                element.isAsterisk = true;
                group[element.fieldname] = new FormControl(null, Validators.compose([Validators.required, OnlyNumberOrDecimalValidator.insertonlynumberordecimal]));
              } else {
                group[element.fieldname] = new FormControl(null, Validators.compose([OnlyNumberOrDecimalValidator.insertonlynumberordecimal]));
              }
              
            } else if (element.validationData === 'validPercentVal') {
              if (element.isMandatory == "yes") {
                element.isAsterisk = true;
                group[element.fieldname] = new FormControl(null, Validators.compose([Validators.required, ValidPercValidator.insertonlyvalidperc]));
              } else {
                group[element.fieldname] = new FormControl(null, Validators.compose([ValidPercValidator.insertonlyvalidperc]));
              }
            } else if (element.validationData === 'dateOfBirthVal') {
              if (element.isMandatory == "yes") {
                element.isAsterisk = true;
                group[element.fieldname] = new FormControl(null, Validators.compose([Validators.required]));
              } else {
                group[element.fieldname] = new FormControl(null);
              }
            } else if (element.validationData === 'adultDateVal') {
              
              if (element.isMandatory == "yes") {
                element.isAsterisk = true;
                group[element.fieldname] = new FormControl(null, Validators.compose([Validators.required, overEighteen.overEighteen]));
              } else {
                group[element.fieldname] = new FormControl(null, Validators.compose([overEighteen.overEighteen]));
              }

            } else {
              group[element.fieldname] = new FormControl(null);
            }

          } else {
            if (element.isMandatory == "yes") {
              element.isAsterisk = true;
              if(element.fieldtype == "slide_toggle") {
                group[element.fieldname] = new FormControl(false, Validators.compose([Validators.requiredTrue]));
              } else {
                group[element.fieldname] = new FormControl(null, Validators.compose([Validators.required]));
              }
              
            } else {
              group[element.fieldname] = new FormControl(null);
            }
          }
        }

        if (element.fieldtype == 'lookup') {
          element.inbuildlookupFieldValue = [];
          element.inbuildlookupFieldValue = this.inBuildlookupListsValue[0][element.inbuildlookupField];
        }

      });
    });

    this.dynamicForm = this.fb.group(group);


    setTimeout(() => {
      if ($(".selectpicker").length != 0) {
        $(".selectpicker").selectpicker();
      }

      if ($(".tagsinput").length != 0) {
        $(".tagsinput").tagsinput();
      }

    }, 500);

  }

  groupBy(collection: any, property: any) {
    let i = 0, val, index,
      values = [], result = [];
    for (; i < collection.length; i++) {
      val = collection[i][property];
      index = values.indexOf(val);
      if (index > -1) {
        result[index].push(collection[i]);
      } else {
        values.push(val);
        result.push([collection[i]]);
      }
    }
    return result;
  }

  onDynamicFormSubmit(value: any, isValid: boolean) {


    this.dynamicSubmitted = true;
    this.isdisablesavebuttonValue = true;
    if (!isValid) {
      this.isdisablesavebuttonValue = false;
      this.showNotification('top', 'right', 'Validation failed!!!', 'danger');
      return false;
    } else {

      var groupValidationArray: any [] = [];
      
      this._sectionLists.forEach(ele => {
        ele.forEach(ele2 => {
          if (!ele2.groupname && ele2.fieldtype == 'checkbox') {
            if (ele2.lookupdata.length !== 0) {
              let cnt = 0;
              this.dynamicForm.value[ele2.fieldname] = [];
              ele2.lookupdata.forEach(e1 => {
                const isChecked = <HTMLInputElement>document.getElementById('check_' + ele2.fieldname + '_' + cnt);
                if (isChecked.checked == true) {
                  this.dynamicForm.value[ele2.fieldname].push(e1.key);
                }
                cnt++;
              });
            }
          } else if (!ele2.groupname && ele2.fieldtype == 'radio') {
            if (ele2.lookupdata.length !== 0) {
              let cnt = 0;
              ele2.lookupdata.forEach(e1 => {
                const isChecked = <HTMLInputElement>document.getElementById('radio_' + ele2.fieldname + '_' + cnt);
                if (isChecked.checked == true) {
                  this.dynamicForm.value[ele2.fieldname] = e1.key;
                }
                cnt++;
              });
            }
          } else if (!ele2.groupname && (ele2.fieldtype == 'lookup' || ele2.fieldtype == 'form' || ele2.fieldtype == 'form_multiselect' || ele2.fieldtype == 'formdata')) {
            if (this.dynamicForm.value[ele2.fieldname]) {
              if (this.dynamicForm.value[ele2.fieldname]['id']) {
                this.dynamicForm.value[ele2.fieldname] = this.dynamicForm.value[ele2.fieldname]['id'];
              } else {

                this._sectionLists.forEach(element => {
                  element.forEach(eleNew => {
                    if (eleNew.fieldname == ele2.fieldname) {
                      if (ele2.fieldtype == 'lookup') {
                        if(eleNew.inbuildlookupFieldValue && eleNew.inbuildlookupFieldValue.length !== 0) {
                          eleNew.inbuildlookupFieldValue.forEach(e => {
                            if (e.name == this.dynamicForm.value[ele2.fieldname]) {
                              this.dynamicForm.value[ele2.fieldname] = e.id;
                            }
                          });
                        }
                      } else if (ele2.fieldtype == 'form_multiselect') {
                        let datalist = this.dynamicForm.value[ele2.fieldname];
                        var formmultiselectarr: any[] = [];
                        datalist.forEach(e2 => {
                          formmultiselectarr.push(e2.id);
                        });
                        this.dynamicForm.value[ele2.fieldname] = formmultiselectarr;
                      } else {
                        eleNew.formfieldfilterValue.forEach(e => {
                          if (e.name == this.dynamicForm.value[ele2.fieldname]) {
                            this.dynamicForm.value[ele2.fieldname] = e.id;
                          }
                        });
                      }
                    }
                  });

                });
              }
            }
          } else if (!ele2.groupname && (ele2.fieldtype == 'image' || ele2.fieldtype == 'multi_image' ||  ele2.fieldtype == 'attachment')) {
            for (let key in this.formImageArray) {
              if (key == ele2.fieldname) {
                this.dynamicForm.value[ele2.fieldname] = this.formImageArray[key];
              }
            }
          } else if (!ele2.groupname && (ele2.fieldtype == 'editor')) {
            this.dynamicForm.value[ele2.fieldname] = $('#summernote_' + ele2.fieldname).summernote('code');
          }

          if(ele2.groupname && ele2.groupvalidation) {

            var groupValidationObj = groupValidationArray.find(p => p.groupname == ele2.groupname);
            if(!groupValidationObj) {
              let obj = {
                groupname: ele2.groupname,
                groupvalidation: ele2.groupvalidation
              }
              groupValidationArray.push(obj);
            }
          }
          

        });
      });

      this.childSubmitData.emit(this.dynamicForm.value);
      console.log("this.dynamicForm.value", this.dynamicForm.value);

    }
  }

  uuid() {
    let uuid = '', i, random;
    for (i = 0; i < 32; i++) {
      random = Math.random() * 16 | 0;

      if (i == 8 || i == 12 || i == 16 || i == 20) {
        uuid += '-'
      }
      uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
    }
    return uuid;
  }

  removeImg(url: any, filedname: any) {

    for (const i in this.dynamicForm.value[filedname]) {
      if (this.dynamicForm.value[filedname][i] == url['attachment']) {
        this.dynamicForm.value[filedname].splice(i, 1);
      }
    }

    for (const key in this.formImageArray) {
      if (key == filedname) {
        this.formImageArray[key].forEach(element => {
          if (element == url) {
            this.formImageArray[key].splice(element, 1);
          }
        });

      }
    }

    for (const key in this.groupformImageArray) {
      if (key == filedname) {
        this.groupformImageArray[key].forEach(element => {
          if (element == url) {
            this.groupformImageArray[key].splice(element, 1);
          }
        });

      }
    }

    this._sectionLists.forEach(ele => {
      ele.forEach(element => {
        if(element.fieldname == filedname) {
          if(this.formImageArray[filedname].length == 0) {
            element.value = "";
          }
        }
      });
    });


    

  }

  autocompleListFormatter = (data: any): SafeHtml => {
    let html = `<span>${data.name}  </span>`;
    return html;
  }

  downloadlink(link: any) {
    window.open(link, '_blank');
    return true;
  }

}
