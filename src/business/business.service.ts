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
  BusinessAddress,
  BussinessService as BussinesServiceModelType,
  Story,
} from '@prisma/client'
import {
  ApiResponse,
  BareApiResponse,
} from 'src/common/util/types/responses.type'
import { deleteFileAsync } from 'src/common/util/helpers/file.helper'
import { validateStory } from 'src/common/util/helpers/validator.helper'
import { generateBusinessSorting } from 'src/common/util/helpers/sorting.helper'
import { createPagination } from '../common/util/helpers/pagination.helper'

import { ApiResponseWithPagination } from '../common/util/types/responses.type'
import CreateBusinessDto from './dto/create-business.dto'
import UpdateBusinessDto from './dto/update-business.dto'
import CreateBusinessServiceDto from './dto/create-business-service.dto'
import CreateBusinessAddressDto from './dto/create-business-address.dto'
import UpdateBusinessAddressDto from './dto/update-business-address.dto'
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
  BusinessIdParams,
  CategoryIdParams,
  DeleteBusinessAddressParams,
  DeleteBusinessServicesParams,
  ImageUrlParams,
  SearchBusinessParams,
  UserIdParams,
  BaseIdParams,
  StoryIdParams,
  OptionalUserIdParams,
  PaginationParams,
  BaseNameParams,
} from '../common/util/types/params.type'
import UpdateBusinessContactDto from './dto/update-business-contact.dto'
import CreateStoryDto from './dto/create-story.dto'
import UpdateStoryDto from './dto/update-store.dto'
import UpdateBusinessServicesDto from './dto/update-business-services.dto'

@Injectable()
export default class BusinessService {
  constructor(private readonly prismaService: PrismaService) {}

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
    const story = await this.#verifyBusinessStoryId({ id: storyId })

    return await this.prismaService.story.update({
      where: { id: storyId },
      data: {
        viewCount: story.viewCount + 1,
      },
    })
  }

  // Private method to verify the business ID by querying the database.
  // Throws a BadRequestException if the business is not found.

  async #checkUserProfileLevele({ userId }: UserIdParams): Promise<boolean> {
    const user = await this.prismaService.user.findFirst({
      where: { id: userId },
    })

    if (!user) throw new UnauthorizedException('User not found ')
    if (user?.profileLevel !== 'VERIFIED')
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

  // Private method to check if the user is the owner of the business.
  // This ensures that only the owner can modify the business.
  // Throws a ForbiddenException if the user is not the owner.
  async #checkOwner({
    userId,
    businessId,
  }: CheckOwnerParams): Promise<Business> {
    await this.verifiyBusinessId({ id: businessId }) // Verify the business ID
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

  // Private method to check if a service name exists for a business.
  // Ensures that service names within a business are unique.
  // Throws a ConflictException if the service name exists.
  async #checkBusinessServiceName({
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

  async #verifyBusinessStoryId({ id }: BaseIdParams): Promise<Story> {
    const story = await this.prismaService.story.findFirst({
      where: { id },
    })
    if (!story) throw new NotFoundException('Invalid story ID')
    return story
  }

  async createBusiness({
    userId,
    ...createBusinessDto
  }: CreateBusinessDto & CreateBusinessParams): Promise<ApiResponse> {
    await this.#checkUserProfileLevele({ userId })
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
    const business = await this.#checkOwner({ userId, businessId: id })

    if (imageUrl.trim() == '') throw new BadRequestException('Invalid Image')

    const updatedBusiness = await this.prismaService.business.update({
      where: { id },
      data: { mainImageUrl: imageUrl },
    })
    deleteFileAsync({ filePath: business.mainImageUrl })
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
        name: name || business.name,
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
    ImageUrlParams): Promise<ApiResponse> {
    await this.#checkOwner({ userId, businessId })
    await this.#checkBusinessServiceName({
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
    await this.#checkOwner({ userId, businessId: id })
    const service = await this.#verifyBusinessServiceId({ id })

    if (imageUrl.trim() == '') throw new BadRequestException('Invalid Image')
    const updatedBusiness = await this.prismaService.bussinessService.update({
      where: { id },
      data: { image: imageUrl },
    })
    deleteFileAsync({ filePath: service.image })
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
  }: UpdateBusinessServicesDto & UserIdParams): Promise<ApiResponse> {
    for (const { id } of services) await this.#verifyBusinessServiceId({ id })

    for (const { id, description, name, specifications } of services) {
      await this.#checkOwner({ userId, businessId })
      const businessService = await this.#verifyBusinessServiceId({ id })
      await this.prismaService.bussinessService.update({
        where: { id },
        data: {
          name: name || businessService.description,
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

  async deleteBusinessServices({
    id,
    userId,
  }: DeleteBusinessServicesParams): Promise<BareApiResponse> {
    const { businessId } = await this.#verifyBusinessServiceId({ id })
    await this.#checkOwner({ businessId, userId })

    await this.prismaService.bussinessService.delete({
      where: {
        businessId,
        id,
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
        country,
        state,
        city,
        streetAddress: streetAddress || undefined,
        specificLocation: specificLocation || undefined,
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
          country: country && country,
          state: state && state,
          city: city && city,
          streetAddress: streetAddress && streetAddress,
          specificLocation: specificLocation && specificLocation,
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

  // bussiness contact related

  async updateBusinessContact({
    businessId,
    userId,
    ...updateBusinessContactDto
  }: UpdateBusinessContactDto & UserIdParams): Promise<ApiResponse> {
    const b = await this.#checkOwner({
      userId,
      businessId,
    })
    const updatedBuinessContact =
      await this.prismaService.businessContact.update({
        where: { businessId },
        data: {
          ...updateBusinessContactDto,
        },
      })
    return {
      status: 'success',
      message: 'Buisness contact updated successfully',
      data: {
        ...updatedBuinessContact,
      },
    }
  }
  // fetch related

  async getCategoryBusinesses({
    categoryId,
    page = 1,
    items = 10,
    sort = ['rating'],
    sortType = 'desc',
    name: categoryName,
  }: CategoryIdParams & PaginationParams & BaseNameParams): Promise<
    ApiResponseWithPagination<Business[]>
  > {
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
      status: 'success',
      message: `${categoryName}  buisness fetched successfully`,
      data: {
        pagination: createPagination({
          totalCount: totalBusinesses,
          page,
          items,
        }),
        payload: businesses,
      },
    }
  }

  async getAllBusinesses(): Promise<ApiResponse> {
    const business = await this.prismaService.business.findMany({
      select: {
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
    return {
      status: 'success',
      message: 'All buisness fetched successfully',
      data: business,
    }
  }

  async getUserBusinesses({ userId }: UserIdParams): Promise<ApiResponse> {
    const business = await this.prismaService.business.findMany({
      where: { ownerId: userId },
      select: {
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
    return {
      status: 'success',
      message: 'User buisness fetched successfully',
      data: business,
    }
  }

  async getBusinessDetail({ id }: BaseIdParams): Promise<ApiResponse> {
    const businessDetail = await this.prismaService.business.findFirst({
      where: { id },
      select: {
        ratings: true,
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

  async searchBusinesses({
    searchKey,
  }: SearchBusinessParams): Promise<ApiResponse> {
    const business = await this.prismaService.business.findMany({
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
    if (!business || business.length == 0)
      throw new NotFoundException(`no buisness for  ${searchKey} key `)
    return {
      status: 'success',
      message: `buisness for ${searchKey} key fetched successfully`,
      data: business,
    }
  }

  // follow related
  async addFollower({
    id,
    userId,
  }: BaseIdParams & UserIdParams): Promise<BareApiResponse> {
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

    return {
      status: 'success',
      message: 'User followed buisness  successfully',
    }
  }

  async removeFollower({
    id,
    userId,
  }: BaseIdParams & UserIdParams): Promise<BareApiResponse> {
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

    return {
      status: 'success',
      message: 'User unfollowed buisness successfully',
    }
  }

  async getFollowerBusiness({ userId }: UserIdParams): Promise<ApiResponse> {
    const businesses = await this.prismaService.business.findMany({
      where: {
        followers: {
          some: {
            id: userId,
          },
        },
      },
      select: {
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
    return {
      status: 'success',
      message: 'followed  buisness feteched successfully',
      data: businesses,
    }
  }
  // story related

  async addStory({
    businessId,
    userId,
    ...createStoryDto
  }: CreateStoryDto & UserIdParams): Promise<ApiResponse> {
    await this.#checkOwner({
      userId,
      businessId,
    })
    validateStory({ ...createStoryDto })
    const story = await this.prismaService.story.create({
      data: {
        businessId,
        ...createStoryDto,
      },
    })

    return {
      status: 'success',
      message: 'story added successfully',
      data: story,
    }
  }

  async updateStory({
    userId,
    id,
    ...updateStoryDto
  }: UpdateStoryDto & UserIdParams): Promise<ApiResponse> {
    let oldImageUrl
    let story = await this.#verifyBusinessStoryId({
      id,
    })

    await this.#checkOwner({ businessId: story.businessId, userId })
    if (updateStoryDto.image) oldImageUrl = story.image
    validateStory({ ...updateStoryDto })
    story = await this.prismaService.story.update({
      where: { id },
      data: {
        ...updateStoryDto,
      },
    })

    if (oldImageUrl) deleteFileAsync({ filePath: oldImageUrl })

    return {
      status: 'success',
      message: 'story updated  successfully',
      data: story,
    }
  }

  async deleteStory({
    userId,
    id,
  }: BaseIdParams & UserIdParams): Promise<BareApiResponse> {
    let story = await this.#verifyBusinessStoryId({
      id,
    })
    await this.#checkOwner({ businessId: story.businessId, userId })

    story = await this.prismaService.story.delete({
      where: { id },
    })
    deleteFileAsync({ filePath: story?.image || '' })
    return {
      status: 'success',
      message: 'story deleted  successfully',
    }
  }
  async getStories({ userId }: OptionalUserIdParams): Promise<ApiResponse> {
    const stories = await this.prismaService.story.findMany({
      orderBy: [{ createdAt: 'desc' }],
    })

    let viewedStoryIds: Set<string> = new Set()
    if (userId) {
      const userViews = await this.prismaService.userStoryView.findMany({
        where: { userId },
        select: { storyId: true },
      })

      viewedStoryIds = new Set(userViews.map((view) => view.storyId))
    }

    const enhancedStories = stories.map((story) => ({
      ...story,
      viewed: userId ? viewedStoryIds.has(story.id) : false,
    }))

    return {
      status: 'success',
      message: 'Stories fetched successfully',
      data: enhancedStories,
    }
  }
  async getBusinessStories({
    userId,
    businessId,
  }: BusinessIdParams & OptionalUserIdParams): Promise<ApiResponse> {
    const stories = await this.prismaService.story.findMany({
      where: { businessId },
      orderBy: [{ createdAt: 'desc' }],
    })

    let viewedStoryIds: Set<string> = new Set()
    if (userId) {
      const userViews = await this.prismaService.userStoryView.findMany({
        where: { userId },
        select: { storyId: true },
      })

      viewedStoryIds = new Set(userViews.map((view) => view.storyId))
    }

    const enhancedStories = stories.map((story) => ({
      ...story,
      viewed: userId ? viewedStoryIds.has(story.id) : false,
    }))

    return {
      status: 'success',
      message: 'Stories fetched successfully',
      data: enhancedStories,
    }
  }
}
