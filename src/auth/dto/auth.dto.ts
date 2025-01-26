import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export class LoginDto {
  @ApiProperty({
    example: 'johndoe',
    description: "Nom d'utilisateur de l'utilisateur",
  })
  username: string;

  @ApiProperty({
    example: 'yourSecurePassword123',
    description: "Mot de passe de l'utilisateur",
  })
  password: string;
}

export class ResetPasswordRequestDto {
  @ApiProperty({
    example: 'johndoe@example.com',
    description: "Email de l'utilisateur",
  })
  email: string;
}

export const ResetPasswordSchema = z.object({
  password: z
    .string()
    .min(6, 'Le nouveau mot de passe doit contenir au moins 6 caractères'),
  accessToken: z.string().min(1, "Le token d'accès est requis"),
});

export class ResetPasswordDto {
  @ApiProperty({
    example: '123456',
    description: "Nouveau mot de passe de l'utilisateur",
  })
  password: string;

  @ApiProperty({
    example: 'ekj3456...',
    description: "Token d'accès de l'utilisateur",
  })
  accessToken: string;
}
