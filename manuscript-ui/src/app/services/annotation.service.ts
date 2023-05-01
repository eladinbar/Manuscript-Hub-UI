import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {catchError, from, map, Observable} from 'rxjs';
import {Router} from "@angular/router";
import {RestErrorsHandlerService} from "./rest-errors-handler.service";
import {TownCrierService} from "./town-crier.service";
import {environment} from "../../environments/environment";
import {AnnotationModel} from "../models/AnnotationModel";

@Injectable({
  providedIn: 'root'
})

export class AnnotationService {
  apiUrl: string = `${environment.baseUrl}/api/annotation`;

  constructor(private http: HttpClient,
              private router: Router,
              private restErrorsHandlerService: RestErrorsHandlerService,
              private townCrier: TownCrierService) {
  }

  addAnnotation(annotation: AnnotationModel) {
    return this.http.post<AnnotationModel>(`${this.apiUrl}/addAnnotation`, annotation);
  }

  //TODO update algorithm ID when updating annotation?
  updateAnnotation(annotation: AnnotationModel) {
    return this.http.patch<AnnotationModel>(`${this.apiUrl}/updateAnnotation`, annotation).subscribe({
      next: (annotationModel: AnnotationModel) => {
        console.log('HTTP PATCH request successful: ', annotationModel);
      },
      error: (err: any) => {
        console.error('HTTP PATCH request error: ', err);
      },
    });
  }

  getAnnotationsByDocumentId(documentId: string, uid: string): Observable<AnnotationModel[]> {
    return this.http.get<AnnotationModel[]>(`${this.apiUrl}/getAnnotationsByDocumentId/${documentId}/${uid}`);
  }

  deleteAnnotation(annotationId: string, documentId: string, uid: string): Observable<AnnotationModel> {
    return this.http.delete<AnnotationModel>(`${this.apiUrl}/deleteAnnotation/${annotationId}/${documentId}/${uid}`);
  }

  deleteAllAnnotationsByDocumentId() {

  }
}
