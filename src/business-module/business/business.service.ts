import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import PrismaService from 'src/prisma/prisma.service'
import {
  Business,
  BussinessService as BussinesServiceModelType,
  Story,
} from '@prisma/client'
import { deleteFileAsync } from 'src/common/helpers/file.helper'
import { generateBusinessSorting } from 'src/common/helpers/sorting.helper'
import LoggerService from 'src/logger/logger.service'
import AccessControlService from 'src/access-control/access-control.service'
import { createPagination } from '../../common/helpers/pagination.helper'

import CreateBusinessDto from './dto/create-business.dto'
import UpdateBusinessDto from './dto/update-business.dto'
import {
  CheckBusinessAddressParams,
  CheckBusinessNameParams,
  CheckBusinessServiceNameParams,
  CreateBusinessParams,
  UpdateBusinessImageParams,
  VerifyBusinessIdParams,
  VerifyBusinessServiceIdParams,
  BusinessIdParams,
  CategoryIdParams,
  SearchBusinessParams,
  UserIdParams,
  BaseIdParams,
  StoryIdParams,
  PaginationParams,
  BaseNameParams,
} from '../../common/types/params.type'
import UpdateBusinessContactDto from './dto/update-business-contact.dto'

@Injectable()
export default class BusinessService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly loggerService: LoggerService,
    private readonly accessControlService: AccessControlService,
  ) {}

  // helper methods

  async calculateRatingSummary({ id }: BaseIdParams) {
    const ratings = await this.prismaService.rating.findMany({
      where: {
        businessId: id,
      },
    })

    const averageRating =
      ratings.reduce((sum, rating) => {
        return sum + rating.rateValue
      }, 0.0) / ratings.length
    /* eslint-disable */
    const ratingSummary = {
      1: ratings.filter((rating) => rating.rateValue === 1).length,
      2: ratings.filter((rating) => rating.rateValue === 2).length,
      3: ratings.filter((rating) => rating.rateValue === 3).length,
      4: ratings.filter((rating) => rating.rateValue === 4).length,
      5: ratings.filter((rating) => rating.rateValue === 5).length,
    }
    /* eslint-disable */
    return this.prismaService.business.update({
      where: { id },
      data: {
        averageRating,
        ratingSummary: JSON.stringify(ratingSummary),
      },
    })
  }
  async updateStoryViewCount({ storyId }: StoryIdParams): Promise<Story> {
    const story = await this.verifyBusinessStoryId({ id: storyId })

    return await this.prismaService.story.update({
      where: { id: storyId },
      data: {
        viewCount: story.viewCount + 1,
      },
    })
  }

  async checkUserProfileLevel({ userId }: UserIdParams): Promise<boolean> {
    const user = await this.prismaService.user.findFirst({
      where: { id: userId },
    })

    if (!user) throw new UnauthorizedException('User not found ')
    if (user?.status !== 'CREATED')
      throw new ForbiddenException('Unverfied user cannot create business ')
    return true
  }

  async verifiyBusinessId({ id }: VerifyBusinessIdParams): Promise<Business> {
    const business = await this.prismaService.business.findFirst({
      where: { id },
    })
    if (!business) throw new BadRequestException('Invalid business ID')
    return business
  }

  async checkBusinessName({
    name,
  }: CheckBusinessNameParams): Promise<Business> {
    const business = await this.prismaService.business.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
    })
    if (business) throw new ConflictException('Business name is taken')
    return business
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

  async verifyBusinessServiceId({
    id,
  }: VerifyBusinessServiceIdParams): Promise<BussinesServiceModelType> {
    const service = await this.prismaService.bussinessService.findFirst({
      where: { id },
    })
    if (!service) throw new NotFoundException('Invalid business Service ID')
    return service
  }

  async verifyBusinessStoryId({ id }: BaseIdParams): Promise<Story> {
    const story = await this.prismaService.story.findFirst({
      where: { id },
    })
    if (!story) throw new NotFoundException('Invalid story ID')
    return story
  }

  async createBusiness({
    userId,
    ...createBusinessDto
  }: CreateBusinessDto & CreateBusinessParams) {
    await this.checkUserProfileLevel({ userId })
    await this.checkBusinessName({ name: createBusinessDto.name })

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
        ownerId: userId,
        name: createBusinessDto.name,
        description: createBusinessDto.description,
        contact: {},
        averageRating: 0,
        ratingSummary: JSON.stringify({
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
        }),
      },
      select: {
        owner: { select: { id: true, firstName: true, lastName: true } },
        name: true,
        description: true,
        templateId: true,
        mainImageUrl: true,
        averageRating: true,
        category: { select: { name: true, id: true } },
      },
    })
    this.accessControlService.assignClientRole({ id: userId })
    this.loggerService.createLog({
      logType: 'USER_ACTIVITY',
      message: `${business.owner.firstName.concat(' ').concat(business.owner.lastName)} created bussines with name:${business.name} under category:${business.category.name}`,
      context: 'new bussines',
      userId,
    })
    return business
  }

  async updateBusinessImage({
    id,
    imageUrl,
    userId,
  }: UpdateBusinessImageParams) {
    const { entity: bussiness } =
      await this.accessControlService.verifyBussinessOwnerShip({
        id,
        model: 'BUSINESS',
        userId,
      })

    if (imageUrl.trim() == '') throw new BadRequestException('Invalid Image')

    return await this.prismaService.business.update({
      where: { id },
      data: { mainImageUrl: imageUrl },
    })
    deleteFileAsync({ filePath: (bussiness as Business).mainImageUrl })
  }

  async updateBusiness({
    id,
    name,
    description,
    userId,
  }: UpdateBusinessDto & UserIdParams) {
    const { entity: bussiness } =
      await this.accessControlService.verifyBussinessOwnerShip({
        id,
        model: 'BUSINESS',
        userId,
      })

    return await this.prismaService.business.update({
      where: { id },
      data: {
        name: name || (bussiness as Business).name,
        description: description || (bussiness as Business).description,
      },
    })
  }

  async updateBusinessContact({
    businessId,
    userId,
    ...updateBusinessContactDto
  }: UpdateBusinessContactDto & UserIdParams) {
    await this.accessControlService.verifyBussinessOwnerShip({
      id: businessId,
      model: 'BUSINESS_CONTACT',
      userId,
    })
    return await this.prismaService.businessContact.update({
      where: { businessId },
      data: {
        ...updateBusinessContactDto,
      },
    })
  }
  // fetch related

  async getCategoryBusinesses({
    categoryId,
    page = 1,
    items = 10,
    sort = ['rating'],
    sortType = 'desc',
    name: categoryName,
  }: CategoryIdParams & PaginationParams & BaseNameParams) {
    const businesses = await this.prismaService.business.findMany({
      where: { categoryId },
      take: items,
      skip: (page - 1) * items,
      orderBy: generateBusinessSorting({ sortKeys: sort, sortType }),
    })
    const totalBusinesses = await this.prismaService.business.count({
      where: { categoryId },
    })
    return {
      pagination: createPagination({
        totalCount: totalBusinesses,
        page,
        items,
      }),
      payload: businesses,
    }
  }

  async getAllBusinesses() {
    return await this.prismaService.business.findMany({
      select: {
        id: true,
        name: true,
        mainImageUrl: true,
        description: true,
        averageRating: true,
        category: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            reviews: true,
            followers: true,
          },
        },
      },
    })
  }

  async getUserBusinesses({ userId }: UserIdParams) {
    return await this.prismaService.business.findMany({
      where: { ownerId: userId },
      select: {
        id: true,
        name: true,
        mainImageUrl: true,
        description: true,
        averageRating: true,
        category: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            reviews: true,
            followers: true,
          },
        },
      },
    })
  }

  async getBusinessPackageDetail({ businessId }: BusinessIdParams) {
    return this.prismaService.business.findFirst({
      where: { id: businessId },
      select: {
        category: {
          select: {
            name: true,
            price: true,
          },
        },
        id: true,
      },
    })
  }

  async getBusinessDetail({
    businessId,
    userId,
  }: BusinessIdParams & UserIdParams): Promise<any> {
    const bussiness = await this.verifiyBusinessId({ id: businessId })
    const select: any = {
      id: true,
      name: true,
      followers: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
      category: {
        select: {
          name: true,
        },
      },
      ratings: true,
      reviews: true,
      address: true,
      contact: true,
      services: true,
    }
    if (bussiness.ownerId === userId) {
      select.bills = true
      select.packages = true
    }
    return await this.prismaService.business.findFirst({
      where: { id: businessId },
      select,
    })
  }

  async searchBusinesses({ searchKey }: SearchBusinessParams) {
    return await this.prismaService.business.findMany({
      where: {
        OR: [
          {
            name: {
              contains: searchKey,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: searchKey,
              mode: 'insensitive',
            },
          },
          {
            address: {
              some: {
                OR: [
                  {
                    city: {
                      contains: searchKey,
                      mode: 'insensitive',
                    },
                    country: {
                      contains: searchKey,
                      mode: 'insensitive',
                    },
                    specificLocation: {
                      contains: searchKey,
                      mode: 'insensitive',
                    },
                    state: {
                      contains: searchKey,
                      mode: 'insensitive',
                    },
                    streetAddress: {
                      contains: searchKey,
                      mode: 'insensitive',
                    },
                  },
                ],
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        mainImageUrl: true,
        description: true,
        averageRating: true,
        category: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            reviews: true,
            followers: true,
          },
        },
      },
    })
  }

  // follow related
  async addFollower({
    id,
    userId,
  }: BaseIdParams & UserIdParams): Promise<string> {
    await this.verifiyBusinessId({ id })

    await this.prismaService.business.update({
      where: { id },
      data: {
        followers: {
          connect: {
            id: userId,
          },
        },
      },
    })

    return 'User followed buisness  successfully'
  }

  async removeFollower({
    id,
    userId,
  }: BaseIdParams & UserIdParams): Promise<string> {
    await this.verifiyBusinessId({ id })

    await this.prismaService.business.update({
      where: { id },
      data: {
        followers: {
          disconnect: {
            id: userId,
          },
        },
      },
    })

    return 'User unfollowed buisness successfully'
  }

  async getFollowerBusiness({ userId }: UserIdParams) {
    return await this.prismaService.business.findMany({
      where: {
        followers: {
          some: {
            id: userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        mainImageUrl: true,
        description: true,
        averageRating: true,
        category: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            reviews: true,
            followers: true,
          },
        },
      },
    })
  }

  //
}
