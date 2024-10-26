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
import { AnswerType } from 'src/common/types/answer';
import * as moment from 'moment';

@WebSocketGateway({
  port: process.env.SERVICES_PORT,
  cors: true
},
) // Enable CORS if needed
export class EventsGateway {

  @WebSocketServer()
  server: Server;

  private clients = new Map<string, Socket>();

  disconnectAllClients() {
    this.clients.forEach((client, clientId) => {
      client.disconnect();
      console.log(`Client ${clientId} disconnected programmatically`);
    });
    this.clients.clear(); // Clear the map after disconnecting all clients
  }

  constructor(
    private readonly redisService: RedisService
  ) { }


  @SubscribeMessage(SOCKET_EVENTS.JOIN_GAME)
  async handleJoinGame(@MessageBody() data: JoinGame, @ConnectedSocket() client: Socket) {
    let game = await this.redisService.getData(GAME_STATES.GAME);

    if (game) {
      let isExisted = false;
      game.players.forEach((player) => {
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
        game.players.push(newPlayer);
      }
      this.server.emit(SOCKET_EVENTS.JOIN_GAME, {
        players: game.players,
        current_index: game.current_index,
      })
      await this.redisService.saveData(GAME_STATES.GAME, game);
    }

    return data;
  }

  @SubscribeMessage(SOCKET_EVENTS.NEXT_QUESTION)
  async handleNextQuestion(@MessageBody() room_id: number, @ConnectedSocket() client: Socket) {
    let game = await this.redisService.getData(GAME_STATES.GAME);
    if (game) {
      if (game.current_index > 0) {
        await this.updateLeaderBoard(game);
      }
      game.current_index++;
      game.answers = [];
      if (game.current_index < game.questions.length) {
        this.server.emit(SOCKET_EVENTS.NEXT_QUESTION, {
          question: game.questions[game.current_index].question,
          options: JSON.parse(game.questions[game.current_index].options),
          index: game.current_index,
          duration: game.questions[game.current_index].duration
        })

        game.question_start_time = moment()
        game.question_end_time = moment().add(game.questions[game.current_index].duration, 'second')
      } else {
        this.server.emit(SOCKET_EVENTS.END_GAME, game.players)
      }

      await this.redisService.saveData(GAME_STATES.GAME, game);
    }
    return room_id;
  }

  @SubscribeMessage(SOCKET_EVENTS.ANSWER_QUESTION)
  async handleAnswerQuestion(@MessageBody() answer: any, @ConnectedSocket() client: Socket) {
    let game = await this.redisService.getData(GAME_STATES.GAME);
    console.log(`Client answer: ${client.id}`);

    if (game) {
      let existedAnswer = null;
      // check valid time
      if (moment().isBefore(game.question_end_time, 'second')) {
        // add answer to list
        game.answers.forEach((answer: AnswerType) => {
          if (answer.id == client.id) {
            existedAnswer = answer;
          }
        })
        if (!existedAnswer) {
          game.answers.push({
            id: client.id,
            email: answer.email,
            answer: answer.selected_option
          })
        }

        // update score if number of answers equal to number of players
        console.log('number of answers:', game.answers, game.players.length)
        if (game.answers.length == game.players.length) {
          await this.updateLeaderBoard(game);
        } else {
          await this.redisService.saveData(GAME_STATES.GAME, game);
        }


      }
    }
  }

  async updateLeaderBoard(game: GameType) {
    console.log('update game leader board');
    if (game.answers.length > 0) {
      let question = game.questions[game.current_index];
      for (let i = 0; i < game.players.length; i++) {
        game.answers.forEach((answer: AnswerType) => {
          if (game.players[i].id == answer.id) {
            if (answer.answer == question.answer) {
              game.players[i].score += question.score;
            }
          }
        })
      }
      console.log('before update leaderboard: ', question.answer, game.players);
      game.players = game.players.sort((a, b) => b.score - a.score);
      game.answers = [];
      console.log('update leaderboard: ', question.answer, game.players);
      this.server.emit(SOCKET_EVENTS.UPDATE_SCORE, game.players)
      await this.redisService.saveData(GAME_STATES.GAME, game);
    }
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    this.clients.set(client.id, client);
  }

  async handleDisconnect(client: Socket) {
    let game = await this.redisService.getData(GAME_STATES.GAME);
    if (game) {
      const updatedPlayers = game.players.filter(player => player.id !== client.id);
      game.players = updatedPlayers;

      this.server.emit(SOCKET_EVENTS.UPDATE_SCORE, updatedPlayers)

      await this.redisService.saveData(GAME_STATES.GAME, game);
    }
    return;
  }
}
