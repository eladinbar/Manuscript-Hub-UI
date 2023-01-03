import {Injectable} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class TownCrierService {

  private static DEFAULT_DURATION = 5000;
  private static DEFAULT_ERROR_MSG = 'System Error - Please contact the support team';
  private static NOT_FOUND_MSG = 'Requested Entity Not Found';
  private static ACCESS_DENIED_MSG = 'Access Denied';
  private static UNAUTHORIZED_ACCESS_MSG = 'Unauthorized access';
  private static USER_DISABLED_MSG = 'Disabled user - please contact support';
  private static ACTION_TEXT = 'Close';
  private static OFFLINE_MSG = 'No internet connection..!!';
  private readonly TYPE_ERROR = 'error';
  private readonly TYPE_INFO = 'info';
  private readonly STATUS_SUBMITTED = 'submitted';
  private readonly STATUS_COMPLETED = 'completed';
  private readonly ALERT_RECIVED = 'Undo';


  constructor(private snackBar: MatSnackBar) {
  }

  public error(message?: string): void {
    message = message ? message : TownCrierService.DEFAULT_ERROR_MSG;
    this.show(message, this.TYPE_ERROR);
  }

  public info(message: string): void {
    this.show(message, this.TYPE_INFO);
  }

  public accessDenied(): void {
    this.error(TownCrierService.ACCESS_DENIED_MSG);
  }

  public unAuthorizedAccess(): void {
    this.error(TownCrierService.UNAUTHORIZED_ACCESS_MSG);
  }

  public userDisabledAccess(): void {
    this.error(TownCrierService.USER_DISABLED_MSG);
  }

  public notFound(): void {
    this.info(TownCrierService.NOT_FOUND_MSG);
  }

  public offline(): void {
    this.error(TownCrierService.OFFLINE_MSG);
  }

  public submitted(): void {
    this.track(this.STATUS_SUBMITTED);
  }

  public completed(): void {
    this.track(this.STATUS_COMPLETED);
  }

  public alertRecived(message :string):void{
    this.show(message,this.ALERT_RECIVED)
  }

  private track(status: string): void {
    // Todo: need implement status here.
  }

  private show(message: string, type: string, duration?: number): void {
    this.snackBar.open(message, TownCrierService.ACTION_TEXT,
      {
        duration: duration ? duration : TownCrierService.DEFAULT_DURATION, verticalPosition: 'bottom',
        horizontalPosition: 'end', panelClass: [type]
      });
  }
}
