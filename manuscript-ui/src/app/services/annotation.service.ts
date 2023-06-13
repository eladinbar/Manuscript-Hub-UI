import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, map, Observable} from 'rxjs';
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

  getAllAnnotationsByDocumentDataId(documentId: string, uid: string): Observable<AnnotationModel[]> {
    return this.http.get<AnnotationModel[]>(`${environment.baseUrl}${environment.RESOURCE_GET_ALL_ANNOTATIONS_BY_DOCUMENT_DATA_ID}/${documentId}/${uid}`)
      .pipe(map((annotations: AnnotationModel[]) => {
          return annotations;
        }), catchError(errorRes => {
          this.townCrier.error(errorRes.error);
          return this.restErrorsHandlerService.handleRequestError(errorRes);
        }));
  }
}
