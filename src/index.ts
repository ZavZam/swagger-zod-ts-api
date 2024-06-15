import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { z } from 'zod';
import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';

import { CreateUserSchema, UserSchema } from './schemas/user';
import { CommentSchema, CreateCommentSchema, CreatePostSchema, Post, PostSchema, Comment, CreateComment, CreatePost } from './schemas/post';

// Initialize Express app
const app = express();
app.use(express.json());

// Create OpenAPI registry
const registry = new OpenAPIRegistry();

// Register schemas and paths
registry.registerPath({
  method: 'get',
  path: '/users/{id}',
  description: 'Get a user by ID',
  summary: 'Get User',
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: {
      description: 'User found',
      content: {
        'application/json': {
          schema: UserSchema,
        },
      },
    },
  },
  tags: ['Users'],
});

registry.registerPath({
  method: 'post',
  path: '/users',
  description: 'Create a new user',
  summary: 'Create User',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateUserSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'User created',
      content: {
        'application/json': {
          schema: UserSchema,
        },
      },
    },
  },
  tags: ['Users'],
});

registry.registerPath({
  method: 'post',
  path: '/posts',
  description: 'Create a new post',
  summary: 'Create post',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreatePostSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Created post',
      content: {
        'application/json': {
          schema: PostSchema,
        },
      },
    },
  },
  tags: ['Posts'],
});

registry.registerPath({
  method: 'post',
  path: '/comments',
  description: 'Create a new comment',
  summary: 'Create comment',
  request: {
    body: {
    content: {
      'application/json': {
        schema: CreateCommentSchema,
      },
    },
    },
  },
  responses: {
    200: {
      description: 'Created post',
      content: {
        'application/json': {
          schema: CommentSchema,
       },
      },
    },
  },
  tags: ['Comments'],
});

// Generate OpenAPI specification
const generator = new OpenApiGeneratorV3(registry.definitions);
const openApiSpec = generator.generateDocument({
  openapi: '3.0.0',
  info: {
    title: 'User API',
    version: '1.0.0',
  },
});

// Setup Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));

// Example endpoints
app.get('/users/:id', (req, res) => {
  res.json({ id: req.params.id, name: 'John Doe', email: 'john.doe@example.com' });
});

app.post('/users', (req, res) => {
  const result = CreateUserSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json(result.error);
  }
  res.status(200).json({ ...result.data, id: 'a779e093-1fe2-43e7-9fa7-878ed00852ff' });
});

app.post('/posts', (req, res) => {
  const result = CreatePostSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json(result.error);
  }
  const post: CreatePost = result.data;
  res.status(200).json({ ...post, id: '2a6546c5-5481-4dd0-8975-d3ab888506b7' });
});

app.post('/comments', (req, res) => {
  const result = CreateCommentSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json(result.error);
  }
  const comment: CreateComment = result.data;
  res.status(200).json({ ...comment, id: 'fd41790f-cfb9-40ad-9dba-51380f90706a' });
});

// Start the server
const port = 5001;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`Swagger UI available at http://localhost:${port}/api-docs`);
});
