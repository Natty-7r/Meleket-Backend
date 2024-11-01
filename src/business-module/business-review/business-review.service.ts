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
  }: AddReviewDto & UserIdParams & BaseBusinessIdParams) {
    await this.userService.checkProfileLevel({ id: userId })
    const business = await this.businessService.verifiyBusinessId({
      id: businessId,
    })
    if (business.ownerId === userId)
      throw new ForbiddenException('Owner cannot add review ')
    const review = await this.prismaService.review.findFirst({
      where: {
        businessId,
        userId,
      },
    })

    if (review)
      throw new ConflictException('User can only add one review for a business')
    return this.prismaService.review.create({
      data: { userId, businessId, review: reviewText },
    })
  }

  async updateReview({
    userId,
    id,
    review: reviewText,
  }: EditReviewDto & UserIdParams & BaseIdParams) {
    await this.userService.checkProfileLevel({ id: userId })
    const review = await this.prismaService.review.findFirst({
      where: {
        id,
        userId,
      },
    })

    if (!review) throw new NotFoundException('Required review not found ')
    return this.prismaService.review.update({
      where: {
        id: review.id,
      },
      data: { review: reviewText },
    })
  }

  async deleteReview({ userId, id }: BaseIdParams & UserIdParams) {
    await this.userService.checkProfileLevel({ id: userId })
    const review = await this.prismaService.review.findFirst({
      where: {
        id,
        userId,
      },
    })

    if (!review) throw new NotFoundException('Required review not found ')
    return this.prismaService.review.delete({
      where: { userId, id },
    })
  }

  async getReviews({ businessId }: BaseBusinessIdParams) {
    return this.prismaService.review.findMany({
      where: { businessId },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async getReviewDetail({ id }: BaseIdParams) {
    return this.prismaService.review.findMany({
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
  }
}
