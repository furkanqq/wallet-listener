import { NestFactory } from '@nestjs/core';
import { AppModule } from './module';
import { CustomExceptionsFilter } from './exception';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new CustomExceptionsFilter());

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT);
}

bootstrap();
