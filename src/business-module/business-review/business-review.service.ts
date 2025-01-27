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

  async calculateRatingSummary({ id }: BaseIdParams) {
    const reviews = await this.prismaService.review.findMany({
      where: {
        businessId: id,
        rating: { not: null },
      },
      select: { rating: true },
    })

    const averageRating =
      reviews.reduce((sum, rating) => {
        return sum + rating.rating
      }, 0.0) / reviews.length
    /* eslint-disable */
    const ratingSummary = {
      1: reviews.filter((rating) => rating.rating === 1).length,
      2: reviews.filter((rating) => rating.rating === 2).length,
      3: reviews.filter((rating) => rating.rating === 3).length,
      4: reviews.filter((rating) => rating.rating === 4).length,
      5: reviews.filter((rating) => rating.rating === 5).length,
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

  async addReview({
    userId,
    businessId,
    review: reviewText,
    rating,
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
      data: { userId, businessId, review: reviewText, rating },
    })
    if (rating) this.calculateRatingSummary({ id: businessId })
    return {
      status: 'success',
      message: `review added  successfully`,
      data: review,
    }
  }

  async updateReview({
    userId,
    id,
    ...editReviewDto
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
      data: { ...editReviewDto, updatedAt: new Date() },
    })
    if (editReviewDto.rating)
      this.calculateRatingSummary({ id: review.businessId })
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
    const review = await this.prismaService.review.findFirst({
      where: {
        id,
        userId,
      },
    })

    if (!review) throw new NotFoundException('Required review not found ')
    await this.prismaService.review.delete({
      where: { userId, id },
    })
    this.calculateRatingSummary({ id: review.businessId })
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
