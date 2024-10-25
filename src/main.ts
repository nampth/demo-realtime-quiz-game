import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import * as basicAuth from "express-basic-auth";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RedisIoAdapter } from './common/adapters/redis-io.adapter';

require("dotenv").config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();

  app.useWebSocketAdapter(redisIoAdapter);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    forbidUnknownValues: false
  }));
  app.use(json({ limit: '30mb' }));
  app.use(urlencoded({ extended: true, limit: '30mb' }));


  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.use(
    "/api-desc*",
    basicAuth({
      challenge: true,
      users: {
        game: "G@m3!!",
      },
    })
  );

  const config = new DocumentBuilder()
    .setTitle('Game services')
    .setDescription('')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-desc', app, document)

  await app.listen(process.env.SERVICES_PORT);
}
bootstrap();
