import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private url : string = "";
  httpOptions : any = null;

  constructor() {
  }

  private formatErrors(operation: any) {
    return (err: any) => {
      const errMsg = `error in ${operation}() recuperando ${this.url}`;
      console.log(`${errMsg}:`, err);
      if(err instanceof HttpErrorResponse) { 
          console.log(`status: ${err.status}, ${err.statusText}`);
          
          if (err.status === 401) { 
          }else if(err.status == 0){ 
          }else{ 
          }
      }
      err.message = errMsg;
      return throwError(() => new Error(err));
    } 
  }

  get(url: string, path: string, params: HttpParams = new HttpParams()): Observable<any> {
    debugger;
    //this.setToken();
    this.url = `${url}${path}`;
    return this.http.get<Response>(this.url)
      .pipe(catchError(this.formatErrors('get')));
  }

  put(url: string, path: string, body: Object = {}): Observable<any> {
    //this.setToken();
    this.url = `${url}${path}`;
    return this.http.put<Response>(
      this.url,
      JSON.stringify(body)
    ).pipe(catchError(this.formatErrors('put')));
  }

  post(url: string, path: string, body: Object = {}): Observable<any> {
    //this.setToken();
    this.url = `${url}${path}`;
    return this.http.post<any>(
      this.url,
      body
    ).pipe(  
    catchError(this.formatErrors('post')), 
    )
    ;
  }

  delete(url: string, path:any): Observable<any> {
    //this.setToken();
    this.url = `${url}${path}`;
    return this.http.delete<Response>(
      this.url
    ).pipe(catchError(this.formatErrors('delete')));
  }
}
