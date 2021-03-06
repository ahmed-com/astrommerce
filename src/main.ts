import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomLogger } from './Logger/CustomLogger';
import { TransformInterceptor } from './transform.interceptor';

async function bootstrap() {
  const logger = new CustomLogger('Nest', { stage: process.env.STAGE });
  const app = await NestFactory.create(AppModule, {
    logger,
  });
  // app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  const port = 3000 || process.env.PORT;
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
