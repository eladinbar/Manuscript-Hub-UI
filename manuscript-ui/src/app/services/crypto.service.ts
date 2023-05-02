import {Injectable} from '@angular/core';
import *  as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  key = "sHdssJKj1565";


  public encrypt(txt: string): string | undefined {
    if (txt)
      return CryptoJS.AES.encrypt(txt, this.key).toString();
    return undefined

  }

  public decrypt(txtToDecrypt: string): string | undefined {
    if (txtToDecrypt)
      return CryptoJS.AES.decrypt(txtToDecrypt, this.key).toString(CryptoJS.enc.Utf8);
    return undefined;

  }
}
