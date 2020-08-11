
import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { Configuration } from './../../../app.constants';


@Injectable()
export class PublicService {

    constructor(
        private http: Http, 
        private configuration: Configuration
    ) {
        console.log("configuration", this.configuration);
    }

    public paymentgateway = (data: any): Observable<any> => {
        
        const toAdd = JSON.stringify(data);
        return this.http.post(this.configuration.actionUrl + 'public/paymentgateway', toAdd, { headers: this.configuration.headers })
            .map(res => <any>res.json());
    }

    public onlinepayment = (data: any): Observable<any> => {
        
        const toAdd = JSON.stringify(data);
        return this.http.post(this.configuration.actionUrl + 'public/onlinepayment', toAdd, { headers: this.configuration.headers})
            .map(res => <any>res.json());
    }

    public stripeSuccess = (data: any): Observable<any> => {
        
        const toAdd = JSON.stringify(data);
        return this.http.post(this.configuration.actionUrl + 'public/stripesuccess', toAdd, { headers: this.configuration.headers})
            .map(res => <any>res.json());
    }

    public razorpaySuccess = (data: any): Observable<any> => {
        
        const toAdd = JSON.stringify(data);
        return this.http.post(this.configuration.actionUrl + 'public/razorpaysuccess', toAdd, { headers: this.configuration.headers})
            .map(res => <any>res.json());
    }

    public createFormData = (data: any): Observable<any> => {
        const toAdd = JSON.stringify(data);
        return this.http.post(this.configuration.actionUrl + 'public/createformdata', toAdd, { headers: this.configuration.headers })
            .map(res => <any>res.json());
    }

    public GetByFormId = (id: number): Observable<any> => {
        return this.http
            .get(this.configuration.actionUrl + 'public/forms/' + id, { headers: this.configuration.headers })
            .map(res => <any>res.json());
    }

    public GetFormFieldByFormId = (data: any): Observable<any> => {
        const toAdd = JSON.stringify(data);
        return this.http.post(this.configuration.actionUrl + 'public/formfields/filter', toAdd, { headers: this.configuration.headers})
            .map(res => <any>res.json());
    }
}