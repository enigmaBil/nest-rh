import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from './dto/login.dto';
import { Response } from 'express';
import { log } from 'console';

type AuthInput = { email: string; password: string };
type SignInData = { id: number; email: string };
type AuthResponse = { accessToken: string; refreshToken: string; user: SignInData };

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async authenticate(loginDTO: LoginDTO, res: Response): Promise<AuthResponse> {
    const user = await this.usersService.findUserByEmail(loginDTO.email);
    console.log(user);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
  
    const passwordMatched = await bcrypt.compare(loginDTO.password, user.password);
    if (!passwordMatched) {
      throw new UnauthorizedException('Password does not match');
    }

    // Générer les tokens
    const payload = { email: user.email, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' }); // Token court
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' }); // Token long

    // Définir les cookies HTTP-only
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
    });


    const { password, ...userWithoutPassword } = user; // Supprime le password proprement
  
    return {
      accessToken,
      refreshToken,
      user: userWithoutPassword,
    };
  }

  logout(res: Response) {
    res.clearCookie('access_token'); 
    res.clearCookie('refresh_token'); 
    return { message: 'Déconnexion réussie.' };
  }

  async refreshTokens(refreshToken: string, res: Response): Promise<AuthResponse> {
    try {
      // Valider le refresh_token
      const payload = await this.jwtService.verifyAsync(refreshToken);

      const user = await this.usersService.findUserByEmail(payload.email);

      if (!user) {
        throw new UnauthorizedException('Utilisateur non trouvé.');
      }

      // Générer de nouveaux tokens
      const newAccessToken = this.jwtService.sign({ email: user.email, sub: user.id }, { expiresIn: '15m' });
      const newRefreshToken = this.jwtService.sign({ email: user.email, sub: user.id }, { expiresIn: '7d' });

      // Mettre à jour les cookies
      res.cookie('access_token', newAccessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      res.cookie('refresh_token', newRefreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user: { id: user.id, email: user.email },
      };
    } catch (error) {
      throw new UnauthorizedException('Token de rafraîchissement invalide.');
    }
  }
}