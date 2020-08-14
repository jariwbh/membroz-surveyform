
import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { AppInjector } from "../../app-injector";

import { AuthService } from "../../core/services/common/auth.service";
import { LangresourceService } from '../../core/services/langresource/langresource.service';

import { SafeHtml } from '@angular/platform-browser';

declare var $: any;

@Component({
  selector: 'app-base-lite-componemnt',
  templateUrl: './base-lite-componemnt.component.html',
  styleUrls: ['./base-lite-componemnt.component.css']
})
export class BaseLiteComponemntComponent implements OnInit {

  protected _authService: AuthService;

  protected _loginUser: any;
  protected _loginUserId: any;
  protected _loginUserRole: any;
  protected _loginUserRoleId: any;
  protected _loginUserMembershipId: any;
  protected _loginUserClassId: any;
  protected _loginUserBranchId: any;
  protected _loginUserRoleName: any;

  protected _langresourceService: LangresourceService;
  protected _router: Router;

  public langVisibility = false;
  public langResource: any;
  public defaultLanguage: any;
  public pagename: any;
  public gDateFormat: any = "MM/dd/yyyy";


  constructor() {
    //const injector = AppInjector.getInjector();
    this._authService = AppInjector.get(AuthService);
    this._langresourceService = AppInjector.get(LangresourceService);
    this._router = AppInjector.get(Router);

    this.langVisibility = false;
  }

  async ngOnInit() {
    this.defaultLanguage = "ENG";
    this.defaultLanguage = this._authService.auth_language;
    this.langVisibility = false;
    this.langResource = {};

    this.initialize(); // LOGIN VARIABLES
    this.loadLangResource(this.pagename); // INITIALIZE LANG VARIABLE
  }

  // LOGIN VARIABLES
  initialize() {
    if (this._authService.currentUser) {

      this._loginUserId = this._authService.currentUser._id;
      this._loginUser = this._authService.currentUser.user;
      this._loginUserRole = this._authService.auth_role;
      this._loginUserRoleId = this._authService.auth_role['_id'];
      this._loginUserRoleName = this._authService.currentUser.user.role.rolename;

      if (this._authService.auth_user) {
        if (this._authService.auth_role["roletype"] == "M") {
          if (this._authService.auth_user.membershipid) {
            this._loginUserMembershipId = this._authService.auth_user.membershipid[
              "_id"
            ];
          }
          if (this._authService.auth_user.classid) {
            this._loginUserClassId = this._authService.auth_user.classid;
          }
        }
      }

      if (
        this._authService &&
        this._authService.auth_user &&
        this._authService.auth_user.branchid &&
        this._authService.auth_user.branchid._id
      ) {
        this._loginUserBranchId = this._authService.auth_user.branchid._id;
      }
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


  autocompleListFormatter = (data: any): SafeHtml => {
    let html = `<span>${data.name}  </span>`;
    return html;
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

}
