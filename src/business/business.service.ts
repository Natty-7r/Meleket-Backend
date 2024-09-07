import {
  BaseIdParams,
  BusinessIdParams,
  CategoryIdParams,
  DeleteBusinessAddressParams,
  DeleteBusinessServicesParams,
  ImageUrlParams,
  SearchBusinessByAddressParams,
  SearchBusinessParams,
  UserIdParams,
} from './../common/util/types/params.type'
import { tolowercaseCustom } from './../common/util/helpers/string-util'
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import PrismaService from 'src/prisma/prisma.service'
import CreateBusinessDto from './dto/create-business.dto'
import UpdateBusinessDto from './dto/update-business.dto'
import CreateBusinessServiceDto from './dto/create-business-service.dto'
import UpdateBusinessServiceDto from './dto/update-business-service.dto'
import CreateBusinessAddressDto from './dto/create-business-address.dto'
import UpdateBusinessAddressDto from './dto/update-business-address.dto'
import {
  Business,
  BusinessAddress,
  BussinessService as BussinesServiceModelType,
} from '@prisma/client'
import {
  CheckBusinessAddressParams,
  CheckBusinessNameParams,
  CheckBusinessServiceNameParams,
  CheckOwnerParams,
  CreateBusinessParams,
  UpdateBusinessImageParams,
  VerifyBusinessAddressIdParams,
  VerifyBusinessIdParams,
  VerifyBusinessServiceIdParams,
} from 'src/common/util/types/params.type'

@Injectable()
export default class BusinessService {
  constructor(private readonly prismaService: PrismaService) {}

  // helper methods

  async #verifiyBusinessId({ id }: VerifyBusinessIdParams): Promise<Business> {
    const business = await this.prismaService.business.findFirst({
      where: { id },
    })
    if (!business) throw new BadRequestException('Invalid business ID')
    return business
  }
  async #checkOwner({
    userId,
    businessId,
  }: CheckOwnerParams): Promise<Business> {
    // verify the bussiness id first
    await this.#verifiyBusinessId({ id: businessId })
    const business = await this.prismaService.business.findFirst({
      where: { ownerId: userId, id: businessId },
    })
    if (!business)
      throw new ForbiddenException('Only the owner can manipute business')
    return business
  }
  async #checkBusinessName({
    name,
  }: CheckBusinessNameParams): Promise<Business> {
    const business = await this.prismaService.business.findFirst({
      where: { name: name.toLowerCase().trim() },
    })
    if (business) throw new ConflictException('Business name  is taken')
    return business
  }

  async #checkBusinessAddress({
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
                country: {
                  contains: tolowercaseCustom(country),
                },
                city: {
                  contains: tolowercaseCustom(city),
                },
                state: {
                  contains: tolowercaseCustom(state),
                },
                streetAddress: {
                  contains: tolowercaseCustom(streetAddress || ''),
                },
                specificLocation: {
                  contains: tolowercaseCustom(specificLocation || ''),
                },
              },
            ],
          },
        },
      },
    })
    if (business) throw new ConflictException('the address already registered ')
    return true
  }

  async #checkBusinessServiceName({
    businessId,
    name,
  }: CheckBusinessServiceNameParams): Promise<BussinesServiceModelType> {
    const service = await this.prismaService.bussinessService.findFirst({
      where: { businessId, name: name.toLowerCase().trim() },
    })
    if (service)
      throw new ConflictException('Service name exist in the business')
    return service
  }
  async #verifyBusinessServiceId({
    id,
  }: VerifyBusinessServiceIdParams): Promise<BussinesServiceModelType> {
    const service = await this.prismaService.bussinessService.findFirst({
      where: { id },
    })
    if (service) throw new NotFoundException('Invalid  business Service ID')
    return service
  }

  async #verifyBusinessAddressId({
    id,
  }: VerifyBusinessAddressIdParams): Promise<BusinessAddress> {
    const address = await this.prismaService.businessAddress.findFirst({
      where: { id },
    })
    if (!address) throw new NotFoundException('Invalid  business Address ID')
    return address
  }

  async createBusiness(
    createBusinessDto: CreateBusinessDto & CreateBusinessParams,
  ) {
    await this.#checkBusinessName({ name: createBusinessDto.name })

    const businessMainImage = createBusinessDto.mainImage
      ? { image: createBusinessDto.mainImage }
      : await this.prismaService.category.findFirst({
          where: {
            id: createBusinessDto.categoryId,
          },
          select: {
            image: true,
          },
        })

    const business = await this.prismaService.business.create({
      data: {
        ...createBusinessDto,
        mainImageUrl: businessMainImage.image,
        ownerId: createBusinessDto.userId,
        name: createBusinessDto.name.toLowerCase().trim(),
        description: createBusinessDto.description.toLowerCase().trim(),
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
  async updateBusinessImage({
    id,
    imageUrl,
    userId,
  }: UpdateBusinessImageParams) {
    await this.#checkOwner({ userId, businessId: id })

    if (imageUrl.trim() == '') throw new BadRequestException('Invalid Image')
    const updatedBusiness = await this.prismaService.business.update({
      where: { id },
      data: { mainImageUrl: imageUrl },
    })

    return {
      status: 'success',
      message: 'Buisness image updated successfully',
      data: {
        ...updatedBusiness,
      },
    }
  }
  async updateBusiness({
    id,
    name,
    description,
    userId,
  }: UpdateBusinessDto & UserIdParams) {
    const business = await this.#checkOwner({ userId, businessId: id })

    const updatedBusiness = await this.prismaService.business.update({
      where: { id },
      data: {
        name: name.toLowerCase().trim() || business.name,
        description: description.toLowerCase().trim() || business.description,
      },
    })

    return {
      status: 'success',
      message: 'Buisness updated successfully',
      data: {
        ...updatedBusiness,
      },
    }
  }

  // business service related

  async addBussinessService({
    name,
    description,
    businessId,
    specifications,
    userId,
    imageUrl,
  }: CreateBusinessServiceDto & UserIdParams & ImageUrlParams) {
    await this.#checkOwner({ userId, businessId })
    await this.#checkBusinessServiceName({
      businessId,
      name,
    })

    const buinessService = await this.prismaService.bussinessService.create({
      data: {
        name: name.toLowerCase().trim(),
        businessId,
        description: description.toLowerCase().trim(),
        specifications: specifications as any,
        image: imageUrl,
      },
    })
    return {
      status: 'success',
      message: 'Buisness Service added successfully',
      data: {
        ...buinessService,
      },
    }
  }

  async updateBusinessServiceImage({
    id,
    imageUrl,
    userId,
  }: UpdateBusinessImageParams) {
    await this.#checkOwner({ userId, businessId: id })

    if (imageUrl.trim() == '') throw new BadRequestException('Invalid Image')
    const updatedBusiness = await this.prismaService.bussinessService.update({
      where: { id },
      data: { image: imageUrl },
    })

    return {
      status: 'success',
      message: 'Buisness image updated successfully',
      data: {
        ...updatedBusiness,
      },
    }
  }

  async updateBusinessServices({
    services,
    businessId,
    userId,
  }: UpdateBusinessServiceDto & UserIdParams) {
    for (const { id, description, name, specifications } of services) {
      await this.#checkOwner({ userId, businessId: businessId })
      const businessService = await this.#verifyBusinessServiceId({ id })
      await this.prismaService.bussinessService.update({
        where: { id },
        data: {
          name: name.toLowerCase().trim() || businessService.description,
          description:
            description.toLowerCase().trim() || businessService.description,
          specifications:
            specifications || (businessService.specifications as any),
        },
      })
    }

    const business = await this.prismaService.business.findFirst({
      where: { id: businessId },
    })

    return {
      status: 'success',
      message: 'Buisness services updated successfully',
      data: { ...business },
    }
  }
  async deleteBusinessServices({
    id,
    businessId,
    userId,
  }: DeleteBusinessServicesParams) {
    await this.#checkOwner({ businessId, userId })

    const service = await this.prismaService.bussinessService.findFirst({
      where: { id, businessId },
    })
    if (!service)
      throw new BadRequestException('Invalid business or service Id')

    await this.prismaService.bussinessService.delete({
      where: {
        businessId,
        id: id,
      },
    })
    return {
      status: 'success',
      message: 'Buisness services deleted successfully',
      data: null,
    }
  }

  // business address related
  async createBusinessAddress({
    businessId,
    country,
    city,
    state,
    specificLocation,
    streetAddress,
    userId,
  }: CreateBusinessAddressDto & UserIdParams) {
    await this.#checkOwner({
      businessId,
      userId,
    })
    await this.#checkBusinessAddress({
      country,
      city,
      state,
      specificLocation,
      streetAddress,
      businessId,
    })

    const buinessAddress = await this.prismaService.businessAddress.create({
      data: {
        businessId,
        country: tolowercaseCustom(country),
        state: tolowercaseCustom(state),
        city: tolowercaseCustom(city),
        streetAddress: tolowercaseCustom(streetAddress) || undefined,
        specificLocation: tolowercaseCustom(specificLocation) || undefined,
      },
    })
    return {
      status: 'success',
      message: 'Buisness address added successfully',
      data: {
        ...buinessAddress,
      },
    }
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
    const { businessId } = await this.#verifyBusinessAddressId({
      id: addressId,
    })
    await this.#checkOwner({
      userId,
      businessId,
    })

    const updatedBuinessAddress =
      await this.prismaService.businessAddress.update({
        where: { id: addressId, businessId },
        data: {
          country: country && tolowercaseCustom(country),
          state: state && tolowercaseCustom(state),
          city: city && tolowercaseCustom(city),
          streetAddress: streetAddress && tolowercaseCustom(streetAddress),
          specificLocation:
            specificLocation && tolowercaseCustom(specificLocation),
        },
      })
    return {
      status: 'success',
      message: 'Buisness address updated successfully',
      data: {
        ...updatedBuinessAddress,
      },
    }
  }
  async deleteBusinessAddress({ id, userId }: DeleteBusinessAddressParams) {
    const { businessId } = await this.#verifyBusinessAddressId({ id })
    await this.#checkOwner({
      userId,
      businessId,
    })
    await this.prismaService.businessAddress.delete({
      where: { id },
    })

    return {
      status: 'success',
      message: 'Buisness address deleted successfully',
      data: null,
    }
  }

  // fetch related

  async getAllBusiness() {
    const business = await this.prismaService.business.findMany()
    return {
      status: 'success',
      message: 'All buisness fetched successfully',
      data: business,
    }
  }

  async getBusinessDetail({ id }: BaseIdParams) {
    const businessDetail = await this.prismaService.business.findFirst({
      where: { id },
      select: {
        followers: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        ratings: true,
        reviews: true,
        address: true,
        contact: true,
        services: true,
      },
    })
    return {
      status: 'success',
      message: 'All buisness fetched successfully',
      data: businessDetail,
    }
  }

  async getUserBusinessDetail({
    businessId,
    userId,
  }: BusinessIdParams & UserIdParams) {
    await this.#checkOwner({ userId, businessId })
    const businessDetail = await this.prismaService.business.findFirst({
      where: { id: businessId },
      select: {
        followers: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        ratings: true,
        reviews: true,
        address: true,
        contact: true,
        services: true,
        bills: true,
        packages: true,
      },
    })
    return {
      status: 'success',
      message: 'All buisness fetched successfully',
      data: businessDetail,
    }
  }

  async getCategoryBusiness({ categoryId }: CategoryIdParams) {
    const category = await this.prismaService.category.findFirst({
      where: { id: categoryId },
    })
    if (!category) throw new NotFoundException('Invalid category id ')
    const business = await this.prismaService.business.findMany({
      where: { categoryId },
    })
    return {
      status: 'success',
      message: `${category.name}  buisness fetched successfully`,
      data: business,
    }
  }

  async searchBusiness({ searchKey }: SearchBusinessParams) {
    const business = await this.prismaService.business.findMany({
      where: {
        OR: [
          {
            name: {
              contains: searchKey.toLowerCase().trim(),
            },
          },
          {
            description: {
              contains: searchKey.toLowerCase().trim(),
            },
          },
        ],
      },
    })
    if (!business || business.length == 0)
      throw new NotFoundException(`no buisness for  ${searchKey} key `)
    return {
      status: 'success',
      message: `buisness for ${searchKey} key fetched successfully`,
      data: business,
    }
  }

  async searchBusinessBYAddress({ address }: SearchBusinessByAddressParams) {
    const business = await this.prismaService.business.findMany({
      where: {
        address: {
          some: {
            OR: [
              {
                city: {
                  contains: address,
                },
                country: {
                  contains: address,
                },
                specificLocation: {
                  contains: address,
                },
                state: {
                  contains: address,
                },
                streetAddress: {
                  contains: address,
                },
              },
            ],
          },
        },
      },
    })
    if (!business || business.length == 0)
      throw new NotFoundException(`no buisness for name:${address} location  `)
    return {
      status: 'success',
      message: `buisness for ${address} location fetched successfully`,
      data: business,
    }
  }
}
