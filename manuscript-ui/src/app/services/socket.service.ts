import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {RouterEnum} from "../enums/RouterEnum";
import {Router} from "@angular/router";
import * as SockJS from "sockjs-client";
import * as Stomp from "@stomp/stompjs"
import {Client} from "stompjs";
import {TownCrierService} from "./town-crier.service";


@Injectable({
  providedIn: 'root'
})
export class SocketService {


  constructor(public router: Router,
              private townCrier: TownCrierService) {
  }

  initSocket() {
    const socket = new SockJS(`${environment.baseUrl}${environment.SOCKET}`);
    return Stomp.over(socket);
  }

  subscription(stompClient: Client, destination: string, onNotify: (msg: any) => void) {
    if(stompClient != null){
      stompClient.connect({}, frame => {
        stompClient.subscribe(destination, onNotify)
      }, (frames) => {
        this.townCrier.error();
      })

    }


  }

}
