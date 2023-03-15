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

  registerNewUser(email: string, name: string, uid: string, token: string): Observable<any> {

    const data = {
      email,
      name,
      uid,
      newUser: true
    };
    console.log("email :" , email);
    console.log("name :" , name);
    console.log("uid :" , uid);
    return this.http.post(`${environment.baseUrl}/${this.controller}/register`, data, {
      headers: {
        Authorization: 'Bearer ' + token,
        skip: 'true'
      }
    });
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
    return this.http.post(`${environment.baseUrl}/${this.controller}/register`, data, {
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
