import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { TokensService } from './tokens.service';

import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRATION_TIME'),
        },
      }),
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
  ],
  providers: [TokensService],
  exports: [TokensService],
})
export class TokensModule {}
