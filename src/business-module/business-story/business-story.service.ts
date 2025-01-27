import { Injectable, NotFoundException } from '@nestjs/common'
import { Story } from '@prisma/client'
import AccessControlService from 'src/access-control/access-control.service'
import { deleteFileAsync } from 'src/common/helpers/file.helper'
import { validateStory } from 'src/common/helpers/validator.helper'
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
    ...createStoryDto
  }: CreateStoryDto & UserIdParams): Promise<Story> {
    await this.accessControlService.verifyBussinessOwnerShip({
      id: businessId,
      model: 'BUSINESS',
      userId,
    })
    validateStory({ ...createStoryDto })
    return await this.prismaService.story.create({
      data: {
        businessId,
        ...createStoryDto,
      },
    })
  }

  async updateStory({
    userId,
    id,
    ...updateStoryDto
  }: UpdateStoryDto & UserIdParams): Promise<Story> {
    let oldImageUrl
    const { entity: story } =
      await this.accessControlService.verifyBussinessOwnerShip({
        id,
        model: 'STORY',
        userId,
      })
    if (updateStoryDto.image) oldImageUrl = (story as Story).image
    validateStory({ ...updateStoryDto })
    const updateStory = await this.prismaService.story.update({
      where: { id },
      data: {
        ...updateStoryDto,
      },
    })
    if (oldImageUrl) deleteFileAsync({ filePath: oldImageUrl })

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
    deleteFileAsync({ filePath: (story as Story)?.image || '' })
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
