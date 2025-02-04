import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 5000;
  app.use(ValidationPipe)
  await app.listen(port);

  Logger.log(`Приложение запущено на: http://localhost:${port}`);
}

bootstrap().catch(error => {
  Logger.error('Не удалось запустить приложение', error);
  process.exit(1);
});