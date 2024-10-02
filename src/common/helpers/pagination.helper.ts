import { CreatePaginatioParams } from '../types/params.type'
import { PaginationResoponse } from '../types/responses.type'

export const createPagination = ({
  page,
  items,
  totalCount,
}: CreatePaginatioParams): PaginationResoponse => {
  const totalPages =
    Math.ceil(totalCount / items) === 0 ? 1 : Math.ceil(totalCount / items)
  return {
    totalPages,
    firstPage: 1,
    lastPage: totalPages,
    currentPage: page,
    previousPage: page > 1 ? page - 1 : null,
    nextPage: page < totalPages ? page + 1 : null,
    itemsPerPage: items,
    isLastPage: page === totalPages,
  }
}

export default createPagination
