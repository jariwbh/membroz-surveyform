import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { ActivatedRoute } from '@angular/router';

import {OrgnizationsettingService} from './core/services/public/orgnizationsetting.service'

@Injectable()
export class Configuration {

    public Server: string;    
    public actionUrl: string;
    public redirectUrl: string;
    public headers: Headers = new Headers();
    
    constructor(
        private route: ActivatedRoute,
        private orgnizationsettingService: OrgnizationsettingService,) {

        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
        

        

        this.route.queryParams.subscribe(params => {
            
            console.log("contasnt params", params);

            if(params['domain'] && params['https']) {
                
                var protocolStr = "http";
                if ( params['https'] &&  params['https'] == "true") {
                    protocolStr = "https";
                }

                this.Server = protocolStr + '://' + params['domain'] + '/';
                this.actionUrl = this.Server + 'api/';

            } else {
                this.Server = 'http://qa.membroz.com/';
                this.actionUrl = this.Server + 'api/';

                
            }

            
            this.orgnizationsettingService
                .GetBySetting(this.actionUrl, this.headers)
                .subscribe(data => {
                    if (data) {

                        console.log("data", data);

                        if (data[0] && data[0].memberportal && data[0].memberportal.authkey) {
                            this.headers.append('authkey', data[0].memberportal.authkey);
                        }

                        if (data[0] && data[0].memberportal && data[0].memberportal.redirecturl) {
                            this.redirectUrl = data[0].memberportal.redirecturl;
                        }
                    } 
                });

        });
    }
}
