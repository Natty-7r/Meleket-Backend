import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import PrismaService from 'src/prisma/prisma.service'
import {
  BaseBusinessIdParams,
  BaseIdParams,
  UserIdParams,
} from 'src/common/types/params.type'
import { ApiResponse } from 'src/common/types/responses.type'
import UserService from 'src/user/user.service'
import AddReviewDto from './dto/add-review.dto'
import BusinessService from '../business/business.service'
import EditReviewDto from './dto/edit-review.dto'

@Injectable()
export default class BusinessReviewService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly businessService: BusinessService,
    private readonly userService: UserService,
  ) {}

  async addReview({
    userId,
    businessId,
    review: reviewText,
  }: AddReviewDto & UserIdParams & BaseBusinessIdParams): Promise<ApiResponse> {
    await this.userService.checkProfileLevel({ id: userId })
    const business = await this.businessService.verifiyBusinessId({
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
  }: EditReviewDto & UserIdParams & BaseIdParams): Promise<ApiResponse> {
    await this.userService.checkProfileLevel({ id: userId })
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
    await this.userService.checkProfileLevel({ id: userId })
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

  async getReviews({ businessId }: BaseBusinessIdParams) {
    const reviews = await this.prismaService.review.findMany({
      where: { businessId },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return {
      status: 'success',
      message: `reviews fetched  successfully`,
      data: reviews,
    }
  }

  async getReviewDetail({ id }: BaseIdParams) {
    const reviewDetail = await this.prismaService.review.findMany({
      where: { id },
      include: {
        user: {
          select: { firstName: true, lastName: true, id: true },
        },
        business: {
          select: { name: true, category: true, id: true },
        },
      },
    })
    return {
      status: 'success',
      message: `review detail fetched  successfully`,
      data: reviewDetail,
    }
  }
}
