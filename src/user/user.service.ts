import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import PrismaService from 'src/prisma/prisma.service'
import {
  BaseIdParams,
  BusinessIdParams,
  StoryIdParams,
  UserIdParams,
} from 'src/common/util/types/params.type'
import BusinessService from 'src/business/business.service'
import {
  ApiResponse,
  BareApiResponse,
} from 'src/common/util/types/responses.type'
import { validateAge } from 'src/common/util/helpers/validator.helper'
import { deleteFileAsync } from 'src/common/util/helpers/file.helper'
import AddReviewDto from './dto/add-review.dto'
import AddRatingDto from './dto/add-rating.dto'
import EditReviewDto from './dto/edit-review.dto'
import AddProfileDto from './dto/add-profile.dto'
import UpdateProfileDto from './dto/update-profile.dto'

@Injectable()
export default class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly businessSevice: BusinessService,
  ) {}

  // helpers

  async #checkUserId({ id }: BaseIdParams) {
    const user = await this.prismaService.user.findFirst({
      where: { id },
    })

    if (!user) throw new ForbiddenException('User not found')
    return true
  }

  async #checkProfileLevel({ id }: BaseIdParams) {
    const user = await this.prismaService.user.findFirst({
      where: { id },
    })

    if (user.profileLevel !== 'VERIFIED')
      throw new ForbiddenException('Not allowed for unverfied user   ')
    return true
  }

  // profile related

  async getUserDetail({ id }: BaseIdParams) {
    const userDetail = await this.prismaService.user.findFirst({
      where: { id },
    })
    return {
      status: 'success',
      message: `user detail fetced  successfully`,
      data: userDetail,
    }
  }

  async addProfile({
    userId,
    birthDate,
    ...addProfileDto
  }: AddProfileDto & UserIdParams): Promise<ApiResponse> {
    await this.#checkUserId({ id: userId })
    let profile = await this.prismaService.profile.findFirst({
      where: { userId },
    })
    if (profile)
      return this.updateProfile({ userId, ...addProfileDto, birthDate })
    const age = validateAge(birthDate)
    profile = await this.prismaService.profile.create({
      data: {
        userId,
        birthDate,
        age,
        ...addProfileDto,
      },
    })
    return {
      status: 'success',
      message: `profile added  successfully`,
      data: profile,
    }
  }

  async updateProfile({
    userId,
    birthDate,
    ...updateProfileDto
  }: UpdateProfileDto & UserIdParams): Promise<ApiResponse> {
    let oldProfilePicturePath
    await this.#checkUserId({ id: userId })

    let profile = await this.prismaService.profile.findFirst({
      where: { userId },
    })
    if (!profile) throw new BadRequestException('No profile added')
    const age = validateAge(birthDate)
    if (updateProfileDto.profilePicture)
      oldProfilePicturePath = profile.profilePicture
    profile = await this.prismaService.profile.update({
      where: { userId },
      data: {
        ...updateProfileDto,
        birthDate,
        age,
      },
    })
    if (oldProfilePicturePath)
      deleteFileAsync({ filePath: oldProfilePicturePath })
    return {
      status: 'success',
      message: `profile updated  successfully`,
      data: profile,
    }
  }

  // Review related

  async addReview({
    userId,
    businessId,
    review: reviewText,
  }: AddReviewDto & UserIdParams): Promise<ApiResponse> {
    await this.#checkProfileLevel({ id: userId })
    const business = await this.businessSevice.verifiyBusinessId({
      id: businessId,
    })
    if (business.ownerId === userId)
      throw new ForbiddenException('Owner cannot add review ')
    let review = await this.prismaService.review.findFirst({
      where: {
        businessId,
        userId,
      },
    })

    if (review)
      throw new ConflictException('User can only add one review for a business')
    review = await this.prismaService.review.create({
      data: { userId, businessId, review: reviewText },
    })
    return {
      status: 'success',
      message: `review added  successfully`,
      data: review,
    }
  }

  async updateReview({
    userId,
    id,
    review: reviewText,
  }: EditReviewDto & UserIdParams): Promise<ApiResponse> {
    await this.#checkProfileLevel({ id: userId })
    let review = await this.prismaService.review.findFirst({
      where: {
        id,
        userId,
      },
    })

    if (!review) throw new NotFoundException('Required review not found ')
    review = await this.prismaService.review.update({
      where: {
        id: review.id,
      },
      data: { review: reviewText },
    })
    return {
      status: 'success',
      message: `review updated   successfully`,
      data: review,
    }
  }

  async deleteReview({
    userId,
    id,
  }: BaseIdParams & UserIdParams): Promise<ApiResponse> {
    await this.#checkProfileLevel({ id: userId })
    let review = await this.prismaService.review.findFirst({
      where: {
        id,
        userId,
      },
    })

    if (!review) throw new NotFoundException('Required review not found ')
    review = await this.prismaService.review.delete({
      where: { userId, id },
    })
    return {
      status: 'success',
      message: `review deleted    successfully`,
      data: review,
    }
  }

  // Rating related
  async addRating({
    userId,
    businessId,
    rateValue,
  }: AddRatingDto & UserIdParams): Promise<ApiResponse> {
    await this.#checkProfileLevel({ id: userId })
    const business = await this.businessSevice.verifiyBusinessId({
      id: businessId,
    })
    if (business.ownerId === userId)
      throw new ForbiddenException('Owner cannot rate own business  ')
    let rating = await this.prismaService.rating.findFirst({
      where: {
        businessId,
        userId,
      },
    })

    if (rating)
      rating = await this.prismaService.rating.update({
        where: { id: rating.id },
        data: { rateValue },
      })
    rating = await this.prismaService.rating.create({
      data: { userId, businessId, rateValue },
    })
    this.businessSevice.calculateRatingSummary({ id: businessId })
    return {
      status: 'success',
      message: `Rating added successfully`,
      data: rating,
    }
  }

  // following
  async followBussiness({
    id,
    businessId,
  }: BaseIdParams & BusinessIdParams): Promise<BareApiResponse> {
    return this.businessSevice.addFollower({ id: businessId, userId: id })
  }

  async unFollowBussiness({
    id,
    businessId,
  }: BaseIdParams & BusinessIdParams): Promise<BareApiResponse> {
    return this.businessSevice.removeFollower({ id: businessId, userId: id })
  }

  async getFollowedBussiness({ id }: BaseIdParams): Promise<ApiResponse> {
    return this.businessSevice.getFollowerBusiness({ userId: id })
  }

  async viewStory({
    storyId,
    userId,
  }: StoryIdParams & UserIdParams): Promise<BareApiResponse> {
    let userStoryView = await this.prismaService.userStoryView.findUnique({
      where: {
        /* eslint-disable */
        userId_storyId: {
          userId,
          storyId,
        },
        /* eslint-disable */
      },
    })

    if (!userStoryView) {
      userStoryView = await this.prismaService.userStoryView.create({
        data: {
          userId,
          storyId,
        },
      })
      await this.businessSevice.updateStoryViewCount({ storyId })
    }

    return {
      status: 'success',
      message: `User added as veiw for story successfully`,
    }
  }
}
