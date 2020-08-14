
import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild, ViewChildren, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { CommonService } from '../../core/services/common/common.service';

import {
  BasicValidators, ValidUrlValidator, OnlyNumberValidator, ValidMobileNumberValidator, OnlyNumberOrDecimalValidator,
  ValidPercValidator, equalValidator, matchingPasswords
} from '../../core/components/basicValidators';

import { FileUploader, FileUploaderOptions, ParsedResponseHeaders } from 'ng2-file-upload';
import { Cloudinary } from '@cloudinary/angular-5.x';


import { BaseLiteComponemntComponent } from '../../base-componemnt/base-lite-componemnt/base-lite-componemnt.component';

declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-survey-form-builder',
  templateUrl: './survey-form-builder.component.html',
  styleUrls: ['./survey-form-builder.component.css']
})
export class SurveyFormBuilderComponent extends BaseLiteComponemntComponent  implements OnInit, AfterViewInit {

  @ViewChild('formtext', { static: false }) inputEl: ElementRef;

  Texts = {
    singleSelection: false,
    text: "Select Item",
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    badgeShowLimit: 5,
    classes: "myclass custom-class"
  };


  _sectionLists: any[] = [];
  
  dynamicForm: FormGroup;
  dynamicSubmitted: boolean;

  _labelSubmit: string;

  uploader: FileUploader;
  response: any[] = [];
  private title: string;
  customeUploader: any[] = [];

  formImageArray: any[] = [];
  _groupSelectedImage: any[] = [];
  gDateFormat: any = 'dd/MM/yyyy';

  quickfromstyle = "single";
  quickformschemaname = "users";

  deleteobj: any;
  ishidedeletebutton = false;
  ishidecancelbutton = false;

  
  startDate = new Date();
  
  constructor(
    private fb: FormBuilder,
    private cloudinary: Cloudinary,
    private _commonService: CommonService,
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
  @Input('isdisablesavebutton') isdisablesavebuttonValue: Boolean;

  @Output() childSubmitData: EventEmitter<any> = new EventEmitter<any>();
  @Output() disabledDirtyForm: EventEmitter<any> = new EventEmitter<any>();

  async ngOnInit() {

    await super.ngOnInit();

    this.title = '';
    this.ishidedeletebutton = true;
    if (this.totalNumberOfTabsValue == this.tabNumberValue) {
      this._labelSubmit = "Save";
    } else {
      this._labelSubmit = "Save & Next";
    }
    

    if (this.formsModelValue[0]['ishidecancelbutton'] != undefined && this.formsModelValue[0]['ishidecancelbutton'] !== '') {
      this.ishidecancelbutton = this.formsModelValue[0]['ishidecancelbutton'];

    } else {
      this.ishidecancelbutton = false;
    }

    this._sectionLists = this.groupBy(this.tabDataValue[0], 'sectionname');

    this._sectionLists.forEach(ele => {
      ele.forEach(element => {
        

        if (element.fieldtype == "image" || element.fieldtype == "multi_image" || element.fieldtype == "attachment") {
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
        } else if (element.fieldtype == "lookup") {
          setTimeout(() => {
            if (element.value && element.inbuildlookupFieldValue) {
              element.value = element.inbuildlookupFieldValue.find(function (ele) {
                return ele.id == element.value;
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
            if (datalist.length != 0) {
              datalist.forEach(elemformfieldfilterValue => {
                if (element && element.formfieldfilterValue && element.formfieldfilterValue.length !== 0) {
                  element.formfieldfilterValue.forEach(e2 => {
                    if (e2.id == elemformfieldfilterValue) {
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

            if (element.value) {
              $('#summernote_' + element.fieldname).summernote('code', element.value);
            }

          }, 2000);

        }
      });
    });

    this.makeForm();
    this.imageConfigration();

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

      $(function () {
        $('#summernote').summernote({
          height: 250,
          codemirror: {
            theme: 'monokai'
          }
        });
      });
    }, 2000);
  }

  imageConfigration() {

    this.tabDataValue[0].forEach(element => {

      if (element.fieldtype == 'image' || element.fieldtype == 'multi_image' || element.fieldtype == 'attachment') {

        console.log("element", element);

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
          ]
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

          console.log("element1", element);

          $(".loading_" + element.fieldname).show();

          if (fileItem && fileItem.status == 200) {

            console.log("element2", element);

            let fieldnameTags = fileItem.data.tags[0];
            if (!this.formImageArray[fieldnameTags]) {
              this.formImageArray[fieldnameTags] = [];
            }

            if (!element.value) {
              element.value = [];
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

            element.value.push(fileItem.data.secure_url);

            console.log("this.formImageArray[fieldnameTags]", this.formImageArray[fieldnameTags]);
            console.log("element.value", element.value);
            console.log("element", element);

            $('#' + fieldnameTags).val(fileItem.data.secure_url);
            $(".loading").hide();
            $(".loading_" + element.fieldname).hide();

          }
        };

        this.customeUploader[fieldname].onCompleteItem = (item: any, response: string, status: number, headers: ParsedResponseHeaders) =>
          upsertResponse({
            file: item.file,
            status,
            data: JSON.parse(response)
          });
        this.customeUploader[fieldname].onProgressItem = (fileItem: any, progress: any) =>
          upsertResponse({
            file: fileItem.file,
            progress
          });
      }

    });
  }

  makeForm() {
    const group: any = {};

    this._sectionLists.forEach(ele => {
      ele.forEach(element => {
        if (element.validationData) {
          if (element.validationData === 'requiredVal') {
            if (element.fieldtype == 'image' || element.fieldtype == 'multi_image' || element.fieldtype == 'attachment') {
              group[element.fieldname] = new FormControl(null);
            } else {
              if (element.isMandatory == "yes") {
                element.isAsterisk = true;
                group[element.fieldname] = new FormControl(null, Validators.compose([Validators.required]));
              } else {
                element.isAsterisk = true;
                group[element.fieldname] = new FormControl(null, Validators.compose([Validators.required]));
              }
            }
          } else if (element.validationData === 'emailVal') {
            if (element.fieldtype == 'image' || element.fieldtype == 'multi_image' || element.fieldtype == 'attachment') {
              group[element.fieldname] = new FormControl(null);
            } else {
              if (element.isMandatory == "yes") {
                group[element.fieldname] = new FormControl(null, Validators.compose([Validators.required, BasicValidators.email]));
              } else {
                group[element.fieldname] = new FormControl(null, Validators.compose([BasicValidators.email]));
              }
            }
          } else if (element.validationData === 'urlVal') {
            if (element.fieldtype == 'image' || element.fieldtype == 'multi_image' || element.fieldtype == 'attachment') {
              group[element.fieldname] = new FormControl(null);
            } else {
              if (element.isMandatory == "yes") {
                group[element.fieldname] = new FormControl(null, Validators.compose([Validators.required, ValidUrlValidator.insertonlyvalidurl]));
              } else {
                group[element.fieldname] = new FormControl(null, Validators.compose([ValidUrlValidator.insertonlyvalidurl]));
              }

            }
          } else if (element.validationData === 'onlyNumberVal') {
            if (element.fieldtype == 'image' || element.fieldtype == 'multi_image' || element.fieldtype == 'attachment') {
              group[element.fieldname] = new FormControl(null);
            } else {
              if (element.isMandatory == "yes") {
                group[element.fieldname] = new FormControl(null, Validators.compose([Validators.required, OnlyNumberValidator.insertonlynumber]));
              } else {
                group[element.fieldname] = new FormControl(null, Validators.compose([OnlyNumberValidator.insertonlynumber]));
              }

            }
          } else if (element.validationData === 'mobileNumberVal') {
            if (element.fieldtype == 'image' || element.fieldtype == 'multi_image' || element.fieldtype == 'attachment') {
              group[element.fieldname] = new FormControl(null);
            } else {
              if (element.isMandatory == "yes") {
                group[element.fieldname] = new FormControl(null, Validators.compose([Validators.required, ValidMobileNumberValidator.onlyvalidmobilenumber]));
              } else {
                group[element.fieldname] = new FormControl(null, Validators.compose([ValidMobileNumberValidator.onlyvalidmobilenumber]));
              }
            }
          } else if (element.validationData === 'onlyNumberOrDecimalVal') {
            if (element.fieldtype == 'image' || element.fieldtype == 'multi_image' || element.fieldtype == 'attachment') {
              group[element.fieldname] = new FormControl(null);
            } else {
              if (element.isMandatory == "yes") {
                group[element.fieldname] = new FormControl(null, Validators.compose([Validators.required, OnlyNumberOrDecimalValidator.insertonlynumberordecimal]));
              } else {
                group[element.fieldname] = new FormControl(null, Validators.compose([OnlyNumberOrDecimalValidator.insertonlynumberordecimal]));
              }
            }
          } else if (element.validationData === 'validPercentVal') {
            if (element.fieldtype == 'image' || element.fieldtype == 'multi_image' || element.fieldtype == 'attachment') {
              group[element.fieldname] = new FormControl(null);
            } else {
              if (element.isMandatory == "yes") {
                group[element.fieldname] = new FormControl(null, Validators.compose([Validators.required, ValidPercValidator.insertonlyvalidperc]));
              } else {
                group[element.fieldname] = new FormControl(null, Validators.compose([ValidPercValidator.insertonlyvalidperc]));
              }
            }
          } else {
            group[element.fieldname] = new FormControl(null);
          }

        } else {
          if (element.isMandatory == "yes") {
            element.isAsterisk = true;
            group[element.fieldname] = new FormControl(null, Validators.compose([Validators.required]));
          } else {
            group[element.fieldname] = new FormControl(null);
            element.isHidden = "no";
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
    this.isdisablesavebuttonValue = true;
    this.dynamicSubmitted = true;
    console.log("value", value);
    console.log("isValid", isValid);
    if (!isValid) {
      this.isdisablesavebuttonValue = false;
      this.showNotification('top', 'right', 'Validation failed!!!', 'danger');
      return false;
    } else {

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
                if (ele2.schemaname && ele2.fieldname == 'objectid') {
                  if (!this.dynamicForm.value["objectprop"]) {
                    this.dynamicForm.value["objectprop"] = {};
                  }
                  let obj = {
                    fullname: this.dynamicForm.value[ele2.fieldname]['name'],
                    schemaname: ele2.schemaname
                  }

                  this.dynamicForm.value["objectprop"] = obj;
                  this.dynamicForm.value[ele2.fieldname] = this.dynamicForm.value[ele2.fieldname]['id'];
                } else {
                  this.dynamicForm.value[ele2.fieldname] = this.dynamicForm.value[ele2.fieldname]['id'];
                }


              } else {
                this._sectionLists.forEach(element => {
                  element.forEach(eleNew => {
                    if (eleNew.fieldname == ele2.fieldname) {
                      if (ele2.fieldtype == 'lookup') {
                        eleNew.inbuildlookupFieldValue.forEach(e => {
                          if (e.name == this.dynamicForm.value[ele2.fieldname]) {
                            this.dynamicForm.value[ele2.fieldname] = e.id;
                          }
                        });
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
          } else if (!ele2.groupname && (ele2.fieldtype == 'image' || ele2.fieldtype == 'multi_image' || ele2.fieldtype == "attachment")) {
            for (let key in this.formImageArray) {
              if (key == ele2.fieldname) {
                this.dynamicForm.value[ele2.fieldname] = this.formImageArray[key];
              }
            }
          } else if (!ele2.groupname && (ele2.fieldtype == 'editor')) {
            this.dynamicForm.value[ele2.fieldname] = $('#summernote_' + ele2.fieldname).summernote('code');
          } else if (!ele2.groupname && ele2.fieldtype == 'datepicker') {
            this.dynamicForm.value[ele2.fieldname] = Date.UTC(new Date(this.dynamicForm.value[ele2.fieldname]).getFullYear(), new Date(this.dynamicForm.value[ele2.fieldname]).getMonth(), new Date(this.dynamicForm.value[ele2.fieldname]).getDate());
          }
        });
      });

      
      console.log("this.dynamicForm", this.dynamicForm);
      this.childSubmitData.emit(this.dynamicForm);
      this.isdisablesavebuttonValue = false;
    }
  }

  onselectCheckbox(field: any, event: any) {

    if (field.modelValues != undefined) {
      let tempArr: any[] = field.modelValues;
      if (tempArr.length > 0) {

      }
    }
  }

  findAndReplace(string: any) {
    string = string.trim();
    var i = 0, length = string.length;
    for (i; i < length; i++) {

      string = string.replace(/\s/g, "_");

    }
    return string;
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
