import { Controller, Get, Query } from '@nestjs/common'
import SearchServiceService from './search-service.service'
import Public from 'src/common/decorators/public.decorator'
import SearchQueryDto from './dto/search-query.dto'

@Controller('search')
export default class SearchServiceController {
  constructor(private readonly searchServiceService: SearchServiceService) {}
  @Public()
  @Get()
  search(@Query() { query }: SearchQueryDto) {
    return this.searchServiceService.search(query)
  }
}
