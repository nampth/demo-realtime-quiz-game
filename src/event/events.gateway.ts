import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameType } from 'src/common/types/game';
import { JoinGame } from 'src/common/types/join-game';
import { PlayerType } from 'src/common/types/player';
import { SOCKET_EVENTS } from 'src/constants/events';
import { GAME_STATES } from 'src/constants/states';

@WebSocketGateway({
  port: 3033,
  cors: true
},
) // Enable CORS if needed
export class EventsGateway {

  @WebSocketServer()
  server: Server;
  constructor(

    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }


  @SubscribeMessage(SOCKET_EVENTS.JOIN_GAME)
  async handleJoinGame(@MessageBody() data: JoinGame, @ConnectedSocket() client: Socket) {
    console.log('user join game:', data);
    let rooms = await this.cacheManager.get<GameType[]>(GAME_STATES.ROOMS);;
    console.log(rooms);
    rooms.forEach((room: GameType) => {
      if (room.room_id == data.room_id) {
        let player = <PlayerType>{
          email: data.email,
          score: 0
        }
        room.players.push(player);
        this.server.emit(SOCKET_EVENTS.JOIN_GAME, room.players)
        console.log(room.players);
      }
    })
    await this.cacheManager.set(GAME_STATES.ROOMS, rooms)
    return data;
  }

  @SubscribeMessage(SOCKET_EVENTS.NEXT_QUESTION)
  handleNextQuestion(@MessageBody() data: string, @ConnectedSocket() client: Socket): string {
    console.log('user join game:', data);
    return data;
  }

  @SubscribeMessage(SOCKET_EVENTS.ANSWER_QUESTION)
  handleAnswerQuestion(@MessageBody() data: string, @ConnectedSocket() client: Socket): string {
    console.log('user join game:', data);
    return data;
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
}
