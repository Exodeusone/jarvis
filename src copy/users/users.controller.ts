import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './interfaces/users.interface';
import {
  CreateUserDto,
  createUserSchema,
  ListUsersDto,
  combinedUserPaginationSchema,
} from './dto/users.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';
import { ZodValidationPipe } from 'src/helpers/zod-validation.pipe';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/auth/kind.decorator';
import { RolesGuard } from 'src/auth/kind.guard';
import { Page } from 'src/helpers/pagination';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UsePipes(new ZodValidationPipe(combinedUserPaginationSchema))
  async getUsers(
    @Query()
    { username, email, kind, page = 1, limit = 10 }: ListUsersDto,
  ): Promise<Page<User>> {
    const filters = {
      username,
      email,
      kind,
    };
    const { total, users } = await this.usersService.findAll(filters, {
      page,
      limit,
    });
    return {
      data: users,
      total,
      page: page,
      limit: limit,
      nbHits: users.length,
    };
  }

  @Get(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  async getUser(@Param('id') id: number): Promise<User> {
    return this.usersService.findOne({ id });
  }

  @Get('me')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: Request): Promise<User> {
    const res = await this.usersService.findOne({
      id: Number(req.user.userId),
    });
    if (!res) {
      throw new NotFoundException('User not found');
    }
    return res;
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createUserSchema))
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }
}
