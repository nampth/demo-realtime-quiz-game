import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    async getUserByEmail(email: string): Promise<User | undefined> {
        let user = await this.userRepository
            .createQueryBuilder('users')
            .where(`users.email = "${email}"`)
            .getOne();
        if (user) {
            return user;
        }
        return null;

    }
}
