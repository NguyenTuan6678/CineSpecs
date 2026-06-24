"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: '*',
        credentials: true,
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('CineSpecs API')
        .setDescription('The CineSpecs Cinema Screen & Seat Wiki API documentation')
        .setVersion('1.0')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    const port = process.env.PORT || 4000;
    await app.listen(port, '0.0.0.0');
    console.log(`Backend is running on http://localhost:${port}`);
    console.log(`Swagger UI is available on http://localhost:${port}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map