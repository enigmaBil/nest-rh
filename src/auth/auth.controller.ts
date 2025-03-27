import { Controller, Get, Post, Request, UseGuards, HttpCode, HttpStatus, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportJwtGuard } from 'src/common/guards/passport-jwt/passport-jwt.guard';
import { LoginDTO } from './dto/login.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginDTO: LoginDTO) {
    return this.authService.authenticate(loginDTO);
  }

  @HttpCode(HttpStatus.OK)
  @Get('me')
  
  userInfo(@Request() request) {
    return request.user;
  }
}