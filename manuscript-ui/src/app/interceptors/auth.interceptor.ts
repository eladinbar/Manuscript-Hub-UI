import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {flatMap, from, Observable, take} from 'rxjs';
import {AngularFireAuth} from "@angular/fire/compat/auth";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private token$: Observable<string>;

  constructor(private auth: AngularFireAuth) {
    this.token$ = auth.user
      .pipe(
        flatMap(user => from(user!.getIdToken(true)))
      );
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.token$.pipe(take(1), flatMap((token) => {
      let newReq = req;
      if (token) {
        newReq = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`)
        });
      }
      return next.handle(newReq);
    }));
  }
}
