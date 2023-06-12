import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {catchError, from, map, of} from "rxjs";
import {Router} from "@angular/router";
import {RestErrorsHandlerService} from "./rest-errors-handler.service";
import {TownCrierService} from "./town-crier.service";
import {environment} from "../../environments/environment";
import {RouterEnum} from "../enums/RouterEnum";
import {AlgorithmModel} from "../models/AlgorithmModel";
import {AnnotationModel} from "../models/AnnotationModel";

@Injectable({
  providedIn: 'root'
})
export class AlgorithmService {

  constructor(private http: HttpClient, private router: Router,
              private restErrorsHandlerService: RestErrorsHandlerService, private townCrier: TownCrierService) {  }

  runAlgorithm(algorithmModel: AlgorithmModel) {
    const headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    this.townCrier.info("Running algorithm, please wait while it is being initiated...");
    return from(this.http.post<AlgorithmModel>(`${environment.baseUrl}${environment.RESOURCE_RUN_ALGORITHM}`, algorithmModel, {headers: headers}))
      .pipe(map((algorithm: AlgorithmModel) => {
          this.townCrier.info("Algorithm initiated successfully.");
          return algorithm;
        }),
        catchError((errorRes: HttpErrorResponse) => {
          this.townCrier.error(errorRes.error);
          return this.restErrorsHandlerService.handleRequestError(errorRes);
        }));
  }

  addManualAnnotation(annotation: AnnotationModel) {
    return this.http.post<AnnotationModel>(`${environment.baseUrl}${environment.RESOURCE_ADD_MANUAL_ANNOTATION}`, annotation)
      .pipe(map((annotation: AnnotationModel) => {
        this.townCrier.info("Annotation added successfully.");
        return annotation;
      }), catchError(errorRes => {
        this.townCrier.error(errorRes.error);
        return this.restErrorsHandlerService.handleRequestError(errorRes);
      }));
  }

  //TODO update algorithm ID when updating annotation?
  updateAnnotation(annotation: AnnotationModel) {
    return this.http.patch<AnnotationModel>(`${environment.baseUrl}${environment.RESOURCE_UPDATE_ANNOTATION}`, annotation)
      .pipe(map((updatedAnnotation: AnnotationModel) => {
        this.townCrier.info("Annotation updated successfully.");
        return updatedAnnotation;
      }), catchError(errorRes => {
        this.townCrier.error(errorRes.error);
        return this.restErrorsHandlerService.handleRequestError(errorRes);
      }));
  }

  deleteAnnotation(annotationId: string, uid: string, documentId: string) {
    const headers: HttpHeaders = new HttpHeaders();
    headers.set('Content-Type', 'application/json');

    return from(this.http.delete(`${environment.baseUrl}${environment.RESOURCE_DELETE_ANNOTATION}/${annotationId}/${uid}/${documentId}`, {headers: headers, responseType:"text"}))
      .pipe(map((res: string) => {
        this.townCrier.info(res);
        return of(true);
      }), catchError(errorRes => {
        this.townCrier.error(errorRes.error);
        this.restErrorsHandlerService.handleRequestError(errorRes);
        return of(false);
      }));
  }

  submitAlgorithm(algorithmModel: AlgorithmModel) {
    const headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    return from(this.http.post<AlgorithmModel>(`${environment.baseUrl}${environment.RESOURCE_SUBMIT_ALGORITHM}`, algorithmModel, {headers: headers}))
      .pipe(map((algorithm: AlgorithmModel) => {
          this.townCrier.info("Algorithm submitted successfully.");
          this.router.navigate(['/' + RouterEnum.Dashboard]);
          return algorithm;
        }),
        catchError((errorRes: HttpErrorResponse) => {
          this.townCrier.error(errorRes.error);
          return this.restErrorsHandlerService.handleRequestError(errorRes);
        }));
  }

  updateAlgorithm(algorithmModel: AlgorithmModel) {
    return from(this.http.patch<AlgorithmModel>(`${environment.baseUrl}${environment.RESOURCE_UPDATE_ALGORITHM}`, algorithmModel))
      .pipe(map((algorithm: AlgorithmModel) => {
          return algorithm;
        }),
        catchError((errorRes: HttpErrorResponse) => {
          this.townCrier.error(errorRes.error);
          return this.restErrorsHandlerService.handleRequestError(errorRes);
        }));
  }

  getAlgorithmById(id: string, uid: string) {
    return from(this.http.get<AlgorithmModel>(`${environment.baseUrl}${environment.RESOURCE_GET_ALGORITHM_BY_ID}/${id}/${uid}`))
      .pipe(map((algorithm: AlgorithmModel) => {
          return algorithm;
        }),
        catchError((errorRes: HttpErrorResponse) => {
          this.townCrier.error(errorRes.error);
          return this.restErrorsHandlerService.handleRequestError(errorRes);
        }));
  }

  getAllAlgorithms(uid: string) {
    this.townCrier.info("Please wait while all algorithms are being retrieved...");
    return from(this.http.get<AlgorithmModel[]>(`${environment.baseUrl}${environment.RESOURCE_GET_ALL_ALGORITHMS}/${uid}`))
      .pipe(map((algorithms: AlgorithmModel[]) => {
          this.townCrier.info("All algorithms retrieved successfully.");
          return algorithms;
        }),
        catchError((errorRes: HttpErrorResponse) => {
          this.townCrier.error(errorRes.error);
          return this.restErrorsHandlerService.handleRequestError(errorRes);
        }));
  }

  getAllAlgorithmsByUid(uid: string) {
    this.townCrier.info("Please wait while all algorithms are being retrieved...");
    return from(this.http.get<AlgorithmModel[]>(`${environment.baseUrl}${environment.RESOURCE_GET_ALL_ALGORITHMS_BY_UID}/${uid}`))
      .pipe(map((algorithms: AlgorithmModel[]) => {
          this.townCrier.info("All algorithms retrieved successfully.");
          return algorithms;
        }),
        catchError((errorRes: HttpErrorResponse) => {
          this.townCrier.error(errorRes.error);
          return this.restErrorsHandlerService.handleRequestError(errorRes);
        }));
  }

  getAllRunnableAlgorithms(requestingUid: string) {
    this.townCrier.info("Please wait while all runnable algorithms are being retrieved...");
    return from(this.http.get<AlgorithmModel[]>(`${environment.baseUrl}${environment.RESOURCE_GET_ALL_RUNNABLE_ALGORITHMS}/${requestingUid}`))
      .pipe(map((algorithms: AlgorithmModel[]) => {
          this.townCrier.info(`All runnable algorithms retrieved successfully.`);
          return algorithms;
        }),
        catchError((errorRes: HttpErrorResponse) => {
          this.townCrier.error(errorRes.error);
          return this.restErrorsHandlerService.handleRequestError(errorRes);
        }));
  }
}
