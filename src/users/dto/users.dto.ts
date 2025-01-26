import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  PaginationParamsDto,
  paginationParamsSchema,
} from 'src/helpers/pagination';
import { z } from 'zod';

export const createUserSchema = z.object({
  username: z.string().min(3, "Le nom d'utilisateur est requis"),
  email: z.string().email("L'adresse email doit être valide"),
  password: z
    .string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

export class CreateUserDto {
  @ApiProperty({
    example: 'johndoe',
    description: "Nom d'utilisateur unique requis pour l'inscription",
  })
  username: string;

  @ApiProperty({
    example: 'johndoe@example.com',
    description: "Adresse email de l'utilisateur",
    required: true,
  })
  email: string;

  @ApiProperty({
    example: 'yourSecurePassword123',
    description: "Mot de passe fort requis pour l'inscription",
    minLength: 6,
  })
  password: string;
}

export const listUsersSchema = z.object({
  kind: z.enum(['user', 'admin']).optional(),
  username: z.string().optional(),
  email: z.string().optional(),
  id: z.number().optional(),
  createdAt: z.string().optional(),
});

export const combinedUserPaginationSchema = listUsersSchema.merge(
  paginationParamsSchema,
);

export class ListUsersDto extends PaginationParamsDto {
  @ApiPropertyOptional({
    description: 'Kind of the user',
  })
  kind?: 'user' | 'admin';

  @ApiPropertyOptional({
    description: 'Username of the user',
  })
  username?: string;

  @ApiPropertyOptional({
    description: 'Email of the user',
  })
  email?: string;

  @ApiPropertyOptional({
    description: 'Id of the user',
  })
  id?: number;
}
