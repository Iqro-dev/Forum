import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export abstract class Credentials {
  @IsString()
  @ApiProperty()
  readonly username: string;

  @IsString()
  @ApiProperty()
  readonly password: string;
}
