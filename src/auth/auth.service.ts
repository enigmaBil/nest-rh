import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from './dto/login.dto';

type AuthInput = { email: string; password: string };
type SignInData = { id: number; email: string };
type AuthResponse = { accessToken: string; user: SignInData };

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async authenticate(loginDTO: LoginDTO): Promise<AuthResponse> {
    const user = await this.usersService.findUserByEmail(loginDTO);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
  
    const passwordMatched = await bcrypt.compare(loginDTO.password, user.password);
    if (!passwordMatched) {
      throw new UnauthorizedException('Password does not match');
    }
  
    const payload = { email: user.email, sub: user.id };
    const { password, ...userWithoutPassword } = user; // Supprime le password proprement
  
    return {
      accessToken: this.jwtService.sign(payload),
      user: userWithoutPassword,
    };
  }
  

  async signIn(user: SignInData): Promise<AuthResponse> {
    const payload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }
}