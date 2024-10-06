import { SetMetadata } from '@nestjs/common'
import { IS_PUBLIC_KEY } from '../constants'
const Public = () => SetMetadata(IS_PUBLIC_KEY, true)

export default Public
