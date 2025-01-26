import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { ConfigModule } from '../config/config.module';

@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
  imports: [ConfigModule],
})
export class DatabaseModule {}
