import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse, HttpStatusCode
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Router} from "@angular/router";
import {AuthService} from "../services/auth/auth.service";
import {catchError} from "rxjs/operators";

@Injectable()
export class HttpErrorInterceptorService implements HttpInterceptor {

  constructor( private router: Router,private authService:AuthService) {
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe
    (
      catchError((err:HttpErrorResponse)=>{
        if(err?.status===HttpStatusCode.Unauthorized){
          this.authService.signOut()
        }
        return throwError(err)
      })
    );
  }
}
