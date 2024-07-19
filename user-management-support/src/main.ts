import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import AppModule from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder()
    .setTitle('API GATEWAY')
    .setDescription('API GATEWAY API Docs')
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)

  await app.listen(process.env.PORT || 8080, () => {
    console.log(`API GATEWAY  is Running on port ${process.env.PORT || 8080}`)
  })
}
bootstrap()
