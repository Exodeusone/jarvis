import { Kysely } from 'kysely';
import { DB } from '../types/db';

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema.alterTable('users').dropColumn('id').execute();
  await db.schema
    .alterTable('users')
    .addColumn('id', 'serial', (col) => col.primaryKey().notNull())
    .execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.alterTable('users').dropColumn('id').execute();

  await db.schema
    .alterTable('users')
    .addColumn('id', 'uuid', (col) => col.primaryKey().notNull())
    .execute();
}
