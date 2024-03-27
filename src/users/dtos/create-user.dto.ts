import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @MinLength(5)
  readonly username: string;

  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  readonly password: string;

  @ApiProperty()
  @Transform(({ value }) => new Date(value + ''))
  readonly dateOfBirth: Date;
}
