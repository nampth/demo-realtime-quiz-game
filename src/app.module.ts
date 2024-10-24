import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from './game/game.module';
import { QuestionModule } from './question/question.module';
import { CacheModule } from '@nestjs/cache-manager';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserSeeder } from './user/seeders/user.seeder';

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
    CacheModule.register({
      isGlobal: true,
    },
    ),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, UserSeeder],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly userSeeder: UserSeeder) { }

  async onApplicationBootstrap() {
    if (process.env.RUN_SEEDER) {
      await this.userSeeder.seed();
    }
  }

}
