// src/database/database.service.ts
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { DB } from './types/db';
import { ConfigService } from '../config/config.service';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private db: Kysely<DB>;

  constructor(private configService: ConfigService) {
    const pool = new Pool({
      database: this.configService.get('DB_NAME'),
      host: this.configService.get('DB_HOST'),
      user: this.configService.get('DB_USER'),
      password: this.configService.get('DB_PASSWORD'),
      port: parseInt(this.configService.get('DB_PORT') || '5432'),
      max: 10,
    });
    this.db = new Kysely<DB>({
      dialect: new PostgresDialect({
        pool: pool,
      }),
    });
  }

  async onModuleDestroy() {
    await this.db.destroy();
  }

  getDb() {
    return this.db;
  }
}
