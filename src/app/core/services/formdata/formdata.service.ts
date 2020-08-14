
import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { Configuration } from './../../../app.constants';

@Injectable()
export class FormdataService {

    constructor(private http: Http, private configuration: Configuration) {

    }

    public GetAll = (): Observable<any> => {
        return this.http
            .get(this.configuration.actionUrl + 'formdatas', { headers: this.configuration.headers })
            .map(res => <any>res.json());
    }

    public GetByfilter = (data: any): Observable<any> => {
        const toAdd = JSON.stringify(data);
        return this.http.post(this.configuration.actionUrl + 'formdatas/filter', toAdd, { headers: this.configuration.headers })
            .map(res => <any>res.json());
    }

    public AsyncGetByfilter = (data: any): Promise<any> => {
        const toAdd = JSON.stringify(data);
        return this.http.post(this.configuration.actionUrl + 'formdatas/filter', toAdd, { headers: this.configuration.headers })
            .map(res => <any>res.json())
            .toPromise();
    }


    public async GetByfilterAsync (data: any): Promise<any> {
        const toAdd = JSON.stringify(data);
        return this.http.post(this.configuration.actionUrl + 'formdatas/filter', toAdd, { headers: this.configuration.headers })
            .map(res => <any>res.json()).toPromise();
    }
    

    public GetByfilterIntegration = (data: any): Observable<any> => {
        const toAdd = JSON.stringify(data);
        return this.http.post(this.configuration.actionUrl + 'formdatas/filterIntegration', toAdd, { headers: this.configuration.headers })
            .map(res => <any>res.json());
    }

    public GetById = (id: number): Observable<any> => {
        return this.http
            .get(this.configuration.actionUrl + 'formdatas/' + id, { headers: this.configuration.headers })
            .map(res => <any>res.json());
    }

    public Add = (data: any): Observable<any> => {
        const toAdd = JSON.stringify(data);
        return this.http.post(this.configuration.actionUrl + 'formdatas', toAdd, { headers: this.configuration.headers })
            .map(res => <any>res.json());
    }

    public Update = (id: any, data: any): Observable<any> => {
        const toAdd = JSON.stringify(data);
        return this.http.put(this.configuration.actionUrl + 'formdatas/' + id, toAdd, { headers: this.configuration.headers })
            .map(res => <any>res.json());
    }

    public Delete = (id: number): Observable<any> => {

        return this.http
            .delete(this.configuration.actionUrl + 'formdatas/' + id, { headers: this.configuration.headers })
            .map(res => <any>res.json());
    }

}
