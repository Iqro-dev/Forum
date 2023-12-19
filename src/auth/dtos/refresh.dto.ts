import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export abstract class Refresh {
  @IsString()
  @ApiProperty()
  readonly refreshToken: string;
}
