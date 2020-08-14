
import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { Configuration } from './../../../app.constants';


@Injectable()
export class FieldoptionsService {

    constructor(private http: Http, private configuration: Configuration) {
        
    }
    
    public GetAll = (): Observable<any> => {
        return this.http
            .get(this.configuration.actionUrl + 'formfieldoptions', { headers: this.configuration.headers })
            .map(res => <any>res.json());
    }

    public GetById = (id: any): Observable<any> => {
       return this.http
           .get(this.configuration.actionUrl + 'formfieldoptions/' + id, { headers: this.configuration.headers })
           .map(res => <any>res.json());
    }

    
    public Add = (data: any): Observable<any> => {
       const toAdd = JSON.stringify(data);
       return this.http.post(this.configuration.actionUrl + 'formfieldoptions', toAdd, { headers: this.configuration.headers })
           .map(res => <any>res.json());
    }

    public Update = (id: number, data: any): Observable<any> => {
       const toAdd = JSON.stringify(data);
       return this.http.put(this.configuration.actionUrl + 'formfieldoptions/' + id, toAdd, { headers: this.configuration.headers })
           .map(res => <any>res.json());
    }

    public Delete = (id: number): Observable<any> => {
       
       return this.http
           .delete(this.configuration.actionUrl + 'formfieldoptions/' + id, { headers: this.configuration.headers })
           .map(res => <any>res.json());
    }

    public getbyfilter = (data: any): Observable<any> => {
        const toAdd = JSON.stringify(data);
        return this.http.post(this.configuration.actionUrl + 'formfieldoptions/filter', toAdd, { headers: this.configuration.headers })
            .map(res => <any>res.json());
     }

}
