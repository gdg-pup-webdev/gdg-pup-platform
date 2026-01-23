**[⬅️ Previous: Frontend Development](./6-FrontendDevelopment.md)** | **[Back to Onboarding](./README.md)** | **[Next: Best Practices ➡️](./99.1-BestPractices.md)**

---

# Development Workflow

This guide outlines the typical workflows for developing and testing new features in this project.

## Daily Development

The following commands are your entry point for daily development tasks.

### 1. Starting the Development Environment

To start the development servers for all applications simultaneously, run the following command from the root of the project:

```bash
pnpm run dev
```

If you only need to work on a specific application, you can start it individually:

```bash
# Start only the backend API
pnpm --filter nexus-api dev

# Start only the frontend web app
pnpm --filter nexus-web dev
```

### 2. Building for Production

To create a production-ready build of one or more applications, use the `build` command:

```bash
# Build all applications
pnpm run build

# Build a specific application
pnpm --filter nexus-api build
```

## Testing Changes

Our contract-first approach provides a tight feedback loop for testing changes.

1.  **Update an API Contract**: Modify a model or route in the `packages/nexus-api-contracts` directory.
2.  **Automatic Reloading**: Turborepo will detect the change and automatically rebuild the necessary packages. The backend and frontend development servers will hot-reload.
3.  **Instant Feedback**: If your changes introduce a mismatch between the frontend and backend, TypeScript errors will appear immediately in your console.
4.  **Test the Endpoint**: Manually test the endpoint using a tool like `curl` or an API client like Postman to verify its behavior.

```bash
curl http://localhost:8080/api/users/your-user-id \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Guide: Adding a New Feature

This section walks you through the end-to-end process of adding a new "Posts" feature.

### Step 1: Create the Database Table

First, define the database schema for the new resource. In Supabase, you can run the following SQL to create a `posts` table:

```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

### Step 2: Define the Model Contract

Next, create the Zod schemas for the `post` resource in the `nexus-api-contracts` package.

```typescript
// packages/nexus-api-contracts/src/models/postSystem/post.ts
import { z } from "zod";

export const postSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  title: z.string(),
  content: z.string(),
  published: z.boolean(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const postInsertSchema = postSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const postUpdateSchema = postInsertSchema.partial();
```

### Step 3: Define the Route Contract

Now, define the API endpoints for the `posts` resource. This example creates endpoints for listing posts and retrieving a single post.

```typescript
// packages/nexus-api-contracts/src/routes/post-system/posts.ts
import { z } from "zod";
import { postSchema } from "../../models/postSystem/post";

export const GET = {
  response: {
    200: z.object({
      status: z.string(),
      message: z.string(),
      data: z.array(postSchema),
    }),
  },
};

export const _postId = {
  GET: {
    params: z.object({ postId: z.string().uuid() }),
    response: {
      200: z.object({
        status: z.string(),
        message: z.string(),
        data: postSchema,
      }),
    },
  },
};
```

### Step 4: Implement the Backend

With the contracts in place, implement the backend logic.

**Repository (`post.repository.ts`)**

```typescript
// apps/nexus-api/src/modules/postSystem/post.repository.ts
import { supabase } from "@/lib/supabase.js";
import { DatabaseError } from "@/classes/ServerError.js";

export class PostRepository {
  private table = "posts";

  async findById(postId: string) {
    const { data, error } = await supabase
      .from(this.table)
      .select("*")
      .eq("id", postId)
      .single();

    if (error) throw new DatabaseError(error.message);
    return data;
  }
}
export const postRepository = new PostRepository();
```

**Controller (`post.controller.ts`)**

```typescript
// apps/nexus-api/src/modules/postSystem/post.controller.ts
import { createExpressController } from "@packages/typed-rest";
import { contract } from "@packages/nexus-api-contracts";
import { postRepository } from "./post.repository";

export class PostController {
  getPostById = createExpressController(
    contract.api.post_system.posts._postId.GET,
    async ({ input, output }) => {
      const post = await postRepository.findById(input.params.postId);
      return output(200, {
        status: "success",
        message: "Post fetched successfully",
        data: post,
      });
    }
  );
}
```

### Step 5: Consume the API in the Frontend

Finally, use the new endpoint in the `nexus-web` application.

```typescript
// apps/nexus-web/src/app/posts/[postId]/page.tsx
"use client";

import { apiCall } from "@/lib/api";
import { contract } from "@packages/nexus-api-contracts";
import { useEffect, useState } from "react";

type Post = typeof contract.api.post_system.posts._postId.GET.response[200]["data"];

export default function PostPage({ params }: { params: { postId: string } }) {
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      const result = await apiCall(contract.api.post_system.posts._postId.GET, {
        params: { postId: params.postId },
      });

      if (result.status === 200) {
        setPost(result.body.data);
      }
    };
    fetchPost();
  }, [params.postId]);

  if (!post) return <div>Loading...</div>;

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}
```