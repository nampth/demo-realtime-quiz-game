import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserService } from '../user.service';
import { AuthService } from 'src/auth/auth.service';
import { RegisterDto } from 'src/auth/dto/register.dto';

@Injectable()
export class UserSeeder {
    constructor(
        private readonly authService: AuthService,
    ) { }

    async seed() {

        let users = [
            { email: "userA@gmail.com", fullname: "User A", password: '123456' },
            { email: "userB@gmail.com", fullname: "User B", password: '123456' },
            { email: "userC@gmail.com", fullname: "User C", password: '123456' },
            { email: "userD@gmail.com", fullname: "User D", password: '123456' },
        ]
        users.forEach(async (user) => {
            let dto = new RegisterDto();
            dto.email = user.email;
            dto.password = user.password;
            dto.fullname = user.fullname;
            await this.authService.register(dto);
        })


    }
}