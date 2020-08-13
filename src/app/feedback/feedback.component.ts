import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BasicValidators, ValidUrlValidator, OnlyNumberValidator, ValidMobileNumberValidator, OnlyNumberOrDecimalValidator, ValidPercValidator } from '../core/components/basicValidators';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

import { Router } from '@angular/router';

import { PublicService } from '../core/services/public/public.service';
import { LookupsService } from '../core/services/lookups/lookup.service';
import { AuthService } from '../core/services/common/auth.service';
import { CommonService } from '../core/services/common/common.service';

import { FormsModel } from '../core/models/forms/forms.model';

import { Cloudinary } from '@cloudinary/angular-5.x';
import { FileUploaderOptions, FileUploader, ParsedResponseHeaders } from 'ng2-file-upload';


declare const $: any;

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {

  formsModel = new FormsModel();

  formid: any;
  contextid: any;
  objectid: any;

  _tabLists: any[] = [];
  _sectionLists: any[] = [];
  _groups: any[] = [];
  listofLookupNeedtoBeLoaded: any[] = [];
  inBuildlookupLists: any[] = [];
  formImageArray: any[] = [];
  private title: string;
  customeUploader: any[] = [];


  dynamicForm: FormGroup;
  dynamicSubmitted: boolean;

  _defaultAllFields: any = {};
  needToSaveData: any = {};

  isdisablesavebutton: Boolean = false;
  visibility: Boolean = false;

  constructor(
    private _route: ActivatedRoute,
    private _publicService: PublicService,
    private router: Router,
    private fb: FormBuilder,
    private _lookupsService: LookupsService,
    private _commonService: CommonService,
    private authService: AuthService,
    private cloudinary: Cloudinary,
  ) { 

    this._route.queryParams.subscribe(params => {
      this.formid = params['formid'];
      this.contextid = params['contextid'];
      this.objectid = params['objectid'];
    });

  }

  ngOnInit() {

    this.title = '';
    if (this.formid) {
      this.getFormsDetails(this.formid);

      if (!this.needToSaveData['formid']) {
        this.needToSaveData['formid'] = "";
      }
      this.needToSaveData['formid'] = this.formid;
    }
    if (this.contextid) {
      if (!this.needToSaveData['contextid']) {
        this.needToSaveData['contextid'] = "";
      }
      this.needToSaveData['contextid'] = this.contextid;
    }
    if (this.objectid) {
      if (!this.needToSaveData['objectid']) {
        this.needToSaveData['objectid'] = "";
      }
      this.needToSaveData['objectid'] = this.objectid;
    }

    if (this.formid) {
      this.getAllFieldsBasedonFormID(this.formid);
    }
  }

  getFormsDetails(id: any) {

    this._publicService
      .GetByFormId(id)
      .subscribe(data => {
        if (data) {
          this.formsModel = data;
          if (this.formsModel && this.formsModel['rootfields']) {
            this.sortOn(this.formsModel['rootfields'], "formorder");
          }
        }
      });

  }


  getAllFieldsBasedonFormID(id: any) {
    let postData = {
      "search": [{ "searchfield": "formid", "searchvalue": id, "criteria": "eq" }],
      "sort": "formorder"
    };

    this._publicService
      .GetFormFieldByFormId(postData)
      .subscribe(data => {
        if (data && data.length != 0) {
          this._defaultAllFields = {};
          for (var i = 0; i < data.length; i++) {
            this._defaultAllFields[data[i].fieldname] = null;
          }
          this._tabLists = this.groupBy(data, 'tabname');
          this._sectionLists = this.groupBy(this._tabLists[0], 'sectionname');
          if (this.formsModel) {
            let len = this._tabLists.length;
            let cnt = 1;
            this._tabLists.forEach(element => {
              element.forEach(ele => {
                if (ele.fieldtype == 'lookup') {
                  this.listofLookupNeedtoBeLoaded.push(ele.inbuildlookupField);
                }
                if (ele.fieldtype == 'datepicker') {
                  if (ele.default != undefined && ele.default == 'today') {
                    ele.value = new Date();
                  }
                }


              });
              if (cnt == len) {
                this.getLookupBasedOnLookupName();
              }
              cnt++;
            });
          }
          if (this._sectionLists.length != 0) {
            setTimeout(() => {
              this.makeform();
            }, 1000);
          }


        }
        this._sectionLists.forEach(secele => {
          if (secele.groupname) {
            this._groups.push(secele);
          }

          if (secele.fieldtype == "image" || secele.fieldtype == "attachment") {
            if (!this.formImageArray[secele.fieldname]) {
              this.formImageArray[secele.fieldname] = [];
            }
          }
        });
        this.imageConfigration();

      });

  }

  getLookupBasedOnLookupName() {
    let postData = {};
    postData['search'] = [];
    postData['select'] = [];
    postData['search'].push({ searchfield: "_id", searchvalue: this.listofLookupNeedtoBeLoaded, criteria: "in" });
    postData['select'].push({ fieldname: "_id", value: 1 });
    postData['select'].push({ fieldname: "data", value: 1 });


    this._lookupsService
      .GetByfilterLookupName(postData)
      .subscribe(data => {
        if (data) {
          let len = data.length;
          let cnt = 1;
          if (data.length !== 0) {
            data.forEach(element => {
              this.inBuildlookupLists[element._id] = [];
              if (element['data'].length !== 0) {
                element['data'].forEach(ele => {
                  let obj = {
                    id: ele.code,
                    name: ele.name
                  };
                  this.inBuildlookupLists[element._id].push(obj);
                });
              }
              if (cnt == len) {
                this.getFormTypeDropdownValue();
              }
              cnt++;
            });
          } else {
            this.getFormTypeDropdownValue();
          }
        } else {
          this.getFormTypeDropdownValue();
        }
      });
  }


  getFormTypeDropdownValue() {

    let len = this._tabLists.length;
    let cnt = 1;

    this._tabLists.forEach(ele => {
      ele.forEach(element => {
        if (element.fieldtype == 'form' || element.fieldtype == 'form_multiselect') {
          let postData = {};
          postData["search"] = [];
          if (element['fieldfilter']) {
            let res = element['fieldfilter'].split(".");
            if (res[0]) {
              element['fieldfilter'] = res[0];
            }
            if (element['criteria'] != undefined) {
              postData["search"].push({ searchfield: element['fieldfilter'], searchvalue: element['fieldfiltervalue'], criteria: element['criteria'] });
            } else {
              postData["search"].push({ searchfield: element['fieldfilter'], searchvalue: element['fieldfiltervalue'], criteria: "eq" });
            }
          }
          element.formfieldfilterValue = [];
          let url, method;
          if (element['apiurl']) {
            url = element['apiurl'];
          }
          if (element['method']) {
            method = element['method'];
          }
          if (url && method && postData) {
            this._commonService
              .commonServiceByUrlMethodData(url, method, postData)
              .subscribe(data => {
                if (data && data.length !== 0) {
                  data.forEach(ele => {
                    let val;
                    let displayvalue;
                    if (element['displayvalue'].indexOf('.') !== -1) {
                      let stringValue = element['displayvalue'].split(".");
                      let str1 = stringValue[0];
                      let str2 = stringValue[1];
                      val = ele[str1][str2];

                    } else {
                      displayvalue = element['displayvalue'];
                      val = ele[displayvalue];
                    }
                    let formfield = element['formfield'];
                    let key = ele[formfield];
                    if (element.fieldtype === 'form_multiselect') {
                      let obj = {
                        id: key,
                        itemName: val
                      };
                      element.formfieldfilterValue.push(obj);
                    } else {
                      let obj = {
                        id: key,
                        name: val
                      };
                      element.formfieldfilterValue.push(obj);
                    }
                  });
                }

              });
            element['refForAdd'] = {};
            element['refForAdd'] = { fieldfilter: element.fieldfilter, fieldfiltervalue: element.fieldfiltervalue, fieldname: element.fieldname };
          }
        }
      });
      if (cnt == len) {
        setTimeout(() => {
          this.visibility = true;
        }, 1000);
      }
      cnt++;
    });
  }

  makeform() {
    const group: any = {};
    this._sectionLists.forEach(ele => {
      ele.forEach(element => {
        if (element.groupname) {
          group[element.fieldname] = new FormControl(null);
        } else {
          if (element.validationData) {
            if (element.validationData === 'requiredVal') {
              if (element.fieldtype == 'image' || element.fieldtype == 'multi_image') {
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
              if (element.fieldtype == 'image' || element.fieldtype == 'multi_image') {
                group[element.fieldname] = new FormControl(null);
              } else {
                if (element.isMandatory == "yes") {
                  group[element.fieldname] = new FormControl(null, Validators.compose([Validators.required, BasicValidators.email]));
                } else {
                  group[element.fieldname] = new FormControl(null, Validators.compose([BasicValidators.email]));
                }
              }
            } else if (element.validationData === 'urlVal') {
              if (element.fieldtype == 'image' || element.fieldtype == 'multi_image') {
                group[element.fieldname] = new FormControl(null);
              } else {
                if (element.isMandatory == "yes") {
                  group[element.fieldname] = new FormControl(null, Validators.compose([Validators.required, ValidUrlValidator.insertonlyvalidurl]));
                } else {
                  group[element.fieldname] = new FormControl(null, Validators.compose([ValidUrlValidator.insertonlyvalidurl]));
                }

              }
            } else if (element.validationData === 'onlyNumberVal') {
              if (element.fieldtype == 'image' || element.fieldtype == 'multi_image') {
                group[element.fieldname] = new FormControl(null);
              } else {
                if (element.isMandatory == "yes") {
                  group[element.fieldname] = new FormControl(null, Validators.compose([Validators.required, OnlyNumberValidator.insertonlynumber]));
                } else {
                  group[element.fieldname] = new FormControl(null, Validators.compose([OnlyNumberValidator.insertonlynumber]));
                }

              }
            } else if (element.validationData === 'mobileNumberVal') {
              if (element.fieldtype == 'image' || element.fieldtype == 'multi_image') {
                group[element.fieldname] = new FormControl(null);
              } else {
                if (element.isMandatory == "yes") {
                  group[element.fieldname] = new FormControl(null, Validators.compose([Validators.required, ValidMobileNumberValidator.onlyvalidmobilenumber]));
                } else {
                  group[element.fieldname] = new FormControl(null, Validators.compose([ValidMobileNumberValidator.onlyvalidmobilenumber]));
                }
              }
            } else if (element.validationData === 'onlyNumberOrDecimalVal') {
              if (element.fieldtype == 'image' || element.fieldtype == 'multi_image') {
                group[element.fieldname] = new FormControl(null);
              } else {
                if (element.isMandatory == "yes") {
                  group[element.fieldname] = new FormControl(null, Validators.compose([Validators.required, OnlyNumberOrDecimalValidator.insertonlynumberordecimal]));
                } else {
                  group[element.fieldname] = new FormControl(null, Validators.compose([OnlyNumberOrDecimalValidator.insertonlynumberordecimal]));
                }
              }
            } else if (element.validationData === 'validPercentVal') {
              if (element.fieldtype == 'image' || element.fieldtype == 'multi_image') {
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
            element.inbuildlookupFieldValue = this.inBuildlookupLists[element.inbuildlookupField];
          }
        }
      });
    });
    this.dynamicForm = this.fb.group(group);
  }

  imageConfigration() {
    this._tabLists[0].forEach(element => {
      if (element.fieldtype == 'image' || element.fieldtype == 'attachment') {
        var auth_cloud_name = this.authService.auth_cloud_name ? this.authService.auth_cloud_name : this.cloudinary.config().cloud_name;
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

        const upsertResponse = (fileItem: any) => {
          $(".loading").show();
          if (fileItem && fileItem.status == 200) {
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
            $('#' + fieldnameTags).val(fileItem.data.secure_url);
            $(".loading").hide();
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
      }
    });
  }


  onDynamicFormSubmit(value: any, valid: Boolean) {
    if (!valid) {
      this.showNotification('top', 'right', 'Please Submit Required Data', 'danger');
      console.log("Please Submit Required Data");
    } else {

      this.needToSaveData['property'] = this._defaultAllFields;
      for (let key in this.needToSaveData['property']) {
        for (let submitKey in value) {
          if (key == submitKey.toLowerCase()) {
            this.needToSaveData['property'][key] = value[submitKey];
          }
        }
      }

      if (this.formsModel) {
        if (this.formsModel['rootfields']) {
          this.formsModel['rootfields'].forEach(element => {
            for (let key in this.needToSaveData['property']) {
              if (element["fieldname"] == key) {
                this.needToSaveData[key] = this.needToSaveData['property'][key];
              }
            }
          });
        }
      }

      this.isdisablesavebutton = true;
      this.checkexistornot(this.needToSaveData)     // InComplete(issue : filter not working of public/formdatas)
    }
  }
  
  checkexistornot(postData: any) {
    let postData2 = {};
    postData2['search'] = [];
    postData2['search'].push({ "searchfield": "formid", "searchvalue": postData.formid, "criteria": "eq" })
    postData2['search'].push({ "searchfield": "contextid", "searchvalue": postData.contextid, "criteria": "eq" })
    postData2['search'].push({ "searchfield": "objectid", "searchvalue": postData.objectid, "criteria": "eq" })

    this.AddFeedback(postData);

    //  this._publicService
    //       .GetFormDataFilter(postData2)
    //           .subscribe(data => {
    //             if(data && data.length != 0){
    //               this.isdisablesavebutton = false;
    //               this.showNotification('top', 'right', this.jsUcfirst(this.formsModel.dispalyformname) + ' alreay Exist!!!', 'danger');
    //             }else{
    //               this.AddFeedback(postData);
    //        }
    // });
  }

  AddFeedback(postData: any) {

    console.log("postData", postData);

    this._publicService
      .createFormData(postData)
      .subscribe(data => {
        console.log("data", data);
        if (data && data.length != 0) {
          this.isdisablesavebutton = false;
          this.showNotification('top', 'right', this.jsUcfirst(this.formsModel.dispalyformname) + ' has been added successfully!!!', 'success');
          console.log(this.jsUcfirst(this.formsModel.dispalyformname) + ' has been added successfully!!!');

          this.router.navigate(["success"]);

          // let currenturl = window.location.href;
          // let finalurl;
          // var sp = currenturl.split('#');
          // finalurl = sp[0];
          // window.location.href = finalurl + '#/login';

        }
      });
  }

  refresh(): void {
    let currenturl = window.location.href;
    let finalurl;
    var sp = currenturl.split('#');
    finalurl = sp[0];
    window.location.href = finalurl;
    window.location.replace(finalurl);
  }

  jsUcfirst(string: any) {
    return string.charAt(0).toUpperCase() + string.slice(1);
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

  sortOn(arr: any, prop: any) {
    arr.sort(
      function (a: any, b: any) {
        if (a[prop] > b[prop]) {
          return -1;
        } else if (a[prop] < b[prop]) {
          return 1;
        } else {
          return 0;
        }
      }
    );
  }

  showNotification(from :any, align :any, msg :any, type:any) {
    $.notify({
      icon: "notifications",
      message: msg
    }, {
        type: type,
        timer: 3000,
        placement: {
          from: from,
          align: align
        }
      });
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

}
