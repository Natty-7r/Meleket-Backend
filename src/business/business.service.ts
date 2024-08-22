import { ConflictException, Injectable } from '@nestjs/common'
import PrismaService from 'src/prisma/prisma.service'
import CreateBusinessDto from './dto/create-business.dto'

@Injectable()
export default class BusinessService {
  constructor(private readonly prismaService: PrismaService) {}

  async checkBusinessName(name: string) {
    const business = await this.prismaService.business.findFirst({
      where: { name },
    })
    if (business) throw new ConflictException('Business is taken')
  }
  async createBusiness(createBusinessDto: CreateBusinessDto) {
    await this.checkBusinessName(createBusinessDto.name)

    const business = await this.prismaService.business.create({
      data: {
        ...createBusinessDto,
      },
    })

    return {
      status: 'success',
      message: 'Account created successfully',
      data: {
        ...business,
      },
    }
  }
}
