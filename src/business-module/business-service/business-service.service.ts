import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import PrismaService from 'src/prisma/prisma.service'
import { BussinessService as BussinesServiceModelType } from '@prisma/client'
import { deleteFileAsync } from 'src/common/helpers/file.helper'
import AccessControlService from 'src/access-control/access-control.service'
import CreateBusinessServiceDto from './dto/create-business-service.dto'
import {
  CheckBusinessAddressParams,
  CheckBusinessServiceNameParams,
  UpdateBusinessImageParams,
  VerifyBusinessServiceIdParams,
  DeleteBusinessServicesParams,
  ImageUrlParams,
  UserIdParams,
  BaseBusinessIdParams,
} from '../../common/types/params.type'
import UpdateBusinessServicesDto from './dto/update-business-services.dto'

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

  async checkBusinessAddress({
    country,
    state,
    city,
    specificLocation,
    streetAddress,
    businessId,
  }: CheckBusinessAddressParams): Promise<boolean> {
    const business = await this.prismaService.business.findFirst({
      where: {
        id: businessId,
        address: {
          some: {
            OR: [
              {
                country: { contains: country, mode: 'insensitive' },
                city: { contains: city, mode: 'insensitive' },
                state: { contains: state, mode: 'insensitive' },
                streetAddress: {
                  contains: streetAddress || '',
                  mode: 'insensitive',
                },
                specificLocation: {
                  contains: specificLocation || '',
                  mode: 'insensitive',
                },
              },
            ],
          },
        },
      },
    })
    if (business)
      throw new ConflictException('The address is already registered')
    return true
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
    imageUrl,
  }: CreateBusinessServiceDto & UserIdParams & ImageUrlParams) {
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
        image: imageUrl,
      },
    })
    return buinessService
  }

  async updateBusinessServiceImage({
    id,
    imageUrl,
    userId,
  }: UpdateBusinessImageParams) {
    const { entity: service } =
      await this.accessControlService.verifyBussinessOwnerShip({
        id,
        model: 'BUSINESS_SERVICE',
        userId,
      })

    if (imageUrl.trim() === '') throw new BadRequestException('Invalid Image')
    const updatedBusiness = await this.prismaService.bussinessService.update({
      where: { id },
      data: { image: imageUrl },
    })
    deleteFileAsync({ filePath: (service as BussinesServiceModelType).image })
    return updatedBusiness
  }

  async updateBusinessServices({
    services,
    businessId,
    userId,
  }: UpdateBusinessServicesDto & UserIdParams) {
    /* eslint-disable */
    for (const { id } of services) await this.verifyBusinessServiceId({ id })

    for (const { id, description, name, specifications } of services) {
      const { entity: service } =
        await this.accessControlService.verifyBussinessOwnerShip({
          /* eslint-disable */
          id,
          model: 'BUSINESS_SERVICE',
          userId,
        })

      await this.prismaService.bussinessService.update({
        where: { id },
        data: {
          name: name || (service as BussinesServiceModelType).description,
          description:
            description || (service as BussinesServiceModelType).description,
          specifications:
            specifications ||
            ((service as BussinesServiceModelType).specifications as any),
        },
      })
    }

    return await this.prismaService.business.findFirst({
      where: { id: businessId },
    })
  }

  async deleteBusinessServices({ id, userId }: DeleteBusinessServicesParams) {
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
    return 'Buisness services deleted successfully'
  }

  async getBusinessServices({ businessId }: BaseBusinessIdParams) {
    return await this.prismaService.bussinessService.findMany({
      where: {
        businessId,
      },
    })
  }
}
