import { NestFactory } from '@nestjs/core';
import 'reflect-metadata';
import { AppModule } from './app.module';
import { TrpcExceptionFilter } from './trpc/trpc.exception-handler';
import { TrpcRouter } from './trpc/trpc.router';

async function bootstrap() {
  // Initialize Nest app
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Enable TRPC support
  const trpc = app.get(TrpcRouter);
  app.useGlobalFilters(new TrpcExceptionFilter());
  trpc.applyMiddleware(app);

  const port = process.env.API_PORT || process.env.PORT || 3000;
  // Start server
  await app.listen(port);

  const env = process.env.NODE_ENV || 'development';
  if (env === 'development') {
    console.log(`apps/server dev: server started: http://localhost:${port}`);
  } else {
    console.log(`server started: ${await app.getUrl()} (Env PORT is ${port})`);
  }
}
bootstrap();
