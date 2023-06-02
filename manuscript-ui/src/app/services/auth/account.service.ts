import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {map, shareReplay} from "rxjs/operators";
import {RoleEnum} from "../../enums/RoleEnum";
import {CryptoService} from "../crypto.service";
import {UserModel} from "../../models/UserModel";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  invitationUrl = 'api/invitation';
  userApiUrl = 'api/user';
  private roleResult$: Observable<any> | undefined;

  constructor(private http: HttpClient, public cryptoService: CryptoService) { }

  registerNewUser(email: string, uid: string, name: string, phoneNumber: string, role: RoleEnum): Observable<any> {
    const user: UserModel = {
      email: email,
      uid: uid,
      name: name,
      phoneNumber: phoneNumber,
      role: role
    };

    // return this.http.post(`${environment.baseUrl}/${this.controller}/register`, data);
    return this.http.post(`${environment.baseUrl}/${this.invitationUrl}/createInvitation`, user);
  }

  authenticateUser(uid: string, email: string, name: string, token: string): Observable<any> {
    if (!name) {
      name = email;
    }
    const userData = {
      uid,
      email,
      name
    };
    return this.http.post<UserModel>(`${environment.baseUrl}${environment.RESOURCE_LOGIN}`, userData, {
      headers: {
        Authorization: 'Bearer ' + token,
        skip: 'true'
      }
    }).pipe(map((userModel: UserModel) => {
      localStorage.setItem("role", <string>this.cryptoService.encrypt(userModel.role))  //todo: should be changed
      return userModel;
    }));
  }

  getUserById(id: string) {
    return this.http.get<UserModel>(`${environment.baseUrl}/${this.userApiUrl}/getUserById/${id}`);
  }

  getUserByUid(uid: string) {
    return this.http.get<UserModel>(`${environment.baseUrl}/${this.userApiUrl}/getUserByUid/${uid}`);
  }

  getUserAuthRole(): Observable<string> {
    return this.http.get<string>(`${environment.baseUrl}/${this.invitationUrl}/getRole`);
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

  public getUserRoles(): Observable<any> {
    if (!this.roleResult$) {
      this.roleResult$ = this.http
        .get(`${environment.baseUrl}/api/user/getRole`)
        .pipe(map((res: any) => {
          // res.push(RoleEnum.Guest);
          return res;
        }), shareReplay(1));
    }
    return this.roleResult$;
  }

  public areUserRolesAllowed(userRoles: string[], allowedUserRoles: RoleEnum[]): boolean {
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
