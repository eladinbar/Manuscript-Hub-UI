import {Injectable} from '@angular/core';
import {catchError, from, map, of} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {RestErrorsHandlerService} from "./rest-errors-handler.service";
import {TownCrierService} from "./town-crier.service";
import {environment} from "../../environments/environment";
import {RouterEnum} from "../enums/RouterEnum";
import {DocumentInfoModel} from "../models/DocumentInfoModel";
import {DocumentDataModel} from "../models/DocumentDataModel";

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  constructor(private http: HttpClient, private router: Router,
              private restErrorsHandlerService: RestErrorsHandlerService, private townCrier: TownCrierService) {
  }

  uploadDocument(documentInfo: DocumentInfoModel, data: FormData) {
    return from(this.http.post<DocumentInfoModel>(`${environment.baseUrl}${environment.RESOURCE_UPLOAD_DOCUMENT_INFO}`, documentInfo))
      .pipe(map((documentInfo: DocumentInfoModel) => {
        this.townCrier.info("Please wait while the new document is being processed...");
        this.uploadDocumentData(data, documentInfo.id!, documentInfo.uid).subscribe();
        return documentInfo;
      }), catchError(errorRes => {
        this.townCrier.error(errorRes.error);
        return this.restErrorsHandlerService.handleRequestError(errorRes);
      }));
  }

  private uploadDocumentData(data: FormData, id: string, uid: string) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    return from(this.http.post(`${environment.baseUrl}${environment.RESOURCE_UPLOAD_DOCUMENT_DATA}/${id}/${uid}`, data, {headers: headers, responseType: "text"}))
      .pipe(map((res: string) => {
        this.townCrier.info(res);
        this.router.navigate(['/' + RouterEnum.Dashboard]);
        return of(true);
      }), catchError(errorRes => {
        this.townCrier.error(errorRes.error);
        this.restErrorsHandlerService.handleRequestError(errorRes);
        return of(false);
      }));
  }

  updateDocumentInfo(documentInfo: DocumentInfoModel) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    this.townCrier.info("Please wait while document info is being updated...");
    return from(this.http.patch<DocumentInfoModel>(`${environment.baseUrl}${environment.RESOURCE_UPDATE_DOCUMENT_INFO}`, documentInfo, {headers: headers}))
      .pipe(map((documentInfo: DocumentInfoModel) => {
        this.townCrier.info("The document's info has been updated.");
        return documentInfo;
      }), catchError(errorRes => {
        this.townCrier.error(errorRes.error);
        return this.restErrorsHandlerService.handleRequestError(errorRes);
      }));
  }

  shareDocument(documentInfo: DocumentInfoModel, sharedUserEmails: Array<String>) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    this.townCrier.info("Please wait while document info is being updated...");
    return from(this.http.patch<DocumentInfoModel>(`${environment.baseUrl}${environment.RESOURCE_SHARE_DOCUMENT}/${sharedUserEmails}`, documentInfo, {headers: headers}))
      .pipe(map((documentInfo: DocumentInfoModel) => {
        this.townCrier.info("The document has been shared successfully.");
        return documentInfo;
      }), catchError(errorRes => {
        this.townCrier.error(errorRes.error);
        return this.restErrorsHandlerService.handleRequestError(errorRes);
      }));
  }

  getSharedEmailsByDocumentInfoId(imageInfoId: string, ownerUid: string) {
    this.townCrier.info("Retrieving all shared emails for this document please wait...");
    return from(this.http.get<Array<string>>(`${environment.baseUrl}${environment.RESOURCE_GET_SHARED_EMAILS_BY_DOCUMENT_INFO_ID}/${imageInfoId}/${ownerUid}`))
      .pipe(map((emails: any) => {
        this.townCrier.info("All shared emails for this document retrieved successfully.");
        return emails;
      }), catchError(errorRes => {
        this.townCrier.error(errorRes.error);
        return this.restErrorsHandlerService.handleRequestError(errorRes);
      }));
  }

  getDocumentDataById(id: string, uid: string) {
    return from(this.http.get(`${environment.baseUrl}${environment.RESOURCE_GET_DOCUMENT_DATA_BY_ID}/${id}/${uid}`, {responseType: 'blob'}))
      .pipe(map((document: any) => {
        this.townCrier.info("The document has been loaded successfully.");
        return document;
      }), catchError(errorRes => {
        this.townCrier.error(errorRes.error);
        this.router.navigate(['/' + RouterEnum.Dashboard]);
        return this.restErrorsHandlerService.handleRequestError(errorRes);
      }));
  }

  getAllDocumentInfosByUid(uid: string) {
    return from(this.http.get<Array<DocumentInfoModel>>(`${environment.baseUrl}${environment.RESOURCE_GET_ALL_DOCUMENT_INFOS_BY_UID}/${uid}`))
      .pipe(map((documentInfoModels: Array<DocumentInfoModel>) => {
        this.townCrier.info("All public documents retrieved successfully.");
        return documentInfoModels;
      }), catchError(errorRes => {
        this.townCrier.error(errorRes.error);
        return this.restErrorsHandlerService.handleRequestError(errorRes);
      }));
  }

  getAllSharedImageInfosByUid(uid: string) {
    return from(this.http.get<DocumentInfoModel[]>(`${environment.baseUrl}${environment.RESOURCE_GET_ALL_SHARED_DOCUMENT_INFOS_BY_UID}/${uid}`))
      .pipe(map((documentInfoModels: DocumentInfoModel[]) => {
        this.townCrier.info("All shared documents retrieved successfully.");
        return documentInfoModels;
      }), catchError(errorRes => {
        this.townCrier.error(errorRes.error);
        return this.restErrorsHandlerService.handleRequestError(errorRes);
      }));
  }

  getAllPublicDocumentInfos() {
    return from(this.http.get<DocumentInfoModel[]>(`${environment.baseUrl}${environment.RESOURCE_GET_ALL_PUBLIC_DOCUMENT_INFOS}`))
      .pipe(map((documentInfoModels: DocumentInfoModel[]) => {
        this.townCrier.info("All documents retrieved successfully.");
        return documentInfoModels;
      }), catchError(errorRes => {
        this.townCrier.error(errorRes.error);
        return this.restErrorsHandlerService.handleRequestError(errorRes);
      }));
  }

  getDocumentDatasByDocumentInfoId(documentInfoId: string, uid: string) {
    return from(this.http.get<DocumentDataModel[]>(`${environment.baseUrl}${environment.RESOURCE_GET_DOCUMENT_DATAS_BY_DOCUMENT_INFO_ID}/${documentInfoId}/${uid}`))
      .pipe(map((documentDataModels: DocumentDataModel[]) => {
        return documentDataModels;
      }), catchError(errorRes => {
        this.townCrier.error(errorRes.error);
        return this.restErrorsHandlerService.handleRequestError(errorRes);
      }));
  }

  getImageInfoByTextSearch(searchTerm: string, uid: string) {
    return from(this.http.get<{ [key: string]: DocumentInfoModel[] }>(`${environment.baseUrl}${environment.RESOURCE_GET_IMAGE_INFO_BY_TEXT_SEARCH}/${searchTerm}/${uid}`))
      .pipe(map((documentMapData: { [key: string]: DocumentInfoModel[] }) => {
        const documentMap: Map<string, DocumentInfoModel[]> = new Map(Object.entries(documentMapData));
        this.townCrier.info("Search results retrieved successfully.");
        return documentMap;
      }), catchError(errorRes => {
        this.townCrier.error(errorRes.error);
        return this.restErrorsHandlerService.handleRequestError(errorRes);
      }));
  }

  deleteDocumentDataById(id: string, uid: string) {
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json');

    return from(this.http.delete(`${environment.baseUrl}${environment.RESOURCE_DELETE_DOCUMENT_DATA_BY_ID}/${id}/${uid}`, {
      headers: headers,
      responseType: "text"
    }))
      .pipe(map((res: any) => {
        this.townCrier.info(res);
        return of(true);
      }), catchError(errorRes => {
        this.townCrier.error(errorRes.error);
        this.restErrorsHandlerService.handleRequestError(errorRes);
        return of(false);
      }));
  }

  deleteDocumentInfoById(id: string, uid: string) {
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json');

    return from(this.http.delete(`${environment.baseUrl}${environment.RESOURCE_DELETE_DOCUMENT_INFO_BY_ID}/${id}/${uid}`, {
      headers: headers,
      responseType: "text"
    }))
      .pipe(map((res: string) => {
        this.townCrier.info(res);
        return of(true);
      }), catchError(errorRes => {
        this.townCrier.error(errorRes.error);
        this.restErrorsHandlerService.handleRequestError(errorRes);
        return of(false);
      }));
  }
}
