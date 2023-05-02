import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {RestErrorsHandlerService} from "./rest-errors-handler.service";
import {TownCrierService} from "./town-crier.service";
import {environment} from "../../environments/environment";
import {catchError, from, map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class InvitationsService {
  apiUrl: string = `${environment.baseUrl}/api/invitation`;

  constructor(private http: HttpClient,
              private router: Router,
              private restErrorsHandlerService: RestErrorsHandlerService,
              private townCrier: TownCrierService) {}


  getAllInvitations() {
    return from(this.http.get(`${environment.baseUrl}${environment.RESOURCE_GET_All_INVITATIONS}`))
      .pipe(
        map((res: any) => {
          console.log(res)
          return res;
        }),
        catchError(errorRes => {
          this.townCrier.error(errorRes.error)
          return this.restErrorsHandlerService.handleRequestError(errorRes);
        }));
  }

  acceptRequest(email: string) {
    return from(this.http.get(`${environment.baseUrl}${environment.RESOURCE_ACCEPT_REQUEST_INVITATIONS}${email}`))
      .pipe(
        map((res: any) => {
          console.log(res)
          return res;
        }),
        catchError(errorRes => {
          this.townCrier.error(errorRes.error)
          return this.restErrorsHandlerService.handleRequestError(errorRes);
        }));
  }

  denyRequest(email: string) {
    return from(this.http.get(`${environment.baseUrl}${environment.RESOURCE_DENY_REQUEST_INVITATIONS}${email}`))
      .pipe(
        map((res: any) => {
          console.log(res)
          return res;
        }),
        catchError(errorRes => {
          this.townCrier.error(errorRes.error)
          return this.restErrorsHandlerService.handleRequestError(errorRes);
        }));
  }
}
