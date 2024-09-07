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
  ApiResponse,
  BareApiResponse,
} from 'src/common/util/types/responses.type'
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
  BaseIdParams,
  BusinessIdParams,
  CategoryIdParams,
  DeleteBusinessAddressParams,
  DeleteBusinessServicesParams,
  OptionalImageUrlParams,
  SearchBusinessByAddressParams,
  SearchBusinessParams,
  UserIdParams,
} from './../common/util/types/params.type'
@Injectable()
export default class BusinessService {
  constructor(private readonly prismaService: PrismaService) {}

  // helper methods

  // Private method to verify the business ID by querying the database.
  // Throws a BadRequestException if the business is not found.
  async #verifiyBusinessId({ id }: VerifyBusinessIdParams): Promise<Business> {
    const business = await this.prismaService.business.findFirst({
      where: { id },
    })
    if (!business) throw new BadRequestException('Invalid business ID')
    return business
  }

  // Private method to check if the user is the owner of the business.
  // This ensures that only the owner can modify the business.
  // Throws a ForbiddenException if the user is not the owner.
  async #checkOwner({
    userId,
    businessId,
  }: CheckOwnerParams): Promise<Business> {
    await this.#verifiyBusinessId({ id: businessId }) // Verify the business ID
    const business = await this.prismaService.business.findFirst({
      where: { ownerId: userId, id: businessId },
    })
    if (!business)
      throw new ForbiddenException('Only the owner can manipulate business')
    return business
  }

  // Private method to check if the business name already exists.
  // Ensures business names are unique and throws a ConflictException if the name is taken.
  async #checkBusinessName({
    name,
  }: CheckBusinessNameParams): Promise<Business> {
    const business = await this.prismaService.business.findFirst({
      where: { name: name.toLowerCase().trim() },
    })
    if (business) throw new ConflictException('Business name is taken')
    return business
  }

  // Private method to check if a business address already exists.
  // Prevents duplicate addresses from being registered for the same business.
  // Throws a ConflictException if the address is already registered.
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
                country: { contains: tolowercaseCustom(country) },
                city: { contains: tolowercaseCustom(city) },
                state: { contains: tolowercaseCustom(state) },
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
    if (business)
      throw new ConflictException('The address is already registered')
    return true
  }

  // Private method to check if a service name exists for a business.
  // Ensures that service names within a business are unique.
  // Throws a ConflictException if the service name exists.
  async #checkBusinessServiceName({
    businessId,
    name,
  }: CheckBusinessServiceNameParams): Promise<BussinesServiceModelType> {
    const service = await this.prismaService.bussinessService.findFirst({
      where: { businessId, name: name.toLowerCase().trim() },
    })
    if (service)
      throw new ConflictException('Service name exists in the business')
    return service
  }

  // Private method to verify the business service ID.
  // Throws a NotFoundException if the service is not found.
  async #verifyBusinessServiceId({
    id,
  }: VerifyBusinessServiceIdParams): Promise<BussinesServiceModelType> {
    const service = await this.prismaService.bussinessService.findFirst({
      where: { id },
    })
    if (!service) throw new NotFoundException('Invalid business Service ID')
    return service
  }

  // Private method to verify the business address ID.
  // Throws a NotFoundException if the address is not found.
  async #verifyBusinessAddressId({
    id,
  }: VerifyBusinessAddressIdParams): Promise<BusinessAddress> {
    const address = await this.prismaService.businessAddress.findFirst({
      where: { id },
    })
    if (!address) throw new NotFoundException('Invalid business Address ID')
    return address
  }

  async createBusiness(
    createBusinessDto: CreateBusinessDto & CreateBusinessParams,
  ): Promise<ApiResponse> {
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
  }: UpdateBusinessImageParams): Promise<ApiResponse> {
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
  }: UpdateBusinessDto & UserIdParams): Promise<ApiResponse> {
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
  }: CreateBusinessServiceDto &
    UserIdParams &
    OptionalImageUrlParams): Promise<ApiResponse> {
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
  }: UpdateBusinessImageParams): Promise<ApiResponse> {
    await this.#verifyBusinessServiceId({ id })
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
  }: UpdateBusinessServiceDto & UserIdParams): Promise<ApiResponse> {
    for (const { id } of services) await this.#verifyBusinessServiceId({ id })

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

    userId,
  }: DeleteBusinessServicesParams): Promise<BareApiResponse> {
    const { businessId } = await this.#verifyBusinessServiceId({ id })
    await this.#checkOwner({ businessId, userId })

    await this.prismaService.bussinessService.delete({
      where: {
        businessId,
        id: id,
      },
    })
    return {
      status: 'success',
      message: 'Buisness services deleted successfully',
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
  }: CreateBusinessAddressDto & UserIdParams): Promise<ApiResponse> {
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
  }: UpdateBusinessAddressDto & UserIdParams): Promise<ApiResponse> {
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
  async deleteBusinessAddress({
    id,
    userId,
  }: DeleteBusinessAddressParams): Promise<BareApiResponse> {
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
    }
  }

  // fetch related

  async getUserBusiness({ userId }: UserIdParams): Promise<ApiResponse> {
    const business = await this.prismaService.business.findMany({
      where: { ownerId: userId },
    })
    return {
      status: 'success',
      message: 'User buisness fetched successfully',
      data: business,
    }
  }
  async getAllBusiness(): Promise<ApiResponse> {
    const business = await this.prismaService.business.findMany()
    return {
      status: 'success',
      message: 'All buisness fetched successfully',
      data: business,
    }
  }

  async getBusinessDetail({ id }: BaseIdParams): Promise<ApiResponse> {
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
  }: BusinessIdParams & UserIdParams): Promise<ApiResponse> {
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

  async getCategoryBusinesses({
    categoryId,
  }: CategoryIdParams): Promise<ApiResponse> {
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

  async searchBusiness({
    searchKey,
  }: SearchBusinessParams): Promise<ApiResponse> {
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
          {
            address: {
              some: {
                OR: [
                  {
                    city: {
                      contains: searchKey,
                    },
                    country: {
                      contains: searchKey,
                    },
                    specificLocation: {
                      contains: searchKey,
                    },
                    state: {
                      contains: searchKey,
                    },
                    streetAddress: {
                      contains: searchKey,
                    },
                  },
                ],
              },
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
}
