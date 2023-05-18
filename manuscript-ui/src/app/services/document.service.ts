import {Injectable} from '@angular/core';
import {catchError, from, map} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {RestErrorsHandlerService} from "./rest-errors-handler.service";
import {TownCrierService} from "./town-crier.service";
import {environment} from "../../environments/environment";
import {RouterEnum} from "../enums/RouterEnum";
import {DocumentInfoModel} from "../models/DocumentInfoModel";

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  constructor(private http: HttpClient, private router: Router,
              private restErrorsHandlerService: RestErrorsHandlerService, private townCrier: TownCrierService) {
  }

  uploadDocument(documentInfo: DocumentInfoModel, data: FormData) {
    return from(this.http.post<DocumentInfoModel>(`${environment.baseUrl}${environment.RESOURCE_UPLOAD_DOCUMENT_INFO}`, documentInfo))
      .pipe(
        map((metadataResponse: DocumentInfoModel) => {
          this.townCrier.info("Please wait until the new document is processed...");
          this.uploadDocumentData(data, metadataResponse.id!).subscribe();
          return metadataResponse;
        }),
        catchError(errorRes => {
          this.townCrier.error(errorRes.error);
          return this.restErrorsHandlerService.handleRequestError(errorRes);
        }));
  }

  private uploadDocumentData(data: FormData, id: string) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    return from(this.http.post(`${environment.baseUrl}${environment.RESOURCE_UPLOAD_DOCUMENT_DATA}/${id}`, data, {headers: headers}))
      .pipe(
        map((res: any) => {
          this.townCrier.info("Uploading document data...");
          this.router.navigate(['/' + RouterEnum.Dashboard]);
          return res;
        }),
        catchError(errorRes => {
          this.townCrier.error(errorRes.error);
          return this.restErrorsHandlerService.handleRequestError(errorRes);
        }));
  }

  updateDocumentInfo(documentInfo: DocumentInfoModel) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    return from(this.http.patch(`${environment.baseUrl}${environment.RESOURCE_UPDATE_DOCUMENT_INFO}`, documentInfo, {headers: headers}))
      .pipe(
        map((res: any) => {
          this.townCrier.info("Document is being updated.")
          return res;
        }),
        catchError(errorRes => {
          this.townCrier.error(errorRes.error);
          return this.restErrorsHandlerService.handleRequestError(errorRes);
        }));
  }

  getDocumentDataById(id: string, uid: string) {
    return from(this.http.get(`${environment.baseUrl}${environment.RESOURCE_GET_DOCUMENT_DATA_BY_ID}/${id}/${uid}`, {responseType: 'blob'}))
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(errorRes => {
          this.townCrier.error('No document found.');
          this.router.navigate(['/' + RouterEnum.Dashboard]);
          return this.restErrorsHandlerService.handleRequestError(errorRes);
        }));
  }

  getAllDocumentInfosByUid(uid: string) {
    return from(this.http.get(`${environment.baseUrl}${environment.RESOURCE_GET_ALL_DOCUMENT_INFOS_BY_UID}/${uid}`))
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(errorRes => {
          this.townCrier.error(errorRes.error);
          return this.restErrorsHandlerService.handleRequestError(errorRes);
        }));
  }

  getDocumentDatasByDocumentInfoId(documentInfoId: string, uid: string) {
    return from(this.http.get(`${environment.baseUrl}${environment.RESOURCE_GET_DOCUMENT_DATAS_BY_DOCUMENT_INFO_ID}/${documentInfoId}/${uid}`))
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(errorRes => {
          this.townCrier.error(errorRes.error);
          return this.restErrorsHandlerService.handleRequestError(errorRes);
        }));
  }

  deleteDocumentDataById(id: string, uid: string) {
    return from(this.http.delete(`${environment.baseUrl}${environment.RESOURCE_DELETE_DOCUMENT_DATA_BY_ID}/${id}/${uid}`))
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(errorRes => {
          this.townCrier.error(errorRes.error);
          return this.restErrorsHandlerService.handleRequestError(errorRes);
        }));
  }

  deleteDocumentInfoById(id: string, uid: string) {
    return from(this.http.delete(`${environment.baseUrl}${environment.RESOURCE_DELETE_DOCUMENT_INFO_BY_ID}/${id}/${uid}`))
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(errorRes => {
          this.townCrier.error(errorRes.error);
          return this.restErrorsHandlerService.handleRequestError(errorRes);
        }));
  }

}
