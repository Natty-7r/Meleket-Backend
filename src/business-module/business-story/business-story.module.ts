import { Module } from '@nestjs/common'
import BusinessStoryService from './business-story.service'
import BusinessStoryController from './business-story.controller'

@Module({
  providers: [BusinessStoryService],
  exports: [BusinessStoryService],
  controllers: [BusinessStoryController],
})
export default class BusinessStoryModule {}
