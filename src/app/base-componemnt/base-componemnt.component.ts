
import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { AppInjector } from "../app-injector";

import { LangresourceService } from "../core/services/langresource/langresource.service";
import { AuthService } from "../core/services/common/auth.service";
import { FormsService } from "../core/services/forms/forms.service";
import { CompanySettingService } from "../core/services/admin/company-setting.service";
import { CommonService } from "../core/services/common/common.service";
import { RoleService } from "../core/services/role/role.service";

import { SafeHtml } from "@angular/platform-browser";

declare var $: any;

@Component({
  selector: 'app-base-componemnt',
  templateUrl: './base-componemnt.component.html',
  styleUrls: ['./base-componemnt.component.css']
})
export class BaseComponemntComponent implements OnInit {

  public _langresourceService: LangresourceService;
  public _authService: AuthService;
  public _router: Router;
  public _formsService: FormsService;
  public _companysettingService: CompanySettingService;
  public _commonService: CommonService;
  public _roleService: RoleService;

  public pagename: any;
  public _formId: any;
  public _formName: any;
  public formlistname: any;

  public langVisibility = false;
  public langResource: any;
  public defaultLanguage: any;

  public gDateFormat: any = "MM/dd/yyyy";
  public isLoadForms = false;
  public formObj: any;
  public subformObj: any;

  public isLoading: boolean = false;
  
  constructor() {

    //const injector = AppInjector.getInjector();

    console.log("AppInjector", AppInjector);

    this._langresourceService = AppInjector.get(LangresourceService);
    this._authService = AppInjector.get(AuthService);
    this._formsService = AppInjector.get(FormsService);
    this._router = AppInjector.get(Router);
    this._companysettingService = AppInjector.get(CompanySettingService);
    this._commonService = AppInjector.get(CommonService);
    this._roleService = AppInjector.get(RoleService);

    this.langVisibility = false;
    
  }

  async ngOnInit() {

    this.defaultLanguage = "ENG";
    this.defaultLanguage = this._authService.auth_language;
    this.langVisibility = false;
    this.langResource = {};

    try {
      console.log("1...");
      await this.getFormDetails(this._formId);
      console.log("2...");
      if (this.formlistname) {
        var formname = this.formlistname.split("-")[0];
        this.getsubFormDetails(formname);
      }
      console.log("3...");
      await this.getOrganizationsetting();
    } catch (error) {
      console.error({ error });
    } finally {
      console.log("4...");
      this.loadLangResource(this.pagename); // INITIALIZE LANG VARIABLE
    }

  }

  loadLangResource(pageName: any) {
    let postData = {};
    postData["search"] = [];
    postData["search"].push({
      searchfield: "pagename",
      searchvalue: pageName,
      criteria: "lk",
    });

    return this._langresourceService.GetByFilter(postData).subscribe((data) => {
      if (data && Array.isArray(data) && data.length !== 0) {
        this.langResource = {};
        let len = data.length;
        let cnt = 0;
        console.log("data", data);
        data.forEach((element) => {
          if (element.key && element.value) {
            this.langResource[element.key] = [];
            this.langResource[element.key] = element["value"][
              this.defaultLanguage
            ]
              ? element["value"][this.defaultLanguage]
              : element.key;
          }
          cnt++;
          if (cnt == len) {
            this.langVisibility = true;
          }
        });
      } else {
        this.langVisibility = false;
      }
    });
  }

  
  async getOrganizationsetting() {
    return this._companysettingService.GetAll().subscribe((data) => {
      if (data) {
        if (data[0] != undefined) {
          if (data[0].dateformat != undefined) {
            this.gDateFormat = data[0].dateformat;
            return;
          }
        }
      }
    });
  }

  

  async getFormDetails(id: any) {

    this.isLoadForms = true;
    this.isLoading = true;

    if (!id) {

      let postData = {};
      postData["search"] = [];
      postData["search"].push({searchfield: "formname", searchvalue: this._formName, criteria: "eq"});

      return this._formsService
        .GetByfilterAsync(postData)
        .then((data) => {

          if (data && data.length != 0) {
            this.isLoadForms = false;
            this.isLoading = false;
            this.formObj = data[0];
            this._formName = this.formObj.formname;
            return;
          }
        });

    } else {



      this.isLoadForms = true;

      return this._formsService
        .GetByIdAsync(id)
        .then((data) => {
          if (data) {

            this.formObj = data;
            this._formName = this.formObj.formname;

            this.isLoadForms = false;

            if (this.formObj["rootfields"]) {
              this.sortOn(this.formObj["rootfields"], "formorder");
            }
            return;
          }
        });
    }
  }

  getsubFormDetails(formlist: String) {
    this.isLoadForms = true;
    this.isLoading = true;
    let postData = {};
    postData["search"] = [];
    postData["search"].push({ searchfield: "formname", searchvalue: formlist, criteria: "eq" });

    this._formsService
      .GetByfilter(postData)
      .subscribe((data) => {
        if (data && data.length != 0) {
          this.subformObj = data[0];
          this.isLoadForms = false;
          this.isLoading = false;
        }
      });
  }

  

  sortOn(arr: any, prop: any) {
    arr.sort(function (a: any, b: any) {
      if (a[prop] > b[prop]) {
        return -1;
      } else if (a[prop] < b[prop]) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  showNotification(from: any, align: any, msg: any, type: any) {
    $.notify(
      {
        icon: "notifications",
        message: msg,
      },
      {
        type: type,
        timer: 3000,
        placement: {
          from: from,
          align: align,
        },
      }
    );
  }

  recordexistshowNotification(from: any, align: any, msg: any, type: any) {
    $.notify(
      {
        icon: "glyphicon glyphicon-duplicate",
        message: msg,
      },
      {
        type: type,
        timer: 3000,
        placement: {
          from: from,
          align: align,
        },
      }
    );
  }

  autocompleListFormatter = (data: any): SafeHtml => {
    let html = `<span>${data.name}  </span>`;
    return html;
  };

}
