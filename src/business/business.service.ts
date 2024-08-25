import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
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
        name: name || business.name.toLowerCase().trim(),
        description: description || business.description,
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
        name,
        businessId,
        description,
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
          description: description || businessService.description,
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
}
