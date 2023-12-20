import { ConfigModule } from '@nestjs/config';
import { TestingModule, Test } from '@nestjs/testing';

import { JwtStrategy } from './jwt-strategy';
import { Payload } from 'src/tokens/dtos';
import { createMock } from '@golevelup/ts-jest';
import { PassportModule } from '@nestjs/passport';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ envFilePath: '.env' }), PassportModule],
      providers: [JwtStrategy],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });

  it('should return user id and username', () => {
    const payload = createMock<Payload>();

    expect(jwtStrategy.validate(payload)).toEqual({
      id: payload.sub,
      username: payload.username,
    });
  });
});
