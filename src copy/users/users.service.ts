import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { User, validUserKeys } from './interfaces/users.interface';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, ListUsersDto } from './dto/users.dto';
import {
  DatabaseErrorCodes,
  isDatabaseError,
} from 'src/database/types/databaseError';
import { MailerService } from 'src/mailer/mailer.service';
import { applyPagination, PaginationParamsDto } from 'src/helpers/pagination';

@Injectable()
export class UsersService {
  constructor(
    private readonly db: DatabaseService,
    private readonly mailerService: MailerService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async createUser(createUserDto: CreateUserDto): Promise<any> {
    try {
      const user = await this.db
        .getDb()
        .insertInto('users')
        .values({
          username: createUserDto.username,
          email: createUserDto.email,
          password: await this.hashPassword(createUserDto.password),
          kind: 'user',
        })
        .returningAll()
        .executeTakeFirst();

      await this.mailerService.sendMail(
        user.email,
        'Welcome to Jarvis',
        'welcome-user',
        { username: user.username },
      );

      return user;
    } catch (error) {
      if (!isDatabaseError(error)) {
        throw error;
      }
      if (error.code === DatabaseErrorCodes.UniqueViolation) {
        throw new ConflictException('User already exists');
      }
      throw error;
    }
  }

  async findOne(criteria: Partial<User>): Promise<User | null> {
    let query = this.db.getDb().selectFrom('users').selectAll();

    Object.entries(criteria).forEach(([key, value]) => {
      if (key in validUserKeys) {
        query = query.where(key as keyof User, '=', value);
      }
    });

    const result = await query.executeTakeFirst();

    if (!result) {
      throw new NotFoundException(`User not found with provided criteria`);
    }

    return result;
  }

  async findAll(
    filters: ListUsersDto,
    pagination?: PaginationParamsDto,
  ): Promise<{ total: number; users: User[] }> {
    let baseQuery = this.db.getDb().selectFrom('users').selectAll();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        baseQuery = baseQuery.where(key as keyof User, '=', value);
      }
    });

    const totalQuery = baseQuery
      .clearSelect()
      .select((eb) => eb.fn.countAll<number>().as('total'));

    const usersQuery = applyPagination(baseQuery, pagination);

    const [totalResult, users] = await Promise.all([
      totalQuery.executeTakeFirst(),
      usersQuery.execute(),
    ]);

    return {
      total: totalResult ? Number(totalResult.total) : 0,
      users,
    };
  }

  async updatePassword(userId: number, password: string): Promise<void> {
    const user = await this.findOne({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (await bcrypt.compare(password, user.password)) {
      throw new ConflictException('Password is the same as the old one');
    }
    const hashedPassword = await this.hashPassword(password);
    await this.db
      .getDb()
      .updateTable('users')
      .set({ password: hashedPassword })
      .where('id', '=', userId)
      .execute();
  }
}
