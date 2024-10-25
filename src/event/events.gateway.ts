import { Inject } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Cache, CACHE_MANAGER, CacheModule, CacheStore } from '@nestjs/cache-manager';
import { Server, Socket } from 'socket.io';
import { GameType } from 'src/common/types/game';
import { JoinGame } from 'src/common/types/join-game';
import { PlayerType } from 'src/common/types/player';
import { SOCKET_EVENTS } from 'src/constants/events';
import { GAME_STATES } from 'src/constants/states';
import { RedisService } from 'src/redis/redis.service';

@WebSocketGateway({
  port: process.env.SERVICES_PORT,
  cors: true
},
) // Enable CORS if needed
export class EventsGateway {

  @WebSocketServer()
  server: Server;
  constructor(
    private readonly redisService: RedisService
  ) { }

  async findRoomByID(room_id: number) {
    let rooms = await this.redisService.getData(GAME_STATES.ROOMS);
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].room_id == room_id) {
        return {
          room: rooms[i],
          ind: i
        };

      }
      return null;
    }
  }

  async updateRooms(ind: number, room: GameType) {
    let rooms = await this.redisService.getData(GAME_STATES.ROOMS);
    console.log(ind, room);
    if (ind) {
      rooms[ind] = room;
      console.log('after update', rooms);
      await this.redisService.saveData(GAME_STATES.ROOMS, rooms);
    }
  }


  @SubscribeMessage(SOCKET_EVENTS.JOIN_GAME)
  async handleJoinGame(@MessageBody() data: JoinGame, @ConnectedSocket() client: Socket) {
    let res = await this.findRoomByID(data.room_id);
    console.log('user join game:', res);
    let room = res?.room;
    if (room) {
      if (!room.players) {
        room.players = [];
      }
      let isExisted = false;
      room.players.forEach((player) => {
        if (player.email == data.email) {
          isExisted = true;
        }
      })
      if (!isExisted) {
        let newPlayer = <PlayerType>{
          email: data.email,
          score: 0,
          id: client.id
        }
        room.players.push(newPlayer);
      }

      this.server.emit(SOCKET_EVENTS.JOIN_GAME, room.players)
    }
    await this.updateRooms(res?.ind, room);

    return data;
  }



  @SubscribeMessage(SOCKET_EVENTS.NEXT_QUESTION)
  async handleNextQuestion(@MessageBody() room_id: number, @ConnectedSocket() client: Socket) {
    let res = await this.findRoomByID(room_id);
    let room = res?.room;
    room.current_index++;
    if (room.current_index < room.questions.length) {
      this.server.emit(SOCKET_EVENTS.NEXT_QUESTION, {
        question: room.questions[room.current_index].question,
        options: JSON.parse(room.questions[room.current_index].options),
        index: room.current_index
      })
    } else {
      this.server.emit(SOCKET_EVENTS.SHOW_RESULT, room.players)
    }
    return room_id;
  }

  @SubscribeMessage(SOCKET_EVENTS.ANSWER_QUESTION)
  async handleAnswerQuestion(@MessageBody() selected_option: number, @ConnectedSocket() client: Socket) {
    let rooms = await this.redisService.getData(GAME_STATES.ROOMS);
    console.log(`Client answer: ${client.id}`);
    console.log(rooms);
    rooms.forEach((room) => {
      console.log('players', room.players);
      if (room.players) {
        const updatedPlayers = room.players.filter(item => item.id !== client.id);
        room.players = updatedPlayers;
      }
    })
    await this.redisService.saveData(GAME_STATES.ROOMS, rooms);
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    let rooms = await this.redisService.getData(GAME_STATES.ROOMS);
    console.log(`Client disconnected: ${client.id}`);
    console.log(rooms);
    rooms.forEach((room) => {
      console.log('players', room.players);
      if (room.players) {
        const updatedPlayers = room.players.filter(item => item.id !== client.id);
        room.players = updatedPlayers;
      }
    })
    await this.redisService.saveData(GAME_STATES.ROOMS, rooms);
    return;
  }
}
