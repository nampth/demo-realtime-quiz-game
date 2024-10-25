import { Global, Inject, Module, OnApplicationBootstrap } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from './game/game.module';
import { QuestionModule } from './question/question.module';
import { Cache, CACHE_MANAGER, CacheModule, CacheStore } from '@nestjs/cache-manager';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserSeeder } from './user/seeders/user.seeder';
import { GameSeeder } from './game/seeders/game.seeder';
import { UserService } from './user/user.service';
import { User } from './user/entities/user.entity';
import { GameService } from './game/game.service';
import { Game } from './game/entities/game.entity';
import { QuestionSeeder } from './question/seeders/question.seeder';
import { Question } from './question/entities/question.entity';
import { QuestionService } from './question/question.service';
import { EventModule } from './event/event.module';
import { GAME_STATES } from './constants/states';
import { redisStore } from 'cache-manager-redis-yet';
import { RedisModule } from './redis/redis.module';
import Redis from 'ioredis';

require("dotenv").config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      // inject: [ConfigService], 
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: ["dist/**/*.entity{.ts,.js}"],
      migrations: ["dist/migrations/*{.ts,.js}"],
      synchronize: false,
      logging: false,
    }),
    AuthModule,
    GameModule,
    QuestionModule,


    UserModule,
    TypeOrmModule.forFeature([User, Game, Question]),
    EventModule,
    RedisModule
  ],
  controllers: [AppController],
  providers: [AppService, UserSeeder, UserService, GameSeeder, GameService, QuestionSeeder, QuestionService,
    //   {
    //     provide: 'REDIS_CLIENT',
    //     useFactory: () => {
    //       return new Redis({
    //         host: 'localhost',
    //         port: 6379,
    //       });
    //     },
    //   },
  ],
  // exports: ['REDIS_CLIENT'],
})

export class AppModule implements OnApplicationBootstrap {
  constructor(
    private readonly gameSeeder: GameSeeder,
    private readonly userSeeder: UserSeeder,
    private readonly questionSeeder: QuestionSeeder,
  ) { }

  async onApplicationBootstrap() {
    if (process.env.RUN_SEEDER == "1") {
      await this.userSeeder.seed();
      // await this.gameSeeder.seed();
      // await this.questionSeeder.seed();
    }
  }

}
