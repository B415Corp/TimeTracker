import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as process from 'node:process';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { Logger, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new (await import('@nestjs/common')).ValidationPipe({ transform: true })
  );
  const logger = new Logger('Bootstrap');
  logger.log('Application is starting...');

  const configService = app.get(ConfigService);
  logger.log('ConfigService loaded');

  // Добавляем задержку для обеспечения полной загрузки конфигурации
  await new Promise((resolve) => setTimeout(resolve, 100));

  logger.log(`NODE_ENV from process.env: ${process.env.NODE_ENV}`);
  logger.log(`NODE_ENV from ConfigService: ${configService.get('NODE_ENV')}`);

  console.log('process.env.NODE_ENV', process.env.NODE_ENV, process.env);

  const environment =
    process.env.NODE_ENV || configService.get('NODE_ENV') || 'development';
  logger.log(`Final environment: ${environment}`);

  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  // Отдача статики фронтенда
  app.use(
    express.static(join(__dirname, '..', 'public'), {
      maxAge: '1y',
      setHeaders: (res, path) => {
        if (express.static.mime.lookup(path) === 'text/html') {
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        }
      },
    })
  );
  app.use((req, res, next) => {
    if (
      req.method === 'GET' &&
      !req.path.startsWith('/api') &&
      !req.path.startsWith('/v') &&
      !req.path.includes('.') &&
      !req.path.startsWith('/socket.io') && // Если используете socket.io
      req.accepts('html')
    ) {
      res.sendFile(join(__dirname, '..', 'public', 'index.html'));
    } else {
      next();
    }
  });

  // Включаем версионирование API через URI
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.enableCors({
    origin: '*',
  });

  logger.log(`Environment Info: ${process.env.NODE_ENV}`);

  const config = new DocumentBuilder()
    .setTitle(`API: "${process.env.NODE_ENV}" environment`)
    .setDescription(
      `API description (Environment Info: ${process.env.NODE_ENV})`
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      filter: true,
      tryItOutEnabled: true,
      tagsSorter: 'alpha',
      operationsSorter: (a, b) => {
        const methodsOrder = [
          'get',
          'post',
          'put',
          'delete',
          'patch',
          'options',
          'head',
        ];
        let result =
          methodsOrder.indexOf(a.get('method')) -
          methodsOrder.indexOf(b.get('method'));

        if (result === 0) {
          result = a.get('path').localeCompare(b.get('path'));
        }

        return result;
      },
    },
  });

  const port = process.env.PORT || 3000;
  const host = process.env.HOST || 'localhost';

  // Добавление маршрута для возврата JSON схемы
  app.use('/api-json', (req, res) => {
    res.json(document);
  });

  await app.listen(port, host);

  logger.log(`Server is running on http://${host}:${port}`);
  logger.log(`Environment: ${environment.toUpperCase()}`);
}

bootstrap();
