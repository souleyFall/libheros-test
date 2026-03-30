import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { User } from '../user/users.model'; // ton model Sequelize

@Module({
  imports: [
    SequelizeModule.forFeature([User]),

    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret-change-me',
      signOptions: { expiresIn: '24h' },
    }),

    PassportModule,
  ],

  controllers: [AuthController],

  providers: [
    AuthService,
    JwtStrategy, 
  ],

  exports: [
    JwtStrategy,
    PassportModule,
  ],
})
export class AuthModule {}