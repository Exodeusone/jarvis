import { Kysely, sql } from 'kysely';
import { DB } from '../types/db';

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema.createType('user_kind').asEnum(['admin', 'user']).execute();

  await db.schema
    .alterTable('users')
    .addColumn('kind', sql`user_kind`)
    .execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.alterTable('users').dropColumn('kind').execute();
  await db.schema.dropType('user_kind').execute();
}
