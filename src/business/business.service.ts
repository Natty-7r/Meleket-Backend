import {
  capitalize,
  tolowercaseCustom,
} from './../common/util/helpers/string-util'
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

@Injectable()
export default class BusinessService {
  constructor(private readonly prismaService: PrismaService) {}

  async #checkOwner({
    userId,
    businessId,
  }: {
    userId: string
    businessId: string
  }) {
    const business = await this.prismaService.business.findFirst({
      where: { ownerId: userId, id: businessId },
    })
    if (!business)
      throw new ForbiddenException('Only the owner can manipute business')
    return business
  }

  async #checkBusinessName(name: string) {
    const business = await this.prismaService.business.findFirst({
      where: { name: name.toLowerCase().trim() },
    })
    if (business) throw new ConflictException('Business name  is taken')
    return business
  }
  async #verifiyBusinessId(id: string) {
    const business = await this.prismaService.business.findFirst({
      where: { id },
    })
    if (!business) throw new BadRequestException('Invalid business ID')
    return business
  }

  async #checkBusinessAddress({
    country,
    state,
    city,
    specificLocaiton,
    streetAddress,
    businessId,
  }: {
    businessId: string
    country: string
    state: string
    city: string
    streetAddress?: string
    specificLocaiton?: string
  }) {
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
                  contains: tolowercaseCustom(specificLocaiton || ''),
                },
              },
            ],
          },
        },
      },
    })
    if (business) throw new ConflictException('the address already regisred ')
  }

  async checkBusinessServiceName({
    businessId,
    name,
  }: {
    name: string
    businessId: string
  }) {
    const business = await this.prismaService.bussinesService.findFirst({
      where: { businessId, name: name.toLowerCase().trim() },
    })
    if (business)
      throw new ConflictException('Service name exist in the business')
    return business
  }
  async checkBusinessServiceId(id: string) {
    const business = await this.prismaService.bussinesService.findFirst({
      where: { id },
    })
    if (business) throw new ConflictException('Invalid  business Service ID')
    return business
  }

  async createBusiness(
    createBusinessDto: CreateBusinessDto,
    userId: string,
    mainImage?: string,
  ) {
    await this.#checkBusinessName(createBusinessDto.name)

    const businessMainImage = mainImage
      ? { image: mainImage }
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
        ownerId: userId,
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
  }: {
    id: string
    imageUrl: string
    userId: string
  }) {
    await this.#verifiyBusinessId(id)
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
  async updateBusiness(
    { id, name, description }: UpdateBusinessDto,
    userId: string,
  ) {
    console.log(id, name, description, userId)
    const business = await this.#verifiyBusinessId(id)
    await this.#checkOwner({ userId, businessId: id })

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

  async addBussinessService(
    { name, description, businessId, specifications }: CreateBusinessServiceDto,
    userId: string,
    imageUrl?: string,
  ) {
    await this.#checkOwner({ userId, businessId })
    await this.#verifiyBusinessId(businessId)
    await this.checkBusinessServiceName({
      businessId,
      name,
    })

    const buinessService = await this.prismaService.bussinesService.create({
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
  }: {
    id: string
    imageUrl: string
    userId: string
  }) {
    await this.checkBusinessServiceId(id)
    await this.#checkOwner({ userId, businessId: id })

    if (imageUrl.trim() == '') throw new BadRequestException('Invalid Image')
    const updatedBusiness = await this.prismaService.bussinesService.update({
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

  async updateBusinessServices(
    { services, businessId }: UpdateBusinessServiceDto,
    userId: string,
  ) {
    for (const { id, description, name, specifications } of services) {
      await this.#checkOwner({ userId, businessId: businessId })
      const businessService = await this.checkBusinessServiceId(id)
      await this.prismaService.bussinesService.update({
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
  }: {
    businessId: string
    id: string
    userId: string
  }) {
    await this.#checkOwner({ businessId, userId })

    const service = await this.prismaService.bussinesService.findFirst({
      where: { id, businessId },
    })
    if (!service)
      throw new BadRequestException('Invalid business or service Id')

    await this.prismaService.bussinesService.delete({
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

  // fetch related

  async getAllBusiness() {
    const business = await this.prismaService.business.findMany()
    return {
      status: 'success',
      message: 'All buisness fetched successfully',
      data: business,
    }
  }

  async getBusinessDetail(id: string) {
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

  async getUserBusinessDetail(businessId: string, userId: string) {
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

  async getCategoryBusiness({ categoryId }: { categoryId: string }) {
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

  async searchBusiness(searchKey: string) {
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

  async searchBusinessBYAddress(address: string) {
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
