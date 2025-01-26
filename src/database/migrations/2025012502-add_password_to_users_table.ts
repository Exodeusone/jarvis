import { Kysely } from 'kysely';
import { DB } from '../types/db';

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .alterTable('users')
    .addColumn('password', 'varchar', (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.alterTable('users').dropColumn('password').execute();
}
