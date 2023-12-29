import { ApiProperty } from '@nestjs/swagger';

export abstract class Token {
  @ApiProperty()
  readonly token: string;

  @ApiProperty()
  readonly expiresIn: number;
}
