import { Kysely } from 'kysely';
import { DB } from '../types/db';

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema.alterTable('users').dropColumn('name').execute();
  await db.schema
    .alterTable('users')
    .addColumn('username', 'varchar(255)', (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.alterTable('users').dropColumn('username').execute();

  await db.schema
    .alterTable('users')
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .execute();
}
