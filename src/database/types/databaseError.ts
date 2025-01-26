export enum DatabaseErrorCodes {
  UniqueViolation = '23505',
  ForeignKeyViolation = '23503',
  NotNullViolation = '23502',
  CheckViolation = '23514',
}

interface IDatabaseError extends Error {
  code: string;
}

export const isDatabaseError = (error: any): error is IDatabaseError => {
  return (
    error instanceof Error &&
    'code' in error &&
    typeof error.code === 'string' &&
    Object.values(DatabaseErrorCodes).includes(error.code as DatabaseErrorCodes)
  );
};
