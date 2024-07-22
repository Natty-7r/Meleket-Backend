import { NestFactory } from '@nestjs/core'
import AppModule from './app.module'
import WinstonLoggerService from './logger/winston-logger/winston-logger.service'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'user-management',
          brokers: ['127.0.0.1:9092'],
        },
        consumer: {
          groupId: 'user-management-consumer',
        },
      },
    },
  )

  console.log(`Users Microservice is Running `)
  await app.listen()
}

bootstrap()
