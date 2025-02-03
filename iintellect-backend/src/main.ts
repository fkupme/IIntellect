import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT ?? 3000;

  await app.listen(port);

  Logger.log(`Приложение запущено на: http://localhost:${port}`);
}

bootstrap().catch(error => {
  Logger.error('Не удалось запустить приложение', error);
  process.exit(1);
});