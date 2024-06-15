import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

// Extend Zod with OpenAPI capabilities
extendZodWithOpenApi(z);

export const UserSchema = z.object({
  id: z.string().uuid().openapi({ description: 'Unique identifier for the user' }),
  name: z.string().min(1).openapi({ description: 'Name of the user' }),
  email: z.string().email().openapi({ description: 'Email address of the user' }),
}).openapi({ description: 'User Schema' });
export type User = z.infer<typeof UserSchema>;
  
export const CreateUserSchema = z.object({
  name: z.string().openapi({ description: 'Name of the user' }),
  email: z.string().email().openapi({ description: 'Email address of the user' }),
}).openapi({ description: 'Create User Schema' });
export type CreateUser = z.infer<typeof UserSchema>;
