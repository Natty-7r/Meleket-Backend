import { SortType } from '../types/params.type'

export const generateCategorySort = ({
  sortKeys,
  sortType,
}: {
  sortKeys: string[]
  sortType: SortType
}) => {
  const sort: any = []
  /* eslint-disable */
  if (sortKeys.includes('rating')) sort.push({ averageRating: sortType })
  if (sortKeys.includes('review'))
    sort.push({
      reviews: {
        _count: sortType,
      },
    })
  if (sortKeys.includes('follower'))
    sort.push({
      followers: {
        _count: sortType,
      },
    })
  if (sortKeys.includes('story'))
    sort.push({
      stories: {
        _count: sortType,
      },
    })
  if (sortKeys.includes('age'))
    sort.push({
      createdAt: sortType,
    })
  /* eslint-disable */
  return sort
}
