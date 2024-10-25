import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as moment from "moment";
import { ConstantConfigs } from 'src/constants/configs';
import { Errors } from 'src/constants/errors';
import { RegisterDto } from './dto/register.dto';
import { USER_STATUSES } from 'src/constants/statuses/user';
const jwt = require('jsonwebtoken');
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private userServices: UserService,
        private jwtService: JwtService
    ) { }


    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userServices.getUserByEmail(email);
        if (user && user.password) {
            if (bcrypt.compareSync(password, user.password)) {
                return user;
            }
        }
        return null;
    }

    async register(registerDto: RegisterDto): Promise<User> | null {
        let user = await this.userServices.getUserByEmail(registerDto.email);
        if (user) {
            return null;
        }
        const salt = bcrypt.genSaltSync(ConstantConfigs.SALT_ROUND);
        const hash = bcrypt.hashSync(registerDto.password, salt);
        user = new User();
        user.email = registerDto.email;
        user.fullname = registerDto.fullname;
        user.password = hash
        user.status = USER_STATUSES.ACTIVE;
        return await this.userRepository.save(user);
    }

    async login(email: string, password: string) {
        const user = await this.validateUser(email, password);
        if (!user) {
            throw new UnauthorizedException(Errors.WRONG);
        }
        if (user.status != USER_STATUSES.ACTIVE) {
            throw new UnauthorizedException(Errors.INVALID_STATUS);
        }
        await this.userRepository.update(user.id, {
            last_login: moment().format('YYYY-MM-DD HH:mm:ss')
        })
        const payload = { email: user.email, id: user.id };
        return {
            access_token: this.jwtService.sign(payload, {
                expiresIn: `${ConstantConfigs.JWT_EXPIRE_MINS}m`
            }),
            user: user
        }
    }

    async verify(user: User, ip_address: string) {
        const payload = { email: user.email, sub: user.id, fullname: user.fullname, status: user.status, ip_address: ip_address };
        return {
            access_token: this.jwtService.sign(payload, { expiresIn: `${ConstantConfigs.JWT_EXPIRE_MINS}m` }),
            refresh_token: jwt.sign({ email: user.email, ip_address: ip_address }, process.env.JWT_SECRET_REFRESH, { expiresIn: `${ConstantConfigs.JWT_REFRESH_EXPIRE_DAYS}d` })
        }
    }

    genRefreshToken(email: string) {
        return jwt.sign({ email: email }, process.env.JWT_SECRET_REFRESH, { expiresIn: `${ConstantConfigs.JWT_REFRESH_EXPIRE_DAYS}d` })
    }

    refresh(user: User, ip_address: string) {
        const payload = { email: user.email, sub: user.id, fullname: user.fullname, status: user.status, ip_address: ip_address };
        return {
            access_token: this.jwtService.sign(payload, { 
                expiresIn: `${ConstantConfigs.JWT_EXPIRE_MINS}m`
            }),
            // refresh_token: jwt.sign({ email: user.email }, process.env.JWT_SECRET_REFRESH, { expiresIn: '7d' })
        }
    }
    async fetchUserFromRefreshToken(token: string): Promise<User | null> {
        try {
            if (this.jwtService.verify(token, { secret: process.env.JWT_SECRET_REFRESH })) {
                let body = this.jwtService.decode(token);
                let user = await this.userServices.getUserByEmail(body['email']);
                return user
            }

            return null;
        } catch (err) {
            return null;
        }
    }
}
