import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, from, map, Observable, of} from 'rxjs';
import {Router} from "@angular/router";
import {RestErrorsHandlerService} from "./rest-errors-handler.service";
import {TownCrierService} from "./town-crier.service";
import {environment} from "../../environments/environment";
import {AnnotationModel} from "../models/AnnotationModel";

@Injectable({
  providedIn: 'root'
})

export class AnnotationService {
  constructor(private http: HttpClient, private router: Router,
              private restErrorsHandlerService: RestErrorsHandlerService, private townCrier: TownCrierService) {
  }

  // addAnnotation(annotation: AnnotationModel) {
  //   return this.http.post<AnnotationModel>(`${environment.baseUrl}${environment.RESOURCE_ADD_ANNOTATION}`, annotation)
  //     .pipe(map((res: any) => {
  //         this.townCrier.info("Annotation added successfully.");
  //         return res;
  //       }), catchError(errorRes => {
  //         this.townCrier.error(errorRes.error);
  //         return this.restErrorsHandlerService.handleRequestError(errorRes);
  //       }));
  // }
  //
  // //TODO update algorithm ID when updating annotation?
  // updateAnnotation(annotation: AnnotationModel) {
  //   return this.http.patch<AnnotationModel>(`${environment.baseUrl}${environment.RESOURCE_UPDATE_ANNOTATION}`, annotation)
  //     .pipe(map((updatedAnnotation: AnnotationModel) => {
  //         this.townCrier.info("Annotation updated successfully.");
  //         return updatedAnnotation;
  //       }), catchError(errorRes => {
  //         this.townCrier.error(errorRes.error);
  //         return this.restErrorsHandlerService.handleRequestError(errorRes);
  //       }));
  // }

  getAllAnnotationsByDocumentDataId(documentId: string, uid: string): Observable<AnnotationModel[]> {
    return this.http.get<AnnotationModel[]>(`${environment.baseUrl}${environment.RESOURCE_GET_ALL_ANNOTATIONS_BY_DOCUMENT_DATA_ID}/${documentId}/${uid}`)
      .pipe(map((annotations: AnnotationModel[]) => {
          return annotations;
        }), catchError(errorRes => {
          this.townCrier.error(errorRes.error);
          return this.restErrorsHandlerService.handleRequestError(errorRes);
        }));
  }

  // deleteAnnotation(annotationId: string) {
  //   const headers = new HttpHeaders();
  //   headers.set('Content-Type', 'application/json');
  //
  //   return from(this.http.delete(`${environment.baseUrl}${environment.RESOURCE_DELETE_ANNOTATION}/${annotationId}`, {headers: headers, responseType:"text"}))
  //     .pipe(map((res: string) => {
  //         this.townCrier.info(res);
  //         return of(true);
  //       }), catchError(errorRes => {
  //         this.townCrier.error(errorRes.error);
  //         this.restErrorsHandlerService.handleRequestError(errorRes);
  //         return of(false);
  //       }));
  // }
}
