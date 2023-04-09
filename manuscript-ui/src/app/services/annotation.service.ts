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
    console.log("Pushing data to list: " + annotation.value);
    return this.http.post(`${this.apiUrl}/addAnnotation`, annotation).subscribe({
      next: (res: any) => {
        console.log('HTTP POST request successful:', res);
      },
      error: (err: any) => {
        console.error('HTTP POST request error:', err);
      },
    });
  //     .pipe(
  //       map((res: any) => {
  //         this.townCrier.info("Wait until annotation is processed...");
  //         return res;
  //       }),
  //       catchError(errorRes => {
  //         this.townCrier.error(errorRes.error)
  //         return this.restErrorsHandlerService.handleRequestError(errorRes);
  //       })));
  }

  updateAnnotation() {

  }

  getAllAnnotationByDocumentId() {

  }

  deleteAnnotation() {

  }

  deleteAllAnnotationsByDocumentId() {

  }
}
