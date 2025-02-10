import { Module } from '@nestjs/common'
import SearchServiceService from './search-service.service'
import SearchServiceController from './search-service.controller'

@Module({
  controllers: [SearchServiceController],
  providers: [SearchServiceService],
})
export default class SearchServiceModule {}
