import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { User } from 'src/user/entities/user.entity';
import { LocalStrategy } from './strageties/local.strategy';
import { UserService } from 'src/user/user.service';
import { JwtStrategy } from './strageties/jwt.strategy';
import { ConstantConfigs } from 'src/constants/configs';
 
require("dotenv").config(); 
@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: `${ConstantConfigs.JWT_EXPIRE_MINS}m` },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [AuthService, LocalStrategy, UserService, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
