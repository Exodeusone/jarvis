import { SetMetadata } from '@nestjs/common';

export const Roles = (...kind: string[]) => SetMetadata('kind', kind);
