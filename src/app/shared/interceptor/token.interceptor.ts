import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('token');
    let headers 
    if(token!=null){
      headers = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`)
      });
    }else{
      headers = request.clone({
        headers: request.headers.set('Authorization', ``)
      });
    }
    return next.handle(headers);
  }
}
