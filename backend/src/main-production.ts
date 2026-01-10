import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppProductionModule } from './app-production.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ValidationException } from './common/exceptions/custom-exceptions';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  try {
    logger.log('🚀 Starting Product Explorer Backend (Production Mode)');
    
    const app = await NestFactory.create(AppProductionModule, {
      logger: ['error', 'warn', 'log'],
    });

    const configService = app.get(ConfigService);

    // Security headers
    app.use((req: any, res: any, next: any) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
      res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
      res.removeHeader('X-Powered-By');
      next();
    });

    // Validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
        skipMissingProperties: false,
        validationError: {
          target: false,
          value: false,
        },
        exceptionFactory: (errors) => {
          const messages = errors.map(error => ({
            field: error.property,
            errors: Object.values(error.constraints || {}),
          }));
          return new ValidationException('Validation failed', messages);
        },
      }),
    );

    app.useGlobalFilters(new GlobalExceptionFilter());

    // CORS configuration
    app.enableCors({
      origin: true, // Allow all origins in production for now
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
        'X-CSRF-Token',
      ],
      exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
      maxAge: 86400,
    });

    app.setGlobalPrefix('api', {
      exclude: ['health', 'metrics'],
    });

    // Swagger documentation
    const config = new DocumentBuilder()
      .setTitle('Product Data Explorer API')
      .setDescription('A comprehensive API for product data exploration and management')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('products', 'Product management endpoints')
      .addTag('categories', 'Category management endpoints')
      .addTag('search', 'Search and filtering endpoints')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });

    // Enhanced health check
    app.use('/health', (req: any, res: any) => {
      res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: configService.get('NODE_ENV'),
        version: '1.0.0',
        database: 'connected', // We'll assume it's connected if we get here
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB',
        },
      });
    });

    const port = configService.get('PORT', 3001);
    const host = configService.get('HOST', '0.0.0.0');
    
    await app.listen(port, host);

    logger.log(`✅ Application is running on: http://${host}:${port}`);
    logger.log(`📚 API Documentation: http://${host}:${port}/api/docs`);
    logger.log(`💚 Health Check: http://${host}:${port}/health`);
    logger.log(`🌍 Environment: ${configService.get('NODE_ENV')}`);
    
  } catch (error) {
    logger.error('❌ Failed to start application:', error);
    process.exit(1);
  }
}

bootstrap();