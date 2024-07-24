import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import {  Reflector } from '@nestjs/core';
import { UserType } from '@prisma/client';
import { ROLES_KEY } from '../util/constants';
import { RequestWithUser } from '../util/types';



// role guard based on user type 
@Injectable()
export default  class RolesGuard implements CanActivate {
    constructor(private readonly reflector:Reflector){}
  canActivate(
    context: ExecutionContext,
  ) :boolean {
    const request:RequestWithUser = context.switchToHttp().getRequest();
    const requiredRoles =  this.reflector.getAllAndMerge<UserType[]>(ROLES_KEY,[context.getClass,context.getHandler])
    console.log(requiredRoles)
    if(!requiredRoles || requiredRoles.length==0) return true

    const user =  request.user

    return requiredRoles.some((role) => user.userType?.includes(role));

  }
};
