import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import PrismaService from 'src/prisma/prisma.service'
import AddReviewDto from './dto/add-review.dto'
import { BaseIdParams, UserIdParams } from 'src/common/util/types/params.type'
import BusinessService from 'src/business/business.service'
import { ApiResponse } from 'src/common/util/types/responses.type'

@Injectable()
export default class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly businessSevice: BusinessService,
  ) {}

  // Review related

  async addReview({
    userId,
    businessId,
    review: reviewText,
  }: AddReviewDto & UserIdParams): Promise<ApiResponse> {
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
    businessId,
    review: reviewText,
  }: AddReviewDto & UserIdParams): Promise<ApiResponse> {
    await this.businessSevice.verifiyBusinessId({ id: businessId })

    let review = await this.prismaService.review.findFirst({
      where: {
        businessId,
        userId,
      },
    })

    if (!review) throw new NotFoundException('Required review not found ')
    review = await this.prismaService.review.create({
      data: { userId, businessId, review: reviewText },
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
}
