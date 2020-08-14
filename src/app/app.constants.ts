import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class Configuration {

    public Server: string;    
    public actionUrl: string;
    public headers: Headers = new Headers();
    
    constructor(private route: ActivatedRoute,) {

        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
        this.headers.append('authkey', '5a2cbf23ee5c2a1080793272');

        this.route.queryParams.subscribe(params => {
            
            console.log("contasnt params", params);

            if(params['domain'] && params['https']) {
                
                var protocolStr = "http";
                if ( params['https'] &&  params['https'] == "true") {
                    protocolStr = "https";
                }

                this.Server = protocolStr + '://' + params['domain'] + '/';
                this.actionUrl = this.Server + 'api/';

                console.log("if", this.actionUrl);

            } else {
                this.Server = 'http://qa.membroz.com/';
                this.actionUrl = this.Server + 'api/';

                console.log("else", this.actionUrl);
            }
        });
    }
}
