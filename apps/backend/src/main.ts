import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // Sau này app ổn định thì thay dấu * bằng URL Cloudflare Pages của bạn
    credentials: true,
  });

  // Configure Swagger Document
  const config = new DocumentBuilder()
    .setTitle('CineSpecs API')
    .setDescription('The CineSpecs Cinema Screen & Seat Wiki API documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port, '0.0.0.0');
  console.log(`Backend is running on http://localhost:${port}`);
  console.log(`Swagger UI is available on http://localhost:${port}/api`);
}
bootstrap();
