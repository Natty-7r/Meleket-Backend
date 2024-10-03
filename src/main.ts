import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
import AppModule from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
  const config = new DocumentBuilder()
    .setTitle('Meleket Backend')
    .setDescription('API Docs for Meleket web application')
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)
  const port = process.env.PORT || 3000

  app.enableCors()
  await app.listen(port, () => {
    console.log(`Meleket Backend is Running at port  ${port}`)
  })
}
bootstrap()
