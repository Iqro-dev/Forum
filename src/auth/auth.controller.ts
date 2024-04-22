import {
  Body,
  ConflictException,
  Controller,
  Get,
  Post,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { CurrentUser } from './decorators';
import { JwtAuthGuard, LocalAuthGuard } from './guards';
import { Credentials, Refresh } from './dtos';

import { UsersService } from 'src/users/users.service';
import { TokensService } from 'src/tokens/tokens.service';
import { User } from 'src/users/interfaces/user.interface';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokensService: TokensService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({
    summary: 'Logging into an existing account.',
  })
  @ApiBody({ type: Credentials })
  @ApiOkResponse({
    description: 'The user has been successfully logged in.',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid Credentials',
  })
  login(@CurrentUser() user: User) {
    return this.authService.login(user);
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Logging out of the current account.',
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The user has been successfully logged out.',
  })
  @ApiUnauthorizedResponse({
    description: 'Cannot log out of the current account.',
  })
  async logout(@CurrentUser() { id }: User) {
    await this.authService.logout(id ?? '');

    return true;
  }

  @Post('register')
  @ApiOperation({
    summary: 'Registering a new user.',
  })
  @ApiBody({ type: Credentials })
  @ApiOkResponse({
    description: 'The user has been successfully registered.',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
  })
  @ApiConflictResponse({
    description: 'Username has already been taken.',
  })
  async register(@Body(new ValidationPipe()) newUser: CreateUserDto) {
    const foundUser = await this.usersService.getUserByUsername(
      newUser.username,
    );

    if (foundUser)
      throw new ConflictException('Username has already been taken.');

    const user = await this.usersService.createUser(newUser);

    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({
    summary: 'Getting current user profile.',
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The user has been successfully retrieved.',
  })
  @ApiUnauthorizedResponse({
    description: 'Cannot get the user profile.',
  })
  profile(@CurrentUser() { id }: User) {
    return this.usersService.getUserById(id!);
  }

  @Post('refresh')
  @ApiOperation({
    summary: 'Refreshing the access token.',
  })
  @ApiOkResponse({
    description: 'The token has been successfully refreshed.',
  })
  @ApiUnauthorizedResponse({
    description: 'The given refresh token is invalid or expired.',
  })
  @ApiBody({ type: Refresh })
  async refresh(@Body(new ValidationPipe()) { refreshToken }: Refresh) {
    const accessToken =
      await this.tokensService.generateAccessTokenFromRefreshToken(
        refreshToken,
      );

    if (!accessToken)
      throw new UnauthorizedException(
        'The given refresh token is invalid or expired.',
      );

    return {
      accessToken: await this.tokensService.formatToken(accessToken),
    };
  }
}
