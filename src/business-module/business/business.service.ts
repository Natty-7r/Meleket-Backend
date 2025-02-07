import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import {
  Business,
  BusinessContact,
  BussinessService as BussinesServiceModelType,
  Prisma,
  Story,
} from '@prisma/client'
import AccessControlService from 'src/access-control/access-control.service'
import { deleteFileAsync } from 'src/common/helpers/file.helper'
import LoggerService from 'src/logger/logger.service'
import PrismaService from 'src/prisma/prisma.service'

import paginator from 'src/common/helpers/pagination.helper'
import {
  BusinessSortableFields,
  PaginatedResult,
} from 'src/common/types/base.type'
import {
  BaseIdParams,
  BusinessIdParams,
  CheckBusinessAddressParams,
  CheckBusinessNameParams,
  CheckBusinessServiceNameParams,
  CreateBusinessParams,
  StoryIdParams,
  UserIdParams,
  VerifyBusinessIdParams,
  VerifyBusinessServiceIdParams,
} from '../../common/types/params.type'
import BusinessQueryDto from './dto/business-query.dto'
import CreateBusinessDto from './dto/create-business.dto'
import UpdateBusinessContactDto from './dto/update-business-contact.dto'
import UpdateBusinessDto from './dto/update-business.dto'
import { MAIN_CATEGORY_PATH } from 'src/common/constants/base.constants'

@Injectable()
export default class BusinessService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly loggerService: LoggerService,
    private readonly accessControlService: AccessControlService,
  ) {}

  // helper methods

  async updateStoryViewCount({ storyId }: StoryIdParams): Promise<Story> {
    const story = await this.verifyBusinessStoryId({ id: storyId })

    return await this.prismaService.story.update({
      where: { id: storyId },
      data: {
        viewCount: story.viewCount + 1,
      },
    })
  }

  async verifyCategoryId({ id }: BaseIdParams) {
    const category = await this.prismaService.category.findFirst({
      where: { id },
    })
    if (!category) throw new BadRequestException('Invalid category Id')
    return category
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
    image,
    ...createBusinessDto
  }: CreateBusinessDto & CreateBusinessParams): Promise<any> {
    await this.verifyCategoryId({ id: createBusinessDto.categoryId })
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
        id: true,
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

  async updateBusiness({
    id,
    name,
    description,
    userId,
    image,
  }: UpdateBusinessDto & UserIdParams & BaseIdParams): Promise<Business> {
    const { entity: bussiness } =
      await this.accessControlService.verifyBussinessOwnerShip({
        id,
        model: 'BUSINESS',
        userId,
      })

    const updatedBusiness = await this.prismaService.business.update({
      where: { id },
      data: {
        name: name || (bussiness as Business).name,
        description: description || (bussiness as Business).description,
        mainImageUrl: image?.path || (bussiness as Business).mainImageUrl,
      },
    })

    if (image && (bussiness as Business).mainImageUrl != MAIN_CATEGORY_PATH)
      deleteFileAsync({ filePath: (bussiness as Business).mainImageUrl })

    return updatedBusiness
  }

  async updateBusinessContact({
    businessId,
    userId,
    ...updateBusinessContactDto
  }: UpdateBusinessContactDto & UserIdParams): Promise<BusinessContact> {
    const {} = await this.accessControlService.verifyBussinessOwnerShip({
      id: businessId,
      model: 'BUSINESS_CONTACT',
      userId,
    })
    const updatedBuinessContact =
      await this.prismaService.businessContact.update({
        where: { businessId },
        data: {
          ...updateBusinessContactDto,
        },
      })
    return updatedBuinessContact
  }
  // fetch related

  async getAllBusinesses({
    search,
    userId,
    categoryId,
    orderOption,
    orderType,
    page,
    itemsPerPage,
  }: BusinessQueryDto): Promise<PaginatedResult<Business>> {
    const where: Prisma.BusinessWhereInput = { AND: [{ deletedAt: null }] }
    let orderBy: Prisma.BusinessOrderByWithRelationInput = {
      createdAt: 'desc',
    }
    const select: Prisma.BusinessSelect = {
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
    }
    /** Where constructor */
    if (search) {
      where.AND = [
        ...(where.AND as any),
        {
          OR: [
            {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              address: {
                some: {
                  OR: [
                    {
                      city: {
                        contains: search,
                        mode: 'insensitive',
                      },
                      country: {
                        contains: search,
                        mode: 'insensitive',
                      },
                      specificLocation: {
                        contains: search,
                        mode: 'insensitive',
                      },
                      state: {
                        contains: search,
                        mode: 'insensitive',
                      },
                      streetAddress: {
                        contains: search,
                        mode: 'insensitive',
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
      ]
    }
    if (userId) where.AND = [...(where.AND as any), { ownerId: userId }]
    if (categoryId) where.AND = [...(where.AND as any), { categoryId }]

    /** Order by constructor */
    if (orderOption && orderType) {
      if (orderOption === BusinessSortableFields.follower)
        orderBy = {
          followers: {
            _count: orderType,
          },
        }
      if (orderOption === BusinessSortableFields.rating)
        orderBy = {
          averageRating: orderType,
        }
      if (orderOption === BusinessSortableFields.service)
        orderBy = {
          services: {
            _count: orderType,
          },
        }
    }

    return paginator<Business, Business>({
      model: this.prismaService.business,
      selectionOption: {
        condition: where,
        select: select as any,
        orderBy: orderBy as any,
      },
      pageOptions: { page, itemsPerPage },
    })
  }

  async getBusinessDetail({ id }: BaseIdParams): Promise<any> {
    const businessDetail = await this.prismaService.business.findFirst({
      where: { id },
      select: {
        category: {
          select: {
            name: true,
            price: true,
          },
        },
        id: true,
        reviews: {
          take: 10,
          orderBy: [{ createdAt: 'desc' }],
        },
        followers: {
          take: 10,
          orderBy: [{ createdAt: 'desc' }],
        },
        address: true,
        contact: true,
        services: true,
      },
    })
    return businessDetail
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

  async getUserBusinessDetail({
    businessId,
    userId,
  }: BusinessIdParams & UserIdParams): Promise<any> {
    await this.accessControlService.verifyBussinessOwnerShip({
      id: businessId,
      model: 'BUSINESS',
      userId,
    })
    const businessDetail = await this.prismaService.business.findFirst({
      where: { id: businessId },
      select: {
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
        reviews: true,
        address: true,
        contact: true,
        services: true,
        bills: true,
        packages: true,
      },
    })
    return businessDetail
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

  async getFollowerBusiness({ userId }: UserIdParams): Promise<any> {
    const businesses = await this.prismaService.business.findMany({
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
    return businesses
  }
}
