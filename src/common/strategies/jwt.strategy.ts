import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { JWT_SECRET } from "src/configs/jwt-secret";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => {
                    const token = req?.cookies?.['access_token'];
                    if (!token) {
                        throw new UnauthorizedException('Token non trouvé dans les cookies');
                    }
                    return token;
                }
            ]),
            ignoreExpiration: false,
            secretOrKey: JWT_SECRET
        });
    }

    async validate(payload: { sub: number, email: string }) {
        return { id: payload.sub, email: payload.email };
    }
}