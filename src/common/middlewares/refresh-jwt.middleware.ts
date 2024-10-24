import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { getTokenFromCookie, isTokenAboutToExpire } from '../helpers/jwt.helpers';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import RequestWithUser from 'src/auth/interfaces/requestWithUser.interface';

require("dotenv").config();
@Injectable()
export class RefreshJwtMiddleware implements NestMiddleware {
    constructor(
        private readonly jwtService: JwtService,
        private readonly authService: AuthService
    ) {

    }

    use(req: RequestWithUser, res: Response, next: NextFunction) {
        // Perform middleware logic        
        let access_token = getTokenFromCookie(req.headers.cookie, 'access_token');
        let refresh_token = getTokenFromCookie(req.headers.cookie, 'refresh_token');
        try {
            if (isTokenAboutToExpire(access_token) && this.jwtService.verify(access_token, { secret: process.env.JWT_SECRET })
                && this.jwtService.verify(refresh_token, { secret: process.env.JWT_SECRET_REFRESH })) {
                const ip_address = req?.headers['x-forwarded-for'] || req?.connection?.remoteAddress;
                let jwt_token = this.authService.refresh(req.user, ip_address ? ip_address.toString() : 'unknown');                
                res.cookie('access_token', jwt_token.access_token, {
                    httpOnly: true,
                    // Other cookie options like expiration, domain, etc., can be set here
                });
            }
            next();
        } catch (err) {
            next();
        }
        next(); // Call next to pass control to the next middleware or route handler
    }
}