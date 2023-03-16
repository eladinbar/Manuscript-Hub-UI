import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {catchError, map, shareReplay} from "rxjs/operators";
import {Roles} from "../models/Roles";
@Injectable({
  providedIn: 'root'
})
export class AccountService {
  controller =  'api/accountController';
  private roleReuslt$: Observable<any> | undefined;
  constructor(private http: HttpClient) { }

  registerNewUser(email: string, uid: string, name: string, phoneNumber: string, role: string): Observable<any> {

    const data = {
      email,
      uid,
      name,
      phoneNumber,
      role
    };

    return this.http.post(`${environment.baseUrl}/${this.controller}/registerNew`, data);

  }
  authenticateUser(uid: string, email:string ,name:string, token: string): Observable<any> {
    if(!name){
      name = email;
    }
    const data = {
      uid,
      email,
      name
    };
    console.log("data " , data);
    return this.http.post(`${environment.baseUrl}/${this.controller}/login`, data, {
      headers: {
        Authorization: 'Bearer ' + token,
        skip: 'true'
      }
    });
  }

  getUserAuthRole(): Observable<string> {
    return this.http.get<string>(`${environment.baseUrl}/${this.controller}/getRole`);
  }

  public getSession(): Promise<boolean> {
    const session = localStorage.getItem('token');
    return new Promise((resolve, reject) => {
      if (session) {
        return resolve(true);
      } else {
        return reject(false);
      }
    });
  }

  public getUserRoless(): Observable<any> {
    if (!this.roleReuslt$) {
      this.roleReuslt$ = this.http
        .get(`${environment.baseUrl}/api/user/getRole`)
        .pipe(map((res: any) => {
          res.push(Roles.GUEST);
          return res;
        }), shareReplay(1));
    }
    return this.roleReuslt$;
  }
  public areUserRolesAllowed(userRoles: string[], allowedUserRoles: Roles[]): boolean {
    for (const role of userRoles) {
      for (const allowedRole of allowedUserRoles) {
        if (role.toLowerCase() === allowedRole.toLowerCase()) {
          return true;
        }
      }
    }
    return false;
  }
}
