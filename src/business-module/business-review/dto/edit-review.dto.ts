import { PartialType } from '@nestjs/swagger'
import AddReviewDto from './add-review.dto'

export default class EditReviewDto extends PartialType(AddReviewDto) {}
