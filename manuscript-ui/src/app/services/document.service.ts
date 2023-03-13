import { Injectable } from '@angular/core';
import {catchError, from, map} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {RestErrorsHandlerService} from "./rest-errors-handler.service";
import {TownCrierService} from "./town-crier.service";
import {environment} from "../../environments/environment";
import {RouterEnum} from "../enums/RouterEnum";

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(private http: HttpClient,
              private router: Router,
              private restErrorsHandlerService: RestErrorsHandlerService,
              private townCrier: TownCrierService) {
  }
  getAllDocuments() {
    return from(this.http.get(`${environment.baseUrl}${environment.RESOURCE_GET_All_DOCUMENTS}`))
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


  getDocumentById(id: string | undefined) {
    return from(this.http.get(`${environment.baseUrl}${environment.RESOURCE_GET_DOCUMENT_BY_ID}${id}`, {responseType: 'blob'}))
      .pipe(
        map((res: any) => {
          console.log(res)

          return res;
        }),
        catchError(errorRes => {
          this.townCrier.error('No Document found')
          this.router.navigate(['/' + RouterEnum.Dashboard]);
          return this.restErrorsHandlerService.handleRequestError(errorRes);
        }));
  }


  uploadDocument(data: FormData) {

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    return from( this.http.post(`${environment.baseUrl}${environment.RESOURCE_UPLOAD_FILE}`,data,{ headers: headers } ))
      .pipe(
        map((res: any) => {
          this.townCrier.info("Wait till new document processed..")
          return res;
        }),
        catchError(errorRes => {
          this.townCrier.error(errorRes.error)
          return this.restErrorsHandlerService.handleRequestError(errorRes);
        }));
  }
}
