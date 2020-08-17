
import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class OrgnizationsettingService {

    constructor(
        private http: Http, 
    ) {
        
    }

    public GetBySetting = (actionurl: any, header: any): Observable<any> => {
        return this.http
            .get(actionurl + 'organizationsettings', { headers: header })
            .map(res => <any>res.json());
    }

    
}