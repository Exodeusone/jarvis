import { Body, Controller, Get, Param, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginDto,
  ResetPasswordDto,
  ResetPasswordRequestDto,
  ResetPasswordSchema,
} from './dto/auth.dto';
import { ZodValidationPipe } from 'src/helpers/zod-validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('password-reset-request')
  async resetPasswordRequest(
    @Body() resetPasswordRequestDto: ResetPasswordRequestDto,
  ) {
    return this.authService.resetPasswordRequest(resetPasswordRequestDto);
  }

  @Get('password-reset-access-token/:accessToken')
  async resetPasswordAccessToken(@Param('accessToken') accessToken: string) {
    return this.authService.resetPasswordAccessToken(accessToken);
  }

  @Post('password-reset')
  @UsePipes(new ZodValidationPipe(ResetPasswordSchema))
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
