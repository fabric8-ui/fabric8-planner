import { Injectable } from "@angular/core";
import { Headers, Http } from "@angular/http";

@Injectable()
export class Requests {

	private headers = new Headers({'Content-Type': 'application/json'});
	
	constructor(private http: Http) { }

	get(url: string, data: Object = {}): Promise<any> {
		let ret:string[] = [];
		for (var d in data){
			ret.push(
				encodeURIComponent(d) + "=" + encodeURIComponent(data[d])
			);
		}
		let fullUrl: string = url;
		if (ret.length)fullUrl += "?"+ret.join("&");
		console.log(fullUrl);
		
		return this.http
			.get(fullUrl)
			.toPromise()
			.then(response => process.env.ENV!='inmemory'?response.json() :response.json().data)
			.catch(this.handleError);
	}

	delete(url: string): Promise<any> {
		return this.http
			.delete(url, {headers: this.headers, body: ""})
			.toPromise()
			.then(() => null)
			.catch(this.handleError);
	}

	post(url: string, data: Object = {}): Promise<any> {
		return this.http
			.post(url, JSON.stringify(data), {headers: this.headers})
			.toPromise()
			.then(response => response.json())
			.catch(this.handleError);
	}

	put(url: string, data: Object = {}): Promise<any> {
		return this.http
			.put(url, JSON.stringify(data), {headers: this.headers})
			.toPromise()
			.then(response => response.json())
			.catch(this.handleError);
	}

	handleError(error: any): Promise<any> {
    	console.error('An error occurred', error);
    	return Promise.reject(error.message || error);
  	}

}
