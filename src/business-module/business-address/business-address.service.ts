import { ConflictException, Injectable } from '@nestjs/common'
import PrismaService from 'src/prisma/prisma.service'

import AccessControlService from 'src/access-control/access-control.service'

import CreateBusinessAddressDto from './dto/create-business-address.dto'
import UpdateBusinessAddressDto from './dto/update-business-address.dto'
import {
  CheckBusinessAddressParams,
  DeleteBusinessAddressParams,
  UserIdParams,
  BaseBusinessIdParams,
} from '../../common/types/params.type'

@Injectable()
export default class BusinessAddressService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly accessControlService: AccessControlService,
  ) {}

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

  async createBusinessAddress({
    businessId,
    country,
    city,
    state,
    specificLocation,
    streetAddress,
    userId,
  }: CreateBusinessAddressDto & UserIdParams) {
    await this.accessControlService.verifyBussinessOwnerShip({
      id: businessId,
      model: 'BUSINESS',
      userId,
    })
    await this.checkBusinessAddress({
      country,
      city,
      state,
      specificLocation,
      streetAddress,
      businessId,
    })

    return this.prismaService.businessAddress.create({
      data: {
        businessId,
        country,
        state,
        city,
        streetAddress: streetAddress || undefined,
        specificLocation: specificLocation || undefined,
      },
    })
  }

  async updateBusinessAddress({
    addressId,
    city,
    country,
    state,
    specificLocation,
    streetAddress,
    userId,
  }: UpdateBusinessAddressDto & UserIdParams) {
    const { businessId } =
      await this.accessControlService.verifyBussinessOwnerShip({
        id: addressId,
        model: 'BUSINESS_ADDRESS',
        userId,
      })
    return this.prismaService.businessAddress.update({
      where: { id: addressId, businessId },
      data: {
        country: country && country,
        state: state && state,
        city: city && city,
        streetAddress: streetAddress && streetAddress,
        specificLocation: specificLocation && specificLocation,
      },
    })
  }

  async deleteBusinessAddress({
    id,
    userId,
  }: DeleteBusinessAddressParams): Promise<string> {
    await this.accessControlService.verifyBussinessOwnerShip({
      id,
      model: 'BUSINESS_ADDRESS',
      userId,
    })
    await this.prismaService.businessAddress.delete({
      where: { id },
    })

    return 'Buisness address deleted successfully'
  }

  async getBusinessAddresses({ businessId }: BaseBusinessIdParams) {
    return this.prismaService.businessAddress.findMany({
      where: { businessId },
    })
  }
}
