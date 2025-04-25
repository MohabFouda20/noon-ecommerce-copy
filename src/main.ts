import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookiePaser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // swagger configration 
  const config = new DocumentBuilder().setTitle('store training').setDescription('online store api').setVersion('1.0').build()
  const documentFactory = ()=>SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, documentFactory)

  await app.listen(process.env.PORT ?? 3000);
  app.use(cookiePaser());
  app.enableCors({Credential:true , origin: 'http://localhost:3000'});
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log('Cloud name is:', process.env.CLOUDINARY_NAME);
}
bootstrap();
