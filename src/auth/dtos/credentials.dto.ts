import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';

export abstract class Credentials {
  @IsString()
  @ApiProperty()
  readonly username: string;

  @IsString()
  @ApiProperty()
  readonly email?: string;

  @IsString()
  @ApiProperty()
  readonly password: string;

  @IsDate()
  @Transform(({ value }) => new Date(value as string))
  @ApiProperty()
  readonly dateOfBirth: Date;
}
