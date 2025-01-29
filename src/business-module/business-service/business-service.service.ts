import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { BussinessService as BussinesServiceModelType } from '@prisma/client'
import AccessControlService from 'src/access-control/access-control.service'
import { deleteFileAsync } from 'src/common/helpers/file.helper'
import PrismaService from 'src/prisma/prisma.service'
import {
  BaseBusinessIdParams,
  BaseIdParams,
  BaseUserIdParams,
  BusinessIdParams,
  CheckBusinessServiceNameParams,
  DeleteBusinessServicesParams,
  UserIdParams,
  VerifyBusinessServiceIdParams,
} from '../../common/types/params.type'
import CreateBusinessServiceDto from './dto/create-business-service.dto'
import UpdateBusinessServiceDto from './dto/update-business-service.dto'

@Injectable()
export default class BusinessServiceService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly accessControlService: AccessControlService,
  ) {}

  async verifyBusinessServiceId({
    id,
  }: VerifyBusinessServiceIdParams): Promise<BussinesServiceModelType> {
    const service = await this.prismaService.bussinessService.findFirst({
      where: { id },
    })
    if (!service) throw new NotFoundException('Invalid business Service ID')
    return service
  }

  async checkBusinessServiceName({
    businessId,
    name,
  }: CheckBusinessServiceNameParams): Promise<BussinesServiceModelType> {
    const service = await this.prismaService.bussinessService.findFirst({
      where: {
        AND: [
          {
            businessId,
          },
          {
            name: {
              equals: name,
              mode: 'insensitive',
            },
          },
        ],
      },
    })
    if (service)
      throw new ConflictException('Service name exists in the business')
    return service
  }

  async addBussinessService({
    name,
    description,
    businessId,
    specifications,
    userId,
    image,
  }: CreateBusinessServiceDto &
    UserIdParams &
    BusinessIdParams): Promise<BussinesServiceModelType> {
    await this.accessControlService.verifyBussinessOwnerShip({
      id: businessId,
      model: 'BUSINESS',
      userId,
    })

    await this.checkBusinessServiceName({
      businessId,
      name,
    })

    const buinessService = await this.prismaService.bussinessService.create({
      data: {
        name,
        businessId,
        description,
        specifications: specifications as any,
        image: image?.path,
      },
    })

    return buinessService
  }

  async updateBusinessService({
    id,
    userId,
    image,
    ...updateBusinessServiceDto
  }: UpdateBusinessServiceDto &
    BaseIdParams &
    BaseUserIdParams): Promise<BussinesServiceModelType> {
    const { entity: service } =
      await this.accessControlService.verifyBussinessOwnerShip({
        id,
        model: 'BUSINESS_SERVICE',
        userId,
      })
    if (image && (service as BussinesServiceModelType).image)
      deleteFileAsync({ filePath: (service as BussinesServiceModelType).image })

    return await this.prismaService.bussinessService.update({
      where: { id },
      data: {
        ...updateBusinessServiceDto,
        image: image?.path || (service as BussinesServiceModelType).image,
        specifications: updateBusinessServiceDto.specifications as any,
      },
    })
  }

  async deleteBusinessServices({
    id,
    userId,
  }: DeleteBusinessServicesParams): Promise<string> {
    const { businessId } =
      await this.accessControlService.verifyBussinessOwnerShip({
        id,
        model: 'BUSINESS_SERVICE',
        userId,
      })

    await this.prismaService.bussinessService.delete({
      where: {
        businessId,
        id,
      },
    })

    return id
  }

  async getBusinessServices({
    businessId,
  }: BaseBusinessIdParams): Promise<BussinesServiceModelType[]> {
    return await this.prismaService.bussinessService.findMany({
      where: {
        businessId,
      },
    })
  }
}
