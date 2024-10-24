import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import { getTokenFromCookie, isTokenAboutToExpire } from 'src/common/helpers/jwt.helpers';
import { Errors } from 'src/constants/errors';

require("dotenv").config();
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

    constructor(
        private readonly reflector: Reflector,
        private readonly jwtService: JwtService
    ) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.get<boolean>(
            'isPublic',
            context.getHandler()
        );

        if (isPublic) {
            return true;
        }

        let request = context.switchToHttp().getRequest<RequestWithUser>();

        const cookie_str = request.headers.cookie; // Assuming cookie name is 'jwt'

        const access_token = getTokenFromCookie(cookie_str, 'access_token');
        const refresh_token = getTokenFromCookie(cookie_str, 'refresh_token');
        if (access_token) {
            try {
                if (isTokenAboutToExpire(access_token) && this.jwtService.verify(refresh_token, { secret: process.env.JWT_SECRET_REFRESH })) {
                    const user = this.jwtService.decode(access_token);
                    request.user = user;
                    return true;

                } else if (access_token && this.jwtService.verify(access_token, { secret: process.env.JWT_SECRET })) {
                    const user = this.jwtService.decode(access_token);
                    if ((user && user.role_name) || (user && !user.role_name && request.route.path == '/auth')) {
                        request.user = user;
                        return true;
                    } else {
                        throw new UnauthorizedException(Errors.EXPIRED_INVALID);
                    }
                }
            } catch (err) {
                throw new UnauthorizedException(Errors.EXPIRED_INVALID);
            }
            throw new UnauthorizedException(Errors.EXPIRED_INVALID);
        }
        throw new UnauthorizedException(Errors.NOTFOUND);
    }

}
