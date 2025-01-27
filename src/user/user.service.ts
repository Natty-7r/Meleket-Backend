import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import { Profile } from '@prisma/client'
import { CreateAccountDto } from 'src/auth/dto'
import BusinessService from 'src/business-module/business/business.service'
import { deleteFileAsync } from 'src/common/helpers/file.helper'
import { removePassword } from 'src/common/helpers/parser.helper'
import { validateAge } from 'src/common/helpers/validator.helper'
import {
  BaseIdParams,
  BaseRoleIdParams,
  BusinessIdParams,
  StoryIdParams,
  UserIdParams,
} from 'src/common/types/params.type'
import { ApiResponse } from 'src/common/types/responses.type'
import PrismaService from 'src/prisma/prisma.service'
import AddProfileDto from './dto/add-profile.dto'
import UpdateProfileDto from './dto/edit-profile.dto'

@Injectable()
export default class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly businessSevice: BusinessService,
  ) {}

  // helpers

  async checkUserId({ id }: BaseIdParams) {
    const user = await this.prismaService.user.findFirst({
      where: { id },
    })

    if (!user) throw new ForbiddenException('User not found')
    return true
  }

  async checkProfileLevel({ id }: BaseIdParams) {
    const user = await this.prismaService.user.findFirst({
      where: { id },
    })

    if (user.status !== 'CREATED')
      throw new ForbiddenException('Not allowed for unverfied user  ')
    return true
  }

  async createUserAccount({
    firstName,
    lastName,
    email,
    password,
    roleId,
  }: CreateAccountDto & BaseRoleIdParams) {
    const user = await this.prismaService.user.findFirst({ where: { email } })
    if (user) throw new ConflictException('Email is already in use!')

    return this.prismaService.user.create({
      data: {
        firstName,
        lastName,
        email,
        password,
        status: 'CREATED',
        roleId,
      },
    })
  }

  // profile related

  async getUserDetail({ id }: BaseIdParams) {
    const userDetail = await this.prismaService.user.findFirst({
      where: { id },
    })
    return {
      status: 'success',
      message: `user detail fetced  successfully`,
      data: removePassword(userDetail),
    }
  }

  async addProfile({
    userId,
    birthDate,
    ...addProfileDto
  }: AddProfileDto & UserIdParams): Promise<Profile> {
    await this.checkUserId({ id: userId })
    let profile = await this.prismaService.profile.findFirst({
      where: { userId },
    })
    if (profile)
      return this.updateProfile({ userId, ...addProfileDto, birthDate })
    const age = validateAge(birthDate)
    return this.prismaService.profile.create({
      data: {
        userId,
        birthDate,
        age,
        ...addProfileDto,
      },
    })
  }

  async updateProfile({
    userId,
    birthDate,
    ...updateProfileDto
  }: UpdateProfileDto & UserIdParams): Promise<Profile> {
    let oldProfilePicturePath
    await this.checkUserId({ id: userId })

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
    return profile
  }

  // following
  async followBussiness({
    id,
    businessId,
  }: BaseIdParams & BusinessIdParams): Promise<any> {
    return this.businessSevice.addFollower({ id: businessId, userId: id })
  }

  async unFollowBussiness({
    id,
    businessId,
  }: BaseIdParams & BusinessIdParams): Promise<any> {
    return this.businessSevice.removeFollower({ id: businessId, userId: id })
  }

  async getFollowedBussiness({ id }: BaseIdParams): Promise<ApiResponse> {
    return this.businessSevice.getFollowerBusiness({ userId: id })
  }

  async viewStory({
    storyId,
    userId,
  }: StoryIdParams & UserIdParams): Promise<string> {
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

    return `User added as veiw for story successfully`
  }
}
