import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { Configuration } from './../../../app.constants';


@Injectable()
export class LookupsService {

    constructor(private http: Http, private configuration: Configuration) {

    }

    public GetAll = (): Observable<any> => {
        return this.http
            .get(this.configuration.actionUrl + 'lookups', { headers: this.configuration.headers })
            .map(res => <any>res.json());
    }

    public GetById = (id: string): Observable<any> => {

        return this.http
            .get(this.configuration.actionUrl + 'lookups/' + id, { headers: this.configuration.headers })
            .map(res => <any>res.json());
    }

    public GetByfilterLookupName = (data: any): Observable<any> => {
        const toAdd = JSON.stringify(data);
        return this.http.post(this.configuration.actionUrl + 'lookups/filter', toAdd, { headers: this.configuration.headers })
            .map(res => <any>res.json());
    }

    public AsyncGetByfilterLookupName = (data: any): Promise<any> => {
        const toAdd = JSON.stringify(data);
        return this.http.post(this.configuration.actionUrl + 'lookups/filter', toAdd, { headers: this.configuration.headers })
            .map(res => <any>res.json())
            .toPromise();
    }

    public async GetByfilterLookupNameAsync(data: any): Promise<any> {
        const toAdd = JSON.stringify(data);
        return this.http.post(this.configuration.actionUrl + 'lookups/filter', toAdd, { headers: this.configuration.headers })
            .map(res => <any>res.json())
            .toPromise();
    }

    public Add = (data: any): Observable<any> => {
        const toAdd = JSON.stringify(data);
        return this.http.post(this.configuration.actionUrl + 'lookups', toAdd, { headers: this.configuration.headers })
            .map(res => <any>res.json());
    }

    public Update = (id: string, data: any): Observable<any> => {
        const toAdd = JSON.stringify(data);

        return this.http.put(this.configuration.actionUrl + 'lookups/' + id, toAdd, { headers: this.configuration.headers })
            .map(res => <any>res.json());
    }

    public Delete = (id: string): Observable<any> => {

        return this.http
            .delete(this.configuration.actionUrl + 'lookups/' + id, { headers: this.configuration.headers })
            .map(res => <any>res.json());
    }

}