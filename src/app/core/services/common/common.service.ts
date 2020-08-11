import { Injectable } from '@angular/core';
import { Headers, Http, Response, ResponseContentType } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeoutWith';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';

import { Configuration } from './../../../app.constants';

@Injectable()
export class CommonService {

    constructor(private http: Http, private configuration: Configuration) {
        
    }
    
    public GetByCollection = (data: any): Observable<any> => {
        const toAdd = JSON.stringify(data);
        return this.http.post(this.configuration.actionUrl + 'common', toAdd, { headers: this.configuration.headers })
            .map(res => <any>res.json());
    }

    public GetByCollectionClone = (data: any): Observable<any> => {
        const toAdd = JSON.stringify(data);
        return this.http.post(this.configuration.actionUrl + 'common/clone', toAdd, { headers: this.configuration.headers })
            .map(res => <any>res.json());
    }

    public GetByCollectionDistinct = (data: any): Observable<any> => {
        const toAdd = JSON.stringify(data);
        return this.http.post(this.configuration.actionUrl + 'common/distinct', toAdd, { headers: this.configuration.headers })
        .map(res => <any>res.json());
    }

    public templatetodoc = (data: any): Observable<any> => {
        const toAdd = JSON.stringify(data);
        
        return this.http.post(this.configuration.actionUrl + 'common/templatetodoc', toAdd, { headers: this.configuration.headers,responseType: ResponseContentType.Blob  })        
        .map(res => res.blob())
         
    }

    public validobject = (data: any): Observable<any> => {
        const toAdd = JSON.stringify(data);
        return this.http.post(this.configuration.actionUrl + 'common/validobject', toAdd, { headers: this.configuration.headers })
            .map(res => <any>res.json());
    }

    public distinctbyschema = (data: any): Observable<any> => {
        const toAdd = JSON.stringify(data);
        return this.http.post(this.configuration.actionUrl + 'common/distinctbyschema', toAdd, { headers: this.configuration.headers })
            .map(res => <any>res.json());
    }

    

    public commonServiceByUrlMethodIdOrData = (url: string, method: string, id?: string, data?: any): Observable<any> => {
        let urlstring = this.configuration.actionUrl;
        if (url != '') {
            urlstring = urlstring + url;
            if (id != '') {
                urlstring = urlstring + id;
            }
            if (method != '') {
                if (method == 'GET') {
                    return this.http.get(urlstring, { headers: this.configuration.headers })
                        .map(res => <any>res.json());
                } else if (method == 'GET' && (data != null || '')) {
                    const toAdd = JSON.stringify(data);
                    return this.http.get(urlstring, toAdd)
                        .map(res => <any>res.json());
                } else if (method == 'DELETE' && (id != null || '')) {
                    if (data !== undefined && data.formname !== undefined) {
                        if (!this.configuration.headers.has('formname')) {
                            this.configuration.headers.append('formname', data.formname);
                        }
                    }
                    return this.http
                        .delete(urlstring, { headers: this.configuration.headers })
                        .map(res => <any>res.json());
                }
            } else {
                return this.http.get(urlstring, { headers: this.configuration.headers })
                    .map(res => <any>res.json());
            }
        }


    }


    public commonServiceByUrlMethodData = (url: string, method: string, data: any, id?: string): Observable<any> => {
        let urlstring = this.configuration.actionUrl;
        if (url != '') {
            urlstring = urlstring + url;
            if (id != undefined && id != '') {
                urlstring = urlstring+"/" + id;
            }
            if (method != '') {
                if (method == 'POST' && (data != undefined || null)) {
                    const toAdd = JSON.stringify(data);
                    return this.http.post(urlstring, toAdd, { headers: this.configuration.headers })
                        .map(res => <any>res.json());

                } else if (method == 'PUT' && (data != undefined || null)) {
                    const toAdd = JSON.stringify(data);
                    return this.http.put(urlstring, toAdd, { headers: this.configuration.headers })
                        .map(res => <any>res.json());
                } else if (method == 'GET' && (data != null || '')) {
                    return this.http.get(urlstring, { headers: this.configuration.headers })
                        .map(res => <any>res.json());
                } 
            } else {
                const toAdd = JSON.stringify(data);
                return this.http.post(urlstring, toAdd, { headers: this.configuration.headers })
                    .map(res => <any>res.json());
            }
        }


    }

    public commonServiceByUrlMethodDataExpo = (url: string, method: string, data: any, id?: string): Observable<any> => {
        let urlstring = this.configuration.actionUrl;        
        if (url != '') {
            urlstring = urlstring + url;
            if (id != undefined && id != '') {
                urlstring = urlstring+"/" + id;
            }
            if (method != '') {
                if (method == 'POST' && (data != undefined || null)) {
                    const toAdd = JSON.stringify(data);
                    return this.http.post(urlstring, toAdd, { headers: this.configuration.headers, responseType: ResponseContentType.Blob })
                        .map(res => <any>res.blob());
                } else if (method == 'PUT' && (data != undefined || null)) {
                    const toAdd = JSON.stringify(data);
                    return this.http.put(urlstring, toAdd, { headers: this.configuration.headers, responseType: ResponseContentType.Blob })
                        .map(res => <any>res.blob());
                }
            } else {
                const toAdd = JSON.stringify(data);
                return this.http.post(urlstring, toAdd, { headers: this.configuration.headers, responseType: ResponseContentType.Blob })
                    .map(res => <any>res.blob());
            }
        }


    }

    public convertToCSV = (data: any): Observable<any> => {

        const toAdd = JSON.stringify(data);

        return this.http.post(this.configuration.actionUrl + 'common/exporttocsv', toAdd, { headers: this.configuration.headers, responseType: ResponseContentType.Blob })
           .map(res => res.blob())
        
    }

    public convertToPDF = (data: any): Observable<any> => {

        const toAdd = JSON.stringify(data);

        return this.http.post(this.configuration.actionUrl + 'common/exporttopdf', toAdd, { headers: this.configuration.headers, responseType: ResponseContentType.Blob })
            .map(res => res.blob())
        
    }

    public Getdynamicfieldsbyformane = (formname: any, type: any): Observable<any> => {
        return this.http
            .get(this.configuration.actionUrl + 'common/formfields/' + formname + '/' + type, { headers: this.configuration.headers })
            .map(res => <any>res.json());
    }

    public Getschemasbyschemasformane = (formname: any, schemas: any): Observable<any> => {
        return this.http
            .get(this.configuration.actionUrl  + schemas + '/schemas/' + formname, { headers: this.configuration.headers })
            .map(res => <any>res.json());
    }

    public Getreffieldsbyforname = (formname: any): Observable<any> => {
        return this.http
            .get(this.configuration.actionUrl + 'common/formname/' + formname, { headers: this.configuration.headers })
            .map(res => <any>res.json());
    }
    public summaryToCSV = (data: any): Observable<any> => {
        const toAdd = JSON.stringify(data);
        return this.http.post(this.configuration.actionUrl + 'common/generatecsv', toAdd, { headers: this.configuration.headers, responseType: ResponseContentType.Blob })
            .map(res => res.blob())
        // .map(res => <any>res.json());
    }

    public searchcontacts = (data: any): Observable<any> => {
        const toAdd = JSON.stringify(data);
        return this.http.post(this.configuration.actionUrl + 'common/searchcontacts', toAdd, { headers: this.configuration.headers })
            .map(res => <any>res.json());
    }

    public calTaxes = (branchstate: string, state: string, customtax: any, taxes?: any, amount?: any): any => {
        var branchstate = branchstate;
        var state = state;
        var customtax = customtax;
        var taxrate = 0; 
        var perAmount = 0;
        //console.log('taxes', taxes);
        console.log('branchstate', branchstate);
        console.log('state',state);
        console.log('cstmtax',customtax);
        //console.log('amount', amount);
        if(taxes != undefined && taxes.length > 0 &&  branchstate != undefined && branchstate != '' && state != undefined && state != ''){
            console.log('tx1');
            if (customtax) {
                if (state.toLowerCase() == branchstate.toLowerCase()) {
                    taxes.forEach(tax => {
                    if (tax.property["interstate"] == "No") {
                        taxrate += tax.amount;
                        if(amount != undefined){
                            //perAmount =(tax.amount / 100) * amount;
                            perAmount += Math.round(tax.amount) * parseInt(amount) / 100;
                        }
                        //taxdetail[tax.taxname] = roundTo.down(tax.amount, 2) * parseInt(element.amount - discount) / 100;
                    }
                    });
                }
                else {
                    taxes.forEach(tax => {
                    if (tax.property["interstate"] == "Yes") {
                        taxrate += tax.amount;
                        if(amount != undefined){
                            perAmount += Math.round(tax.amount) * parseInt(amount) / 100;
                        }
                    }
                    });
                }
                }
                else {
        
                taxes.forEach(tax => {
                    taxrate += tax.amount;
                    if(amount != undefined){
                        perAmount += Math.round(tax.amount) * parseInt(amount) / 100;
                    }
                });
        
            }
        } else if( taxes != undefined) {
            console.log('tx2');
            taxes.forEach(tax => {
                taxrate += tax.amount;
                if(amount != undefined){
                    perAmount += Math.round(tax.amount) * parseInt(amount) / 100;
                }
            });
        } else {
            console.log('tx3');
            taxrate = undefined;
            perAmount = undefined;
        }
           
        console.log("txrte", taxrate);
        console.log("prAmount", perAmount);

        if(amount != undefined){
            return perAmount;
        } else {
            return taxrate;
        }
       
        //if (taxrate > 0)
          //taxamount = parseInt((element.amount - discount) * (taxrate / 100));
    }


}