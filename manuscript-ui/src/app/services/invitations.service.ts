import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {RestErrorsHandlerService} from "./rest-errors-handler.service";
import {TownCrierService} from "./town-crier.service";
import {environment} from "../../environments/environment";
import {catchError, from, map} from "rxjs";
import {InvitationRequestModel} from "../models/InvitationRequestModel";

@Injectable({
  providedIn: 'root'
})
export class InvitationsService {
  constructor(private http: HttpClient, private router: Router,
              private restErrorsHandlerService: RestErrorsHandlerService, private townCrier: TownCrierService) {
  }

  getAllInvitations() {
    this.townCrier.info("Please wait while all invitation requests are being retrieved...");
    return from(this.http.get<InvitationRequestModel[]>(`${environment.baseUrl}${environment.RESOURCE_GET_ALL_INVITATIONS}`))
      .pipe(map((invitationRequests: InvitationRequestModel[]) => {
          this.townCrier.info("All invitation requests retrieved successfully.");
          return invitationRequests;
        }),
        catchError(errorRes => {
          this.townCrier.error(errorRes.error)
          return this.restErrorsHandlerService.handleRequestError(errorRes);
        }));
  }

  approveRequest(email: string) {
    return from(this.http.get<InvitationRequestModel[]>(`${environment.baseUrl}${environment.RESOURCE_APPROVE_INVITATION_REQUEST}${email}`))
      .pipe(map((invitationRequests: InvitationRequestModel[]) => {
          this.townCrier.info("User has been approved successfully.");
          return invitationRequests;
        }),
        catchError(errorRes => {
          this.townCrier.error(errorRes.error)
          return this.restErrorsHandlerService.handleRequestError(errorRes);
        }));
  }

  denyRequest(email: string) {
    return from(this.http.get<InvitationRequestModel[]>(`${environment.baseUrl}${environment.RESOURCE_DENY_INVITATION_REQUEST}${email}`))
      .pipe(map((invitationRequests: InvitationRequestModel[]) => {
          this.townCrier.info("User has been denied successfully.");
          return invitationRequests;
        }),
        catchError(errorRes => {
          this.townCrier.error(errorRes.error)
          return this.restErrorsHandlerService.handleRequestError(errorRes);
        }));
  }
}
