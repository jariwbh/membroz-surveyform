
import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { Configuration } from './../../../app.constants';

@Injectable()
export class FormsService {
  constructor(private http: Http, private configuration: Configuration) {}

  public GetAll = (): Observable<any> => {
    return this.http
      .get(this.configuration.actionUrl + "forms", {
        headers: this.configuration.headers,
      })
      .map((res) => <any>res.json());
  };

  public AsyncGetAll = (): Promise<any> => {
    return this.http
      .get(this.configuration.actionUrl + "forms", {
        headers: this.configuration.headers,
      })
      .map((res) => <any>res.json())
      .toPromise();
  };

  public GetBySchema = (schemaname: any): Observable<any> => {
    return this.http
      .get(this.configuration.actionUrl + "forms/schemas/" + schemaname, {
        headers: this.configuration.headers,
      })
      .map((res) => <any>res.json());
  };

  public async GetByIdAsync(id: number): Promise<any>  {
    return this.http
      .get(this.configuration.actionUrl + "forms/" + id, {
        headers: this.configuration.headers,
      })
      .map((res) => <any>res.json())
      .toPromise();
  }

  public async GetByfilterAsync(data: any): Promise<any> {
    const toAdd = JSON.stringify(data);

    return this.http
      .post(this.configuration.actionUrl + "forms/filter", toAdd, {
        headers: this.configuration.headers,
      })
      .map((res) => <any>res.json())
      .toPromise();
  }

  public GetById = (id: number): Observable<any> => {
    return this.http
      .get(this.configuration.actionUrl + "forms/" + id, {
        headers: this.configuration.headers,
      })
      .map((res) => <any>res.json());
  };

  public GetByfilter = (data: any): Observable<any> => {
    const toAdd = JSON.stringify(data);
    return this.http
      .post(this.configuration.actionUrl + "forms/filter", toAdd, {
        headers: this.configuration.headers,
      })
      .map((res) => <any>res.json());
  };

  public Add = (data: any): Observable<any> => {
    const toAdd = JSON.stringify(data);
    return this.http
      .post(this.configuration.actionUrl + "forms/", toAdd, {
        headers: this.configuration.headers,
      })
      .map((res) => <any>res.json());
  };

  public Update = (id: number, data: any): Observable<any> => {
    const toAdd = JSON.stringify(data);
    return this.http
      .put(this.configuration.actionUrl + "forms/" + id, toAdd, {
        headers: this.configuration.headers,
      })
      .map((res) => <any>res.json());
  };

  public Delete = (id: number): Observable<any> => {
    return this.http
      .delete(this.configuration.actionUrl + "forms/" + id, {
        headers: this.configuration.headers,
      })
      .map((res) => <any>res.json());
  };
}
