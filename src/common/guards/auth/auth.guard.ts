import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService
  ){}

  async canActivate(
    context: ExecutionContext,
  ) {
    const request = context.switchToHttp().getRequest();
    const authaurization = request.headers.authorization; //get the BEARER token
    const token = authaurization?.split(' ')[1]; //get the token

    if(!token) throw new UnauthorizedException();

    try{
      const tokenPayload = await this.jwtService.verifyAsync(token);
      request.user = {id: tokenPayload.sub, email: tokenPayload.email};
      return true;
    }
    catch(error){
      throw new UnauthorizedException();
    }
  }
}
