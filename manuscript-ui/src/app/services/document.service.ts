import {Injectable} from '@angular/core';
import {catchError, from, map} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {RestErrorsHandlerService} from "./rest-errors-handler.service";
import {TownCrierService} from "./town-crier.service";
import {environment} from "../../environments/environment";
import {RouterEnum} from "../enums/RouterEnum";
import {DocumentMetadataModel} from "../models/DocumentMetadataModel";

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  constructor(private http: HttpClient, private router: Router,
              private restErrorsHandlerService: RestErrorsHandlerService, private townCrier: TownCrierService) {
  }

  uploadDocument(metadata: DocumentMetadataModel, data: FormData) {
    console.log("metadata")
    return from(this.http.post<DocumentMetadataModel>(`${environment.baseUrl}${environment.RESOURCE_UPLOAD_DOCUMENT_METADATA}`, metadata))
      .pipe(
        map((metadataResponse: DocumentMetadataModel) => {
          this.townCrier.info("Please wait until the new document is processed...");
          this.uploadDocumentData(data, metadataResponse.id!).subscribe();
          return metadataResponse;
        }),
        catchError(errorRes => {
          this.townCrier.error(errorRes.error)
          return this.restErrorsHandlerService.handleRequestError(errorRes);
        }));
  }

  private uploadDocumentData(data: FormData, id: string) {
    console.log("data")
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
          this.townCrier.error(errorRes.error)
          return this.restErrorsHandlerService.handleRequestError(errorRes);
        }));
  }

  updateDocumentMetadata(documentMetadata: DocumentMetadataModel) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    return from(this.http.patch(`${environment.baseUrl}${environment.RESOURCE_UPDATE_DOCUMENT_METADATA}`, documentMetadata, {headers: headers}))
      .pipe(
        map((res: any) => {
          this.townCrier.info("Document is being updated.")
          return res;
        }),
        catchError(errorRes => {
          this.townCrier.error(errorRes.error)
          return this.restErrorsHandlerService.handleRequestError(errorRes);
        }));
  }

  getDocumentDataById(id: string | undefined) {
    return from(this.http.get(`${environment.baseUrl}${environment.RESOURCE_GET_DOCUMENT_DATA_BY_ID}/${id}`, {responseType: 'blob'}))
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(errorRes => {
          this.townCrier.error('No document found.')
          this.router.navigate(['/' + RouterEnum.Dashboard]);
          return this.restErrorsHandlerService.handleRequestError(errorRes);
        }));
  }

  getAllDocumentsMetadataByUid(uid: string) {
    return from(this.http.get(`${environment.baseUrl}${environment.RESOURCE_GET_ALL_DOCUMENTS_METADATA_BY_UID}/${uid}`))
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(errorRes => {
          this.townCrier.error(errorRes.error)
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
          this.townCrier.error(errorRes.error)
          return this.restErrorsHandlerService.handleRequestError(errorRes);
        }));
  }
}
