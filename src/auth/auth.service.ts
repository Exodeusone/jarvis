import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import {
  LoginDto,
  ResetPasswordRequestDto,
  ResetPasswordDto,
} from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { MailerService } from 'src/mailer/mailer.service';
import { ConfigService } from 'src/config/config.service';
import { generateRandomToken } from 'src/helpers/generate-token';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailerService: MailerService,
    private configService: ConfigService,
    private redisService: RedisService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne({ username });

    if (user && (await bcrypt.compare(pass, user.password))) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }
    const payload = {
      username: user.username,
      sub: user.id,
      kind: user.kind,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async resetPasswordRequest(
    resetPasswordRequestDto: ResetPasswordRequestDto,
  ): Promise<void> {
    const user = await this.usersService.findOne({
      email: resetPasswordRequestDto.email,
    });
    if (!user) {
      return;
    }
    const accessToken = generateRandomToken();
    await this.mailerService.sendMail(
      user.email,
      'Reset your password',
      'reset-password',
      {
        username: user.username,
        link: `${this.configService.get('FRONTEND_URL')}/${accessToken}`,
      },
    );

    await this.redisService
      .getClient()
      .set(accessToken, user.id.toString(), 'EX', 60 * 60 * 6);

    return;
  }

  async resetPasswordAccessToken(accessToken: string): Promise<string> {
    const userId = await this.redisService.getClient().get(accessToken);
    if (!userId) {
      throw new UnauthorizedException('Invalid access token');
    }
    return userId;
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const userId = await this.redisService
      .getClient()
      .get(resetPasswordDto.accessToken);
    if (!userId) {
      throw new UnauthorizedException('Invalid access token');
    }
    const user = await this.usersService.findOne({ id: Number(userId) });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.usersService.updatePassword(user.id, resetPasswordDto.password);
    await this.redisService.getClient().del(resetPasswordDto.accessToken);
    return;
  }
}
