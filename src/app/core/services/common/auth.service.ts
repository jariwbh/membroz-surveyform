
import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { UserModel } from './../../models/auth/user.model';
import { Configuration } from './../../../app.constants';

@Injectable()
export class AuthService {
  updData:any;
  uptData:any;
  auth_email: string;
  auth_token: string;
  auth_role: string;
  auth_roletype: string;
  auth_id: string;
  auth_user: any;
  auth_currency: any;
  auth_language: any;
  auth_cloud_name: any;
  auth_rtl: boolean;

  //   customer_servicer_id : string;
  //   customer_servicer_urlname : string;
  // store the URL so we can redirect after logging in
  redirectUrl: string;
  currentUser: UserModel;

  constructor(
    private http: Http,
    private configuration: Configuration
  ) {
        this.createdta();
  }
  

  public saleschannelteamByloginId = (id: number): Observable<any> => {
    return this.http
      .get(this.configuration.actionUrl + 'auth/saleschannelteam/' + id)
      .map(res => <any>res.json());
  }

  login(user: any) {

     localStorage.setItem('currentUser', JSON.stringify(user));
     this.auth_email = user.username;
     this.auth_token = user.token;
     this.auth_role = user.role;
     this.auth_roletype = user.roletype;
     this.auth_id = user._id;
     this.auth_user = user.user;
     this.auth_currency = user.currency;
     this.auth_language = user.language;
     this.auth_cloud_name = user.cloud_name;
     this.auth_rtl = user.rtl;
     
     this.configuration.headers.delete('authtoken');
     this.configuration.headers.delete('authkey');
     this.configuration.headers.append('authtoken',user.token);
     this.configuration.headers.append('authkey',user._id);
    // localStorage.setItem('profilePicPath', JSON.stringify(user.user.profile_picture));
    
   
  }

  isLoggedIn() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (this.currentUser) {
      //this.setBodyClass();
      return true;
    } else {
      return false;
    }
  }

  getLoginUser() {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.auth_email = this.currentUser.username;
      this.auth_token = this.currentUser.token;
      this.auth_role = this.currentUser.role;
      this.auth_roletype = this.currentUser.roletype;
      this.auth_currency = this.currentUser.currency;
      this.auth_language = this.currentUser.language;
      this.auth_cloud_name = this.currentUser.cloud_name;
      this.auth_rtl = this.currentUser.rtl;

      this.auth_id = this.currentUser._id;
      this.auth_user = this.currentUser.user;
      if(!this.configuration.headers.has('authtoken')) {
        this.configuration.headers.delete('authtoken');
        this.configuration.headers.append('authtoken',this.currentUser.token);
      }
      if(!this.configuration.headers.has('authkey')) {
        this.configuration.headers.delete('authkey');
        this.configuration.headers.append('authkey',this.currentUser._id);
      }
      return this.currentUser;

  }

  //   getUserProfile(user_data){
  //     this.customer_servicer_id = user_data._id;
  //     this.customer_servicer_urlname = user_data.urlname;
  //   }

  logout(): void {
    //this.removeBodyClass();
    localStorage.removeItem('currentUser');
    this.auth_email = '';
    this.auth_token = '';
    this.auth_role = '';
    this.auth_id = '';
    this.auth_user = '';
    this.auth_currency = '';
    this.auth_language = '';
    this.auth_cloud_name = '';
    this.auth_rtl = false;
    // this.customer_servicer_id = '';
    // this.customer_servicer_urlname = '';
  }
  public updtedta(tmpd: any){
    if(tmpd == 'tsk')this.uptData.emit('tsk');
    if(tmpd == 'alrt')this.uptData.emit('alrt');
  }
  public ResetPassword = (data: any): Observable<any> => {
    const toAdd = JSON.stringify(data);
    return this.http.post(this.configuration.actionUrl + 'auth/member/resetpassword', toAdd, { headers: this.configuration.headers })
      .map(res => <any>res.json());
  }
  public ResetUserPassword = (data: any): Observable<any> => {
    const toAdd = JSON.stringify(data);
    return this.http.post(this.configuration.actionUrl + 'auth/user/resetpassword', toAdd, { headers: this.configuration.headers })
      .map(res => <any>res.json());
  }
  
  public AsyncGetByPermission = (data: any): Promise<any> => {
    const toAdd = JSON.stringify(data);
    return this.http.post(this.configuration.actionUrl + 'dispositionpermissions/permission', toAdd, { headers: this.configuration.headers })
        .map(res => <any>res.json())
        .toPromise();
}

  public createdta(){this.updData = new EventEmitter();this.uptData = new EventEmitter();}
  
}
