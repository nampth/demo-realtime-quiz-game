import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { TABLES } from 'src/constants/tables';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    async getUserByEmail(email: string): Promise<User | undefined> {
        let user = await this.userRepository
            .createQueryBuilder(TABLES.USER)
            .where(`${TABLES.USER}.email = "${email}"`)
            .getOne();
        if (user) {
            return user;
        }
        return null;

    }
}
