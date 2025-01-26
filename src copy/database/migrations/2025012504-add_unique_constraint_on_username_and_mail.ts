import { Kysely } from 'kysely';
import { DB } from '../types/db';

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .alterTable('users')
    .addUniqueConstraint('unique_username', ['username'])
    .execute();
  await db.schema
    .alterTable('users')
    .addUniqueConstraint('unique_email', ['email'])
    .execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema
    .alterTable('users')
    .dropConstraint('unique_username')
    .execute();
  await db.schema.alterTable('users').dropConstraint('unique_email').execute();
}
