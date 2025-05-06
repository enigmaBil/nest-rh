import { Controller, Get, Post, Request, UseGuards, HttpCode, HttpStatus, Body, Res, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportJwtGuard } from 'src/common/guards/passport-jwt/passport-jwt.guard';
import { LoginDTO } from './dto/login.dto';
import { Response } from 'express';

@Controller('api/v1/auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginDTO: LoginDTO, @Res({ passthrough: true }) res: Response) {
    return this.authService.authenticate(loginDTO, res);
  }

  @HttpCode(HttpStatus.OK)
  @Get('me')
  @UseGuards(PassportJwtGuard)
  userInfo(@Request() request) {
    return request.user;
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  @Post('refreshToken')
  refreshTokens(@Request() req, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.['refresh_token'];
    if (!refreshToken) {
      throw new UnauthorizedException('Token de rafraîchissement manquant.');
    }
    return this.authService.refreshTokens(refreshToken, res);
  }
}