import {Injectable} from '@angular/core';
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RestErrorsHandlerService {

  constructor() {
  }

  handleRequestError(errorRes: any): Observable<any> {
    if (errorRes.error !== undefined) {
      this.showError(errorRes.error);
    } else {
      this.showError("Something went wrong, Connection lost with the server");
    }
    return of(errorRes);
  }

  showError(errorMessage: string) {
    console.log(errorMessage)
  }
}
