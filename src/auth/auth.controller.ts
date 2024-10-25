import { BadRequestException, Body, Controller, Delete, Get, InternalServerErrorException, Logger, Post, Put, Query, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto'; 
import { Response } from 'express'; 
import { JwtService } from '@nestjs/jwt'; 
import { API_STATUSES } from 'src/constants/statuses/api'; 

const logger = new Logger('Authentication');

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private jwtService: JwtService,
        private userService: UserService,
    ) { }

    @Post('')
    @ApiOperation({ summary: 'User login' })
    async login(@Req() req: any, @Body() loginDto: LoginDto, @Res() res: Response) {
        let data = await this.authService.login(loginDto.email, loginDto.password);
        // return res.json(jwtToken); 
        let use_https = process.env.USE_HTTPS && process.env.USE_HTTPS == 'true' ? true : false;
        res.cookie('access_token', data.access_token, use_https ? {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        } : {});
        if (data && data.user) {
            return res.json({ status: API_STATUSES.SUCCESS })
        } else {
            return res.json({ status: API_STATUSES.ERROR })
        }
    }

    @Delete('')
    @ApiOperation({ summary: 'User logout' })
    async logout(@Req() req: any, @Res() res: Response) {
        let use_https = process.env.USE_HTTPS && process.env.USE_HTTPS == 'true' ? true : false;
        // Set the JWT token in an HTTP-only cookie
        res.cookie('access_token', null, use_https ? {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            expires: new Date(Date.now() + 1000),
            // Other cookie options like expiration, domain, etc., can be set here
        } : {});
        res.cookie('refresh_token', null, use_https ? {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            expires: new Date(Date.now() + 1000),
            // Other cookie options like expiration, domain, etc., can be set here
        } : {});
        // return res.json({ token }); 
        return res.json({ status: API_STATUSES.SUCCESS })

    }

}
