import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Story } from '@prisma/client'
import AccessControlService from 'src/access-control/access-control.service'
import { deleteFileAsync } from 'src/common/helpers/file.helper'
import PrismaService from 'src/prisma/prisma.service'
import {
  BaseIdParams,
  BusinessIdParams,
  OptionalUserIdParams,
  StoryIdParams,
  UserIdParams,
} from '../../common/types/params.type'
import CreateStoryDto from './dto/create-story.dto'
import UpdateStoryDto from './dto/update-store.dto'

@Injectable()
export default class BusinessStoryService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly accessControlService: AccessControlService,
  ) {}

  async updateStoryViewCount({ storyId }: StoryIdParams): Promise<Story> {
    const story = await this.verifyBusinessStoryId({ id: storyId })

    return this.prismaService.story.update({
      where: { id: storyId },
      data: {
        viewCount: story.viewCount + 1,
      },
    })
  }

  async verifyBusinessStoryId({ id }: BaseIdParams): Promise<Story> {
    const story = await this.prismaService.story.findFirst({
      where: { id },
    })
    if (!story) throw new NotFoundException('Invalid story ID')
    return story
  }

  async addStory({
    businessId,
    userId,
    images,
    ...createStoryDto
  }: CreateStoryDto & UserIdParams & BusinessIdParams): Promise<Story> {
    await this.accessControlService.verifyBussinessOwnerShip({
      id: businessId,
      model: 'BUSINESS',
      userId,
    })
    if (!createStoryDto.text && (!images || images?.length === 0))
      throw new BadRequestException('text or image is needed')

    return await this.prismaService.story.create({
      data: {
        businessId,
        images: images?.map((image) => image?.path),
        ...createStoryDto,
      },
    })
  }

  async updateStory({
    userId,
    id,
    images,
    ...createStoryDto
  }: UpdateStoryDto & UserIdParams & BaseIdParams): Promise<Story> {
    let oldImageUrls: string[]
    const { entity: story } =
      await this.accessControlService.verifyBussinessOwnerShip({
        id,
        model: 'STORY',
        userId,
      })
    if (images) oldImageUrls = (story as Story).images
    const updateStory = await this.prismaService.story.update({
      where: { id },
      data: {
        images: images
          ? images?.map((image) => image?.path)
          : (story as Story).images,
        ...createStoryDto,
      },
    })
    if (oldImageUrls && oldImageUrls.length > 0)
      oldImageUrls.forEach((imageUrl) =>
        deleteFileAsync({ filePath: imageUrl }),
      )

    return updateStory
  }

  async deleteStory({
    userId,
    id,
  }: BaseIdParams & UserIdParams): Promise<string> {
    const { entity: story } =
      await this.accessControlService.verifyBussinessOwnerShip({
        id,
        model: 'STORY',
        userId,
      })

    await this.prismaService.story.delete({
      where: { id },
    })
    if ((story as Story)?.images?.length > 0)
      (story as Story)?.images?.forEach((imageUrl) =>
        deleteFileAsync({ filePath: imageUrl }),
      )
    return id
  }

  async getStories({ userId }: OptionalUserIdParams): Promise<Story[]> {
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

    return enhancedStories
  }

  async getBusinessStories({
    userId,
    businessId,
  }: BusinessIdParams & OptionalUserIdParams): Promise<Story[]> {
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

    return enhancedStories
  }
}
