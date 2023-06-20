import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {RoleEnum} from "../../enums/RoleEnum";
import {CryptoService} from "../crypto.service";
import {UserModel} from "../../models/UserModel";
import {InvitationRequestModel} from "../../models/InvitationRequestModel";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor(private http: HttpClient, public cryptoService: CryptoService) { }

  registerNewUser(email: string, uid: string, name: string, phoneNumber: string, role: RoleEnum): Observable<any> {
    const user: UserModel = {
      uid: uid,
      email: email,
      name: name,
      phoneNumber: phoneNumber,
      role: role
    };

    return this.http.post<InvitationRequestModel[]>(`${environment.baseUrl}${environment.RESOURCE_CREATE_INVITATION_REQUEST}`, user);
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
    return this.http.get<UserModel>(`${environment.baseUrl}${environment.RESOURCE_GET_USER_BY_ID}/${id}`);
  }

  getUserByUid(uid: string) {
    return this.http.get<UserModel>(`${environment.baseUrl}${environment.RESOURCE_GET_USER_BY_UID}/${uid}`);
  }
}
