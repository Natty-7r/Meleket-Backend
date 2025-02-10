import { Injectable } from '@nestjs/common'
import {
  AddressSearchResult,
  BusinessSearchResult,
  CategorySearchResult,
  ServiceSearchResult,
} from 'src/common/types/base.type'
import PrismaService from 'src/prisma/prisma.service'

@Injectable()
export default class SearchServiceService {
  constructor(private readonly prismaService: PrismaService) {}

  async search(query: string) {
    return {
      business: await this.searchBusiness(query),
      services: await this.searchService(query),
      addresses: await this.searchAddress(query),
      categories: await this.searchCategory(query),
    }
  }

  async searchBusiness(query: string) {
    const businesses: BusinessSearchResult[] =
      await this.prismaService.business.findMany({
        where: {
          OR: [
            {
              name: { contains: query, mode: 'insensitive' },
            },
            {
              description: { contains: query, mode: 'insensitive' },
            },
          ],
        },
        select: {
          id: true,
          name: true,
          description: true,
        },
        take: 10,
      })
    return businesses.map((business) => {
      business.tag = 'BUSINESS'
      return business
    })
  }

  async searchService(query: string) {
    const services: ServiceSearchResult[] =
      await this.prismaService.bussinessService.findMany({
        where: {
          OR: [
            {
              name: { contains: query, mode: 'insensitive' },
            },
            {
              description: { contains: query, mode: 'insensitive' },
            },
            {
              specifications: {
                path: [],
                array_contains: query,
              },
            },
          ],
        },
        select: {
          id: true,
          name: true,
          description: true,
          specifications: true,
          businessId: true,
          business: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
        take: 10,
      })

    return services.map((service) => {
      service.tag = 'SERVICE'
      return service
    })
  }

  async searchAddress(query: string) {
    const addresses: AddressSearchResult[] =
      await this.prismaService.businessAddress.findMany({
        where: {
          OR: [
            {
              country: { contains: query, mode: 'insensitive' },
            },
            {
              country: { contains: query, mode: 'insensitive' },
            },
            {
              specificLocation: { contains: query, mode: 'insensitive' },
            },
            {
              state: { contains: query, mode: 'insensitive' },
            },
            {
              streetAddress: { contains: query, mode: 'insensitive' },
            },
          ],
        },
        select: {
          city: true,
          id: true,
          country: true,
          state: true,
          specificLocation: true,
          streetAddress: true,
          businessId: true,
          business: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
        take: 10,
      })
    return addresses.map((address) => {
      address.tag = 'ADDRESS'
      return address
    })
  }

  async searchCategory(query: string) {
    const categoies: CategorySearchResult[] =
      await this.prismaService.category.findMany({
        where: {
          name: { contains: query, mode: 'insensitive' },
        },
        select: {
          name: true,
          id: true,
        },
      })
    return categoies.map((category) => {
      category.tag = 'CATEGORY'
      return category
    })
  }
}
