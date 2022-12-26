import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TextService {

  toTitleCase(str: string) {
    if (str == null) return "";
    return str.replace(
      /\w\S*/g,
      function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }

  /**
   * replaces %s in the str with the passed arguments
   * @param str string that contines %s's in order to be replaced
   * @param args the size of the arguments must be the same as %s entries in the passed string
   * example: stringInject("example run %s ,%s","test1","test2") will return => "example run test1 ,test2"
   */
  stringInject(str:string,...args:string[]) {
    let i = 0;
    return str.replace(/%s/g, () => args[i++]);
  }
}
