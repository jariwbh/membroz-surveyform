
import { Component, OnInit, HostListener } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { FormsModel } from "../core/models/forms/forms.model";

import { FieldsService } from "../core/services/fields/fields.service";
import { FormdataService } from "../core/services/formdata/formdata.service";
import { CommonDataService } from "../core/services/common/common-data.service";
import { LookupsService } from "../core/services/lookups/lookup.service";

import { BaseComponemntComponent } from "../base-componemnt/base-componemnt.component";

declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-dynamic-forms',
  templateUrl: './dynamic-forms.component.html',
  styleUrls: ['./dynamic-forms.component.scss']
})
export class DynamicFormsComponent extends BaseComponemntComponent implements OnInit {

  formsModel = new FormsModel();
  
  _tabLists: any[] = [];
  _tabpermission: any[] = [];

  _defaultTabName: any;

  currentTab: number;
  total_steps: any;
  tabWidth: any;

  allUsersLists: any[] = [];
  allRolesLists: any[] = [];
  listofLookupNeedtoBeLoaded: any[] = [];
  inBuildlookupLists: any[] = [];

  _visibility: boolean = false;
  _defaultAllFields: any = {};
  _needToSave: any = {};

  isdirty = false;

  isFilterListing: boolean = false;
  isdisablesavebutton = false;
  isLoadTabs = true;

  deafaultBranch: any;
  deafaultUser: any;

  dispalyformname: any;

  constructor(
    private _route: ActivatedRoute,
    private _fieldsService: FieldsService,
    private _lookupsService: LookupsService,
    private _commonDataService: CommonDataService,
    private _formdataService: FormdataService
  ) {
    super();

    this.pagename = "dynamic-form";

    this._route.queryParams.subscribe(params => {
      this._formId = params["formid"];
    });
  }

  async ngOnInit() {

    await super.ngOnInit();

    this._route.queryParams.subscribe(params => {
      this.isFilterListing = false;

      if (this._commonDataService.isfilterDataForDynamicPages) {
        if (this._commonDataService.filterDataForDynamicPagesparams) {
          this.isFilterListing = true;
          this._commonDataService.isfilterDataForDynamicPages = false;
        }
      }

      this.formsModel = this.formObj;
      this.dispalyformname = this.formsModel && this.formsModel["langresources"] && this.formsModel["langresources"][this.defaultLanguage] ? this.formsModel["langresources"][this.defaultLanguage] : this.formsModel.dispalyformname ? this.formsModel.dispalyformname : this.formsModel.formname;
      
      this.getAllUser();
      this.getAllRoles();
      this.getAllFieldsBasedonFormID(this._formId);
      
    });
  }

  getAllUser() {
    
    let postData = {};
    postData["refcollection"] = "user";
    postData["refschema"] = "users";
    postData["refselect"] = [ "username", "role", "property.email", "property.name", "property.surname", "status"];

    this._commonService
      .GetByCollection(postData)
      .subscribe((data) => {
        if (data && data.length !== 0) {
          this.allUsersLists = data;
        }
    });
  }

  getAllRoles() {
    this._roleService
      .GetAll()
      .subscribe((data) => {
        if (data && data.length !== 0) {
          this.allRolesLists = data;
        }
    });
  }

  getAllFieldsBasedonFormID(id: any) {

    let postData = {};
    postData["search"] = [];
    postData["search"].push({searchfield: "formid", searchvalue: id, criteria: "eq",});
    postData["sort"] = "formorder";

    this._fieldsService
      .GetFormFieldByFormId(postData)
      .subscribe((data) => {
        if (data && data.length !== 0) {

          this._defaultAllFields = {};
          for (var i = 0; i < data.length; i++) {
            this._defaultAllFields[data[i].fieldname] = null;
          }

          data.forEach((element) => {
            if (element.fieldtype == "slide_toggle") {
              element.value = false;
            }
          });
          
          this._tabLists = this.groupBy(data, "tabname");

          if (this.formsModel && this.formsModel["rootfields"] && this.formsModel["rootfields"].length > 0) {
            this.formsModel["rootfields"] = this.formsModel["rootfields"].sort((ra1, rb2) => {
              if (
                ra1.order != undefined &&
                rb2.order != undefined &&
                ra1.order > rb2.order
              ) {
                return -1;
              }
              if (
                ra1.order != undefined &&
                rb2.order != undefined &&
                ra1.order < rb2.order
              ) {
                return 1;
              }
              if (
                ra1.formorder != undefined &&
                rb2.formorder != undefined &&
                ra1.formorder > rb2.formorder
              ) {
                return -1;
              }
              if (
                ra1.formorder != undefined &&
                rb2.formorder != undefined &&
                ra1.formorder < rb2.formorder
              ) {
                return 1;
              }
              return 0;
            });
            this.formsModel["rootfields"].forEach((element) => {
              let fieldname = element["fieldname"];
              this._defaultAllFields[fieldname] = null;

              element["tabname"] = this._tabLists[0][0]["tabname"];
              element["tabdisplaytext"] = this._tabLists[0][0]["tabdisplaytext"];
              element["sectionname"] = this._tabLists[0][0]["sectionname"];
              element["sectiondisplaytext"] = this._tabLists[0][0]["sectiondisplaytext"];
              this._tabLists[0].unshift(element);

            });
          }

          let len = this._tabLists.length;
          let cnt = 1;
          this._tabLists.forEach((element) => {
            element.forEach((ele) => {
              if (ele.fieldtype == "lookup") {
                this.listofLookupNeedtoBeLoaded.push(ele.inbuildlookupField);
              }
            });
            if (cnt == len) {
              this.getLookupBasedOnLookupName();
            }
            cnt++;
          });

          if (this._tabLists[0]) {
            if (
              this.langResource &&
              this.langResource[this._tabLists[0][0]["tabname"]]
            ) {
              this._defaultTabName = this.langResource[
                this._tabLists[0][0]["tabname"]
              ];
            } else {
              this._defaultTabName = this._tabLists[0][0]["tabname"];
            }
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
    postData["search"].push({searchfield: "_id",searchvalue: this.listofLookupNeedtoBeLoaded, criteria: "in"});
    postData["select"] = [];
    postData["select"].push({fieldname: "_id", value: 1 });
    postData["select"].push({fieldname: "data", value: 1 });
    
    this._lookupsService
      .GetByfilterLookupName(postData)
      .subscribe((data) => {
        if (data) {
          let len = data.length;
          let cnt = 1;
          if (data.length !== 0) {
            data.forEach((element) => {
              this.inBuildlookupLists[element._id] = [];
              if (element["data"].length !== 0) {
                element["data"].forEach((ele) => {
                  let obj = {
                    id: ele.code,
                    name: ele.name,
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

    this._tabLists.forEach((ele) => {
      ele.forEach((element) => {
        if (element.fieldtype == "form" || element.fieldtype == "form_multiselect") {
          element.readonly = false;

          let postData = {};
          postData["search"] = [];
          if (element["fieldfilter"]) {
            let res = element["fieldfilter"].split(".");
            if (res[0]) {
              element["fieldfilter"] = res[0];
            }

            if (element["criteria"] != undefined) {
              postData["search"].push({searchfield: element["fieldfilter"], searchvalue: element["fieldfiltervalue"], criteria: element["criteria"],});
            } else {
              postData["search"].push({searchfield: element["fieldfilter"], searchvalue: element["fieldfiltervalue"], criteria: "eq"});
            }

            postData["select"] = [];
            postData["select"].push({
              fieldname: element["formfield"],
              value: 1,
            });
            postData["select"].push({
              fieldname: element["displayvalue"],
              value: 1,
            });
            postData["sort"] = element["displayvalue"];
          }

          element.formfieldfilterValue = [];
          let url = element["apiurl"];
          let method = element["method"];

          

          this._commonService
            .commonServiceByUrlMethodData(url, method, postData)
            .subscribe((data) => {
              if (data) {
                
                if (data.length !== 0) {
                  data.forEach((ele) => {
                    let val;
                    let displayvalue;
                    if (element["displayvalue"].indexOf(".") !== -1) {
                      let stringValue = element["displayvalue"].split(".");
                      let str1 = stringValue[0];
                      let str2 = stringValue[1];
                      val = ele[str1][str2];
                    } else {
                      displayvalue = element["displayvalue"];
                      val = ele[displayvalue];
                    }

                    let formfield = element["formfield"];
                    let key = ele[formfield];
                    if (element.fieldtype === "form_multiselect") {
                      let obj = {
                        id: key,
                        itemName: val,
                      };
                      element.formfieldfilterValue.push(obj);
                    } else {
                      let obj = {
                        id: key,
                        name: val,
                      };
                      element.formfieldfilterValue.push(obj);
                    }
                  });

                  
                    if ( element.apiurl == "/users/filter/" || element.apiurl == "/users/filter" || element.apiurl == "users/filter" || element.apiurl == "users/filter/") {
                      if (
                        this._authService &&
                        this._authService.auth_user &&
                        this._authService.auth_user._id &&
                        this._authService.auth_user.fullname
                      ) {
                        let formfield = element["formfield"];
                        let key = this._authService.auth_user[formfield];
                        this.deafaultUser = {};

                        if (element.fieldtype === "form_multiselect") {
                          this.deafaultUser = {
                            id: key,
                            itemName: this._authService.auth_user.fullname,
                          };
                          element.value = [];
                          element.value = [key];
                        } else {
                          this.deafaultUser = {
                            id: key,
                            name: this._authService.auth_user.fullname,
                          };
                          element.value = {};
                          element.value = this.deafaultUser;
                        }
                      }
                    }

                    if (element.apiurl == "/branches/filter/" || element.apiurl == "/branches/filter" || element.apiurl == "branches/filter" || element.apiurl == "branches/filter/") {
                      if (
                        this._authService &&
                        this._authService.auth_user &&
                        this._authService.auth_user.branchid
                      ) {
                        let formfield = element["formfield"];
                        let key = this._authService.auth_user.branchid[
                          formfield
                        ];
                        this.deafaultBranch = {};

                        if (element.fieldtype === "form_multiselect") {
                          this.deafaultBranch = {
                            id: key,
                            itemName: this._authService.auth_user.branchid
                              .branchname,
                          };
                          element.value = [];
                          element.value = [key];
                        } else {
                          this.deafaultBranch = {
                            id: key,
                            name: this._authService.auth_user.branchid
                              .branchname,
                          };
                          element.value = {};
                          element.value = this.deafaultBranch;
                        }
                      }
                    }
                  
                }
              }
            });

          element["refForAdd"] = {};
          element["refForAdd"] = {
            fieldfilter: element.fieldfilter,
            fieldfiltervalue: element.fieldfiltervalue,
            fieldname: element.fieldname,
          };
        } else if (element.fieldtype == "formdata") {
          let postData = {};
          postData["search"] = [];
          postData["search"].push({
            searchfield: element["fieldfilter"],
            searchvalue: element["fieldfiltervalue"],
            criteria: "eq",
          });

          element.formfieldfilterValue = [];

          this._formdataService.GetByfilter(postData).subscribe((data) => {
            if (data && data.length !== 0) {
              data.forEach((ele) => {
                let val;
                let displayvalue;

                if (element["displayvalue"].indexOf(".") !== -1) {
                  let stringValue = element["displayvalue"].split(".");
                  let str1 = stringValue[0];
                  let str2 = stringValue[1];
                  val = ele[str1][str2];
                } else {
                  displayvalue = element["displayvalue"];
                  val = ele[displayvalue];
                }

                let formfield = element["formfield"];
                let key = ele[formfield];

                let obj = {
                  id: key,
                  name: val,
                };
                element.formfieldfilterValue.push(obj);
              });
            }
          });
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
    let i = 0,
      val,
      index,
      values = [],
      result = [];
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

    this.isdisablesavebutton = false;
    $("#tab_" + current).removeClass("disabled-cls");

    this.currentTab = current;

    $(".wizard-card")
      .find("li")
      .css("width", this.tabWidth + "%");

    let move_distance;
    let wizard = $(".wizard-card").width();
    let step_width;

    setTimeout(function () {
      $(".moving-tab").text(button_text);
    }, 150);

    move_distance = wizard / this.total_steps;
    step_width = move_distance;
    move_distance *= current - 1;

    if (current == 1) {
      move_distance = -8;
    } else if (current == this.total_steps) {
      move_distance += 8;
    }

    $(".moving-tab").css("width", step_width);
    $(".moving-tab").css({
      transform: "translate3d(" + move_distance + "px, 0, 0)",
      transition: "all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)",
    });
    let cnt = 1;
    this._tabLists.forEach((element) => {
      if (cnt != current) {
        $("#" + cnt).hide();
      } else {
        $("#" + cnt).show();
      }
      cnt++;
    });
    
    document.querySelector(".main-content").scrollTop = 0;
  }

  getSubmittedData(submit_data: any) {

    if (this.currentTab == 1) {
      this._needToSave["property"] = this._defaultAllFields;
    }

    setTimeout(() => {
      for (let submitKey in submit_data) {
        if (!this._needToSave["property"][submitKey]) {
          this._needToSave["property"][submitKey] = null;
        }

        for (let key in this._needToSave["property"]) {
          if (key == submitKey.toLowerCase()) {
            this._needToSave["property"][key] = submit_data[submitKey];
          }
        }
      }

      if (this.currentTab == this.total_steps) {
        let url = this.formsModel.addurl["url"];
        let method = this.formsModel.addurl["method"];

        for (let key in this._needToSave["property"]) {
          if (
            Object.prototype.toString.call(
              this._needToSave["property"][key]
            ) === "[object Array]"
          ) {
            for (let k in this._needToSave["property"][key]) {
              if (
                typeof this._needToSave["property"][key][k] == "undefined"
              ) {
                this._needToSave["property"][key][k] = null;
              }
            }
          } else {
            if (typeof this._needToSave["property"][key] == "undefined") {
              this._needToSave["property"][key] = null;
            }
          }
        }

        if (this.formsModel) {
          if (this.formsModel["rootfields"]) {
            this.formsModel["rootfields"].forEach((element) => {
              for (let key in this._needToSave["property"]) {
                if (element["fieldname"] == key) {
                  this._needToSave[key] = this._needToSave["property"][key];
                }
              }
            });
          }
        }

        if (this.isFilterListing && this._commonDataService.filterDataForDynamicPagesparams["search"] && this._commonDataService.filterDataForDynamicPagesparams["search"][0]) {
          this._needToSave[this._commonDataService.filterDataForDynamicPagesparams["search"][0]["searchfield"]] = this._commonDataService.filterDataForDynamicPagesparams["search"][0]["searchvalue"];
        }

        this.isdisablesavebutton = true;
        this._commonService
          .commonServiceByUrlMethodData(url, method, this._needToSave)
          .subscribe(
            (data) => {
              

              if (data && data.code == 11000 && data.errmsg) {
                this.isdisablesavebutton = false;
                this.recordexistshowNotification("top", "right", data.errmsg, "danger");
              } else {
                this.isdirty = false;
                
                setTimeout(() => {
                  this.isdisablesavebutton = false;
                }, 1000);

                this.showNotification("top", "right", this.jsUcfirst(this.dispalyformname) + " has been added successfully!!!", "success");
                this._router.navigate(["success"]);

                // if (this.isFilterListing && this._commonDataService.filterDataForDynamicPagesparams["returnURl"] !== "") {
                //   this._commonDataService.isfilterDataForDynamicPages = true;
                //   this._router.navigate([this._commonDataService.filterDataForDynamicPagesparams["returnURl"]]);
                // } else {
                //   if (this.formsModel.redirecturl != undefined && this.formsModel.redirecturl != "" && this.formsModel.redirecturl != null && this.formsModel._id != undefined) {
                //     if (data._id != undefined) {
                //       if (this.formsModel.redirecturl.includes(":_memberid")) {
                //         let url = this.formsModel.redirecturl.replace(":_memberid", data._id);
                //         this._router.navigate([url]);
                //       } else {
                //         this._router.navigate([this.formsModel.redirecturl + this.formsModel._id + "/" + data._id]);
                //       }
                //     } else {
                //       this._router.navigate(["pages/dynamic-list/list/" + this.formsModel.formname]);
                //     }
                //   } else {
                //     this._router.navigate(["pages/dynamic-list/list/" + this.formsModel.formname]);
                //   }
                // }

              }
            },
            (err) => {
              var body = JSON.parse(err._body);
              this.isdisablesavebutton = false;
              if (err.status == 500) {
                this.showNotification("top", "right", body.message, "danger");
              }
            }
          );
      } else {
        let nextTab = this.currentTab + 1;
        let tabName = this._tabLists[this.currentTab][0]["tabname"];
        this.onTabClick(nextTab, tabName);
      }
    }, 1000);
    
  }

  jsUcfirst(string: any) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  comparer(otherArray: any) {
    return function (current: any) {
      return (
        otherArray.filter(function (other: any) {
          return (
            other.value == current.value && other.display == current.display
          );
        }).length == 0
      );
    };
  }

  disabledDirtyData(submit_data: any) {
    this.isdirty = false;
    this._router.navigate(submit_data);
  }

}
