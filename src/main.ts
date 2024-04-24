import { NestFactory } from '@nestjs/core';
import { AppModule } from './module';
import { CustomExceptionsFilter } from './exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new CustomExceptionsFilter());

  await app.listen(process.env.PORT);
}

bootstrap();
