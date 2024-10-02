import { SetMetadata } from '@nestjs/common'
import { IS_OPTIONAL_PUBLIC_KEY } from '../constants'
const OptionalPublic = () => SetMetadata(IS_OPTIONAL_PUBLIC_KEY, true)

export default OptionalPublic
