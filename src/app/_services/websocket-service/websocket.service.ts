import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
    constructor(private socket: Socket) {}

    /**
     * Method used to connect only specific user to the websocket. This is important
     * because we don't want to subscribe to all sockets, just to those who are
     * related to currently logged user.
     * @param room This will be user id for example
     */
    joinRoom(room: string): void {
        // console.log('Joined to room', room);
      this.socket.emit('joinRoom', room);
    }

    /**
     * Method used to unsubscribe the user from a specific room
     * @param room This will be user id for example
     */
    leaveRoom(room: string): void {
        // console.log('Leave room', room);
      this.socket.emit('leaveRoom', room);
    }

    /**
     * It will listen for all messages arrived from the websocket
     * @param wsEventId Websocket event id that the user subscribes to
     * @returns Observable<unknown>
     */
    listenForMessages(wsEventId: string): any{
      return this.socket.fromEvent(wsEventId);
    }
}
