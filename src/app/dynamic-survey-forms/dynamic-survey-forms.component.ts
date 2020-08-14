import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';


import { FormsModel } from '../core/models/forms/forms.model';
import { FormdataModel } from '../core/models/formdata/formdata.model';

import { FieldsService } from '../core/services/fields/fields.service';
import { CommonDataService } from '../core/services/common/common-data.service';
import { LookupsService } from '../core/services/lookups/lookup.service';
import { FormdataService } from '../core/services/formdata/formdata.service';

import { BaseComponemntComponent } from '../base-componemnt/base-componemnt.component';

declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-dynamic-survey-forms',
  templateUrl: './dynamic-survey-forms.component.html',
  styleUrls: ['./dynamic-survey-forms.component.css']
})
export class DynamicSurveyFormsComponent extends BaseComponemntComponent implements OnInit {

  formsModel = new FormsModel();
  formdataModel = new FormdataModel();

  contextId: any;
  objectId: any;

  _tabLists: any[] = [];
  _defaultTabName: any;

  currentTab: number;
  total_steps: any;
  tabWidth: any;

  allUsersLists: any[] = [];
  allRolesLists: any[] = [];
  listofLookupNeedtoBeLoaded: any[] = [];
  _fieldPermission: any[] = [];
  
  inBuildlookupLists: any[] = [];

  _visibility: boolean = false;
  _defaultAllFields: any = {};
  _needToSave: any = {};
  _tempMergeForBindData = {};

  isEdit: boolean = false;
  isFilterListing: boolean = false;
  isdisablesavebutton = false;

  currentURL: any;
  currenttabIndex: any = 0;

  _contextDetail: any = {};
  swalsetting: any = {};

  submit_data_obj: FormGroup;

  scope: any;

  isdirty = false;

  constructor(
    private _route: ActivatedRoute,
    private _fieldsService: FieldsService,
    private _lookupsService: LookupsService,
    private _commonDataService: CommonDataService,
    private _formdataService: FormdataService
  ) {
    
    super();

    this.pagename = "dynamic-survey-form";

    this._route.queryParams.subscribe(params => {
      this._formId = params['formid'];
      this.contextId = params['contextid'];
      this.objectId = params['objectid'];
      this.scope = params['scope'];
    });
  }

  async ngOnInit() {

    await super.ngOnInit();

    if (this.objectId && this.contextId && this._formId) {
      this.currentURL = '/pages/dynamic-survey-forms/context-form/';
    }

    this.currenttabIndex = 0;
    this.isdisablesavebutton = false;
    this.isFilterListing = false;

    if (this._commonDataService.isfilterDataForDynamicPages && this._commonDataService.filterDataForDynamicPagesparams) {
      this.isFilterListing = true;
      this._commonDataService.isfilterDataForDynamicPages = false;
    }

    this.formsModel = this.formObj;

    let i = 0;
    this.formObj['tabs'].forEach(element => {
      if (element.pageurl.includes(this.currentURL)) {
        this.currenttabIndex = i;
      }
      i++;
    });

    if (this.formObj['issurveysavebtn'] && this.formObj['issurveysavebtn'] == true) {
      this.isdisablesavebutton = true;
    } else {
      this.isdisablesavebutton = false;
    }

    if (this.formsModel['rootfields']) {
      this.sortOn(this.formsModel['rootfields'], "formorder");
    }
      
    if (this.formsModel['swalpopupsetting'] != undefined) {
      this.swalsetting = this.formsModel['swalpopupsetting'];
    } else {
      this.swalsetting = {};
    }

    this.formdataModel.formid = this._formId;

    if (this.contextId) {
      this.formdataModel.contextid = this.contextId;
      if (this.objectId) {
        this.formdataModel.objectid = this.objectId;
      }
    }

    if (this.scope) {
      this.formdataModel.scope = this.scope;
      if (this.scope) {
        this.formdataModel.scope = this.scope;
      }
    }

    this.getAllUser();
    this.getAllRoles();

    //this.getContextDetailByID();
    this.getAllFieldsBasedonFormID(this._formId);
    
  }

  getAllUser() {

    let postData = {};
    postData["refcollection"] = "user";
    postData["refschema"] = "users";
    postData["refselect"] = ["username", "role", "property.email", "property.name", "property.surname", "status"];
    
    this._commonService
      .GetByCollection(postData)
      .subscribe(data => {
        if (data && data.length !== 0) {
          this.allUsersLists = data;
        }
    });
  }

  getAllRoles() {
    this._roleService
      .GetAll()
      .subscribe(data => {
        if (data && data.length !== 0) {
          this.allRolesLists = data;
        }
    });
  }

  // getContextDetailByID() {
  //   if (this._authService.currentUser != undefined && this._authService.currentUser.roletype != undefined && this._authService.currentUser._id != undefined) {
  //     let apiurltochange: string = '';
  //     if (this._authService.currentUser.roletype == 'M') {
  //       apiurltochange = 'members/';
  //     } else {
  //       apiurltochange = 'users/';
  //     }

  //     this._commonService
  //       .commonServiceByUrlMethodIdOrData(apiurltochange, 'GET', this._authService.currentUser._id)
  //       .subscribe(data => {
  //         if (data.length !== 0) {
  //           this._contextDetail = data;
  //         }
  //         this.getAllFieldsBasedonFormID(this._formId);
  //     });
  //   }
  // }

  getAllFieldsBasedonFormID(id: any) {

    let postData = {};
    postData["search"] = [];
    postData["search"].push({ "searchfield": "formid", "searchvalue": id, "criteria": "eq" });
    postData["sort"] = "formorder";

    this._fieldsService
      .GetFormFieldByFormId(postData)
      .subscribe(data => {
        if (data) {
            
          this._defaultAllFields = {};

            for (var i = 0; i < data.length; i++) {
              this._defaultAllFields[data[i].fieldname] = null;
            }

            data.forEach(element => {
              if (element.fieldtype == 'slide_toggle') {
                element.value = false;
              }
            });

            this._tabLists = this.groupBy(data, 'tabname');
            if (this.formsModel) {
              if (this.formsModel['rootfields']) {
                this.formsModel['rootfields'].forEach(element => {
                  let fieldname = element["fieldname"];
                  this._defaultAllFields[fieldname] = null;
                  element["tabname"] = this._tabLists[0][0]["tabname"];
                  element["tabdisplaytext"] = this._tabLists[0][0]["tabdisplaytext"];
                  element["sectionname"] = this._tabLists[0][0]["sectionname"];
                  element["sectiondisplaytext"] = this._tabLists[0][0]["sectiondisplaytext"];
                      
                  if (this.contextId || this.objectId) {
                    if (!this.contextId && fieldname == 'contextid') {
                      this._tabLists[0].unshift(element);
                    }
                    if (!this.objectId && fieldname == 'objectid') {
                      this._tabLists[0].unshift(element);
                    }
                  } else {
                    this._tabLists[0].unshift(element);
                  }
                });
              }
            }

            let len = this._tabLists.length;
            let cnt = 1;
            this._tabLists.forEach(element => {
              element.forEach(ele => {
                if (ele.fieldtype == 'lookup') {
                  this.listofLookupNeedtoBeLoaded.push(ele.inbuildlookupField);
                }
                if (ele.fieldtype == 'context') {
                  if (ele.fieldname.indexOf('.') != -1) {
                      let prop = ele.fieldname.split(".");
                      if (prop.length > 0) {
                          if (prop.length == 2) {
                              let prop0: string = prop[0];
                              let prop1: string = prop[1];
                              if (this._contextDetail != undefined) {
                                  if (this._contextDetail[prop0] != undefined) {
                                      if (this._contextDetail[prop0][prop1] != undefined) {
                                          ele.value = this._contextDetail[prop0][prop1];
                                      }
                                  }
                              }
                          }
                          if (prop.length == 3) {
                              let prop0: string = prop[0];
                              let prop1: string = prop[1];
                              let prop2: string = prop[2];
                              if (this._contextDetail != undefined) {
                                  if (this._contextDetail[prop0] != undefined) {
                                      if (this._contextDetail[prop0][prop1] != undefined) {
                                          if (this._contextDetail[prop0][prop1][prop2] != undefined) {
                                              ele.value = this._contextDetail[prop0][prop1][prop2];
                                          }
                                      }
                                  }
                              }
                          }
                      }
                  } else {
                      if (this._contextDetail != undefined) {
                          let prop = ele.fieldname;
                          if (this._contextDetail[prop] != undefined) {
                              ele.value = this._contextDetail[prop];
                          }
                      }
                  }
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
            
            if (this._tabLists[0]) {
              this._defaultTabName = this._tabLists[0][0]['tabname'];
            }
            this.total_steps = this._tabLists.length;
            this.tabWidth = 100 / this.total_steps;
            setTimeout(() => {
                this.onTabClick(1, this._defaultTabName);
            }, 100);
        }
    });
  }

  getLookupBasedOnLookupName() {

    let postData = {};
    postData["search"] = [];
    postData["search"].push({ searchfield: "_id", searchvalue: this.listofLookupNeedtoBeLoaded, criteria: "in" });
    postData["select"] = [];
    postData["select"].push({ fieldname: "_id", value: 1 });
    postData["select"].push({ fieldname: "data", value: 1 });
    
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
                      if (data) {
                          if (data.length !== 0) {
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
                      }
                  });

              element['refForAdd'] = {};
              element['refForAdd'] = { fieldfilter: element.fieldfilter, fieldfiltervalue: element.fieldfiltervalue, fieldname: element.fieldname };
          }
        } else if (element.fieldtype == 'formdata') {

          let postData = {};
          postData["search"] = [];
          postData["search"].push({ searchfield: element['fieldfilter'], searchvalue: element['fieldfiltervalue'], criteria: "eq" });
          element.formfieldfilterValue = [];

          this._formdataService
            .GetByfilter(postData)
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

                          let obj = {
                              id: key,
                              name: val
                          };
                          element.formfieldfilterValue.push(obj);
                      });

                  }
          })
        }
      });

      if (cnt == len) {
        setTimeout(() => {
          this._visibility = true;
        }, 1000);
      }
      cnt++;
    });
  }

  groupBy(collection: any, property: any) {
    let i = 0, val, index,values = [], result = [];
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

  onTabClick(current: any, button_text: any) {

      $('#tab_' + current).removeClass("disabled-cls");
      this.currentTab = current;
      $('.wizard-card').find('li').css('width', this.tabWidth + '%');
      let move_distance;
      let wizard = $('.wizard-card').width();
      let step_width;

      setTimeout(function () {
          $('.moving-tab').text(button_text);
      }, 150);

      move_distance = wizard / this.total_steps;
      step_width = move_distance;
      move_distance *= current - 1;

      if (current == 1) {
          move_distance = -8;
      } else if (current == this.total_steps) {
          move_distance += 8;
      }

      $('.moving-tab').css('width', step_width);
      $('.moving-tab').css({
          'transform': 'translate3d(' + move_distance + 'px, 0, 0)',
          'transition': 'all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)'
      });
      let cnt = 1;
      this._tabLists.forEach(element => {
          if (cnt != current) {
              $('#' + cnt).hide();
          } else {
              $('#' + cnt).show();
          }
          cnt++;
      });
      document.querySelector('.main-content').scrollTop = 0;
  }

  getSubmittedData(submit_data_obj: FormGroup) {
    
    this.submit_data_obj = submit_data_obj;
    let submit_data = submit_data_obj.value;
    
    if (this.contextId) {
      if (!submit_data["contextid"]) {
        submit_data["contextid"] = '';
      }
      submit_data["contextid"] = this.contextId;
    }

    if (this.scope) {
      if (!submit_data["scope"]) {
        submit_data["scope"] = '';
      }
      submit_data["scope"] = this.scope;
    }

    if (this.currentTab == 1) {
      this._needToSave['property'] = this._defaultAllFields;
    }
    setTimeout(() => {
        for (let key in this._needToSave['property']) {
          for (let submitKey in submit_data) {
            if (key == submitKey.toLowerCase()) {
              this._needToSave['property'][key] = submit_data[submitKey];
            }
          }
        }

        if (this.currentTab == this.total_steps) {
          let url = this.formsModel.addurl['url'];
          let method = this.formsModel.addurl['method'];

          for (let key in this._needToSave['property']) {
            if (Object.prototype.toString.call(this._needToSave['property'][key]) === '[object Array]') {
              for (let k in this._needToSave['property'][key]) {
                if (typeof (this._needToSave['property'][key][k]) == "undefined") {
                  this._needToSave['property'][key][k] = null;
                }
              }
            } else {
              if (typeof (this._needToSave['property'][key]) == "undefined") {
                this._needToSave['property'][key] = null;
              }
            }
          }

          if (this.formsModel) {
              if (this.formsModel['rootfields']) {
                  this.formsModel['rootfields'].forEach(element => {
                      for (let key in this._needToSave['property']) {
                          if (element["fieldname"] == key) {
                              if (!this.formdataModel[element["fieldname"]]) {
                                  this.formdataModel[element["fieldname"]] = null;
                              }
                              this.formdataModel[element["fieldname"]] = this._needToSave['property'][key]

                          }
                      }
                  });
              }
          }

          this.isdisablesavebutton = true;
          if (this._needToSave.property != undefined) {
              this.formdataModel.property = this._needToSave.property;
          }

          var qs = this._router.url;
          var spl = qs.split("/");

          if (spl[3] == "context-form") {
            this.getFormdatasbyModel(this.formdataModel);
          } else {
            this.formDataAdd();
          }
            
        } else {
          let nextTab = this.currentTab + 1;
          let tabName = this._tabLists[this.currentTab][0]['tabname'];
          this.onTabClick(nextTab, tabName);
        }

    }, 1000);
      
  }

  getFormdatasbyModel(data: any) {

    let postData2 = {};
    postData2['search'] = [];
    postData2['search'].push({ "searchfield": "formid", "searchvalue": data.formid, "criteria": "eq" })
    postData2['search'].push({ "searchfield": "contextid", "searchvalue": data.contextid, "criteria": "eq" })
    postData2['search'].push({ "searchfield": "objectid", "searchvalue": data.objectid, "criteria": "eq" })

      this._formdataService
        .GetByfilter(postData2)
        .subscribe(data => {
          if (data) {
            if (data && data.length != 0 && data[0]) {
              this.showNotification('top', 'right', 'Record already exist.', 'danger');
              this.isdisablesavebutton = false;
            } else {
              this.formDataAdd();
            }
          }
        });
  }

  formDataAdd() {
      this._formdataService
        .Add(this.formdataModel)
        .subscribe(data => {
          if (data) {
            this.isdisablesavebutton = false;
            this.submit_data_obj.reset();

            if (this._tabLists != undefined && this._tabLists.length > 0) {
                this._visibility = false;
                this._tabLists.forEach(element => {
                    element.forEach(ele => {
                        if (ele.fieldtype == 'context') {
                            if (ele.fieldname.indexOf('.') != -1) {
                                let prop = ele.fieldname.split(".");
                                if (prop.length > 0) {
                                    if (prop.length == 2) {
                                        let prop0: string = prop[0];
                                        let prop1: string = prop[1];
                                        if (this._contextDetail != undefined) {
                                            if (this._contextDetail[prop0] != undefined) {
                                                if (this._contextDetail[prop0][prop1] != undefined) {
                                                    ele.value = this._contextDetail[prop0][prop1];
                                                }
                                            }
                                        }
                                    }
                                    if (prop.length == 3) {
                                        let prop0: string = prop[0];
                                        let prop1: string = prop[1];
                                        let prop2: string = prop[2];
                                        if (this._contextDetail != undefined) {
                                            if (this._contextDetail[prop0] != undefined) {
                                                if (this._contextDetail[prop0][prop1] != undefined) {
                                                    if (this._contextDetail[prop0][prop1][prop2] != undefined) {
                                                        ele.value = this._contextDetail[prop0][prop1][prop2];
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            } else {
                                if (this._contextDetail != undefined) {
                                    let prop = ele.fieldname;
                                    if (this._contextDetail[prop] != undefined) {
                                        ele.value = this._contextDetail[prop];
                                    }
                                }
                            }
                        }
                        if (element.fieldtype == 'datepicker') {
                            if (element.default != undefined && element.default == 'today') {
                                element.value = new Date();
                            }
                        }
                    });
                });
                setTimeout(() => {
                    this._visibility = true;
                }, 100);

            }
            if (this.swalsetting != undefined && this.swalsetting.title != undefined && this.swalsetting.successmessage != undefined) {
                swal({
                    title: this.swalsetting.title != undefined ? this.swalsetting.title : '',
                    text: this.swalsetting.successmessage != undefined ? this.swalsetting.successmessage : '',
                    type: this.swalsetting.type != undefined ? this.swalsetting.type : 'success',
                    confirmButtonClass: this.swalsetting.confirmbuttonclass != undefined ? this.swalsetting.confirmbuttonclass : 'btn btn-success',
                    buttonsStyling: false
                }).then(
                    function () {

                        if (this.swalsetting.redirecturl != undefined && this.swalsetting.redirecturl != '') {
                            // this._router.navigate([this.swalsetting.redirecturl]);
                            this._router.navigate(["success"]);
                        }
                    },

                    function (dismiss) {

                    }).catch(swal.noop);
            } else {
                var qs = this._router.url;
                var spl = qs.split("/");

                this.showNotification('top', 'right', this.formsModel.dispalyformname + ' added successfully!!!', 'success');
                this.isdisablesavebutton = false;
            }
          } else {
            this.isdisablesavebutton = false;
          }
        }, data => {
          this.isdisablesavebutton = false;
          if (data.status == 500) {
              this.showNotification('top', 'right', 'Server Error in Application or Record already exist.', 'danger');
              //this._router.navigate(['/pages/dynamic-list/list/' + this.formsModel.formname]);
              this._router.navigate(["success"]);
          }
      });
  }

  noeditpermissionMsg(mode: any) {
    swal({
      title: 'No Permission',
      text: 'You have no ' + mode + ' permission for this form.',
      timer: 2000,
      showConfirmButton: false
    }).then(
      function () { },
      function (dismiss) {
        if (dismiss === 'timer') {
        }
    }).catch(swal.noop);
  }

  jsUcfirst(string: any) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  comparer(otherArray: any) {
    return function (current: any) {
      return otherArray.filter(function (other: any) {
          return other.value == current.value && other.display == current.display
      }).length == 0;
    }
  }

  disabledDirtyData(submit_data: any) {
    this.isdirty = false;
    //this._router.navigate(submit_data);
    this._router.navigate(["success"]);
  }

}
