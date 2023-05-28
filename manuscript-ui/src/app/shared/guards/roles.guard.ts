import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from "../../services/auth/auth.service";
import {CryptoService} from "../../services/crypto.service";

@Injectable({
  providedIn: 'root'
})
export class RolesGuard implements CanActivate {

  constructor(public authService: AuthService, public router: Router,

  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(!this.authService.isAdmin){
      return this.router.createUrlTree(['Dashboard'])
    }
    return false;
  }

}
