import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import AppModule from './app.module'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
  const config = new DocumentBuilder()
    .setTitle('BM API GATEWAY')
    .setDescription('API GATEWAY API Docs')
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)
  const port = process.env.PORT || 3000
  await app.listen(port, () => {
    console.log(`MB API GATEWAY  is Running on port ${port}`)
  })
}
bootstrap()
