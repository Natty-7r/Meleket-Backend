
import {SetMetadata} from "@nestjs/common"
import { UserType } from "@prisma/client"
import { ROLES_KEY } from "../util/constants"

const Roles =  (...roles:UserType[])=> SetMetadata(ROLES_KEY,roles)

export default Roles
