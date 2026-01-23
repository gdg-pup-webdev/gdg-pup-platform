 


## Developer Workflows

### 🚀 Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/your-org/gdg-pup-platform.git
cd gdg-pup-platform

# 2. Install dependencies for all projects
run install -all

# 3. Set up environment variables
# Copy .env.example to .env in each app and fill in values

# 4. Start all development servers
run dev -all
```

### 🔄 Daily Development Flow

```bash
# Start specific apps
run dev nexus-api              # Backend only
run dev nexus-web              # Frontend only
run dev nexus-api nexus-web    # Both

# Build for production
run build nexus-api
run build nexus-web

# Run only one service
cd apps/nexus-api
npm run dev
```

### 🧪 Testing Changes

```typescript
// 1. Update a contract
// packages/nexus-api-contracts/src/routes/...

// 2. The backend and frontend will auto-reload
// Type errors will show immediately if contracts don't match

// 3. Test the endpoint
curl http://localhost:3000/api/users/123 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Adding New Features

### 📘 Step-by-Step Guide

#### **Example: Adding a "Posts" Feature**

**Step 1: Create Database Table** (Supabase Dashboard)

```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Step 2: Define Models** (Contract Package)

```typescript
// packages/nexus-api-contracts/src/models/postSystem/post.ts
import { createSupabaseSelect, createInsert, createUpdate } from "supazod";
import { z } from "zod";

export const publicPostSchema = createSupabaseSelect({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  title: z.string(),
  content: z.string(),
  published: z.boolean(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const publicPostInsertSchema = createInsert(publicPostSchema, {
  user_id: true,
  title: true,
  content: true,
  published: true,
});

export const publicPostUpdateSchema = createUpdate(publicPostSchema, {
  title: true,
  content: true,
  published: true,
});

export const post = {
  row: publicPostSchema,
  insertDTO: publicPostInsertSchema,
  updateDTO: publicPostUpdateSchema,
};
```

**Step 3: Create Route Contract**

```typescript
// packages/nexus-api-contracts/src/routes/post-system/route.ts
import { createRoute, createEndpoint } from "@packages/api-typing";
import { SchemaFactory } from "@/utils/schemaFactory.utils.js";
import { Models } from "@/models/index.js";
import z from "zod";

export const postSystem = createRoute({
  path: "/posts",
  routes: {
    get: createEndpoint({
      method: "GET",
      request: {
        query: SchemaFactory.Request.Paginated.query(),
      },
      response: {
        200: SchemaFactory.Response.paginated(Models.postSystem.post.row),
        ...SchemaFactory.Response.standardErrors(),
      },
    }),

    post: createEndpoint({
      method: "POST",
      request: {
        body: SchemaFactory.Request.withPayload(
          Models.postSystem.post.insertDTO,
        ),
      },
      response: {
        201: SchemaFactory.Response.single(Models.postSystem.post.row),
        ...SchemaFactory.Response.standardErrors(),
      },
    }),

    post: createRoute({
      path: "/:postId",
      routes: {
        get: createEndpoint({
          method: "GET",
          request: {
            params: z.object({ postId: z.string().uuid() }),
          },
          response: {
            200: SchemaFactory.Response.single(Models.postSystem.post.row),
            ...SchemaFactory.Response.standardErrors(),
          },
        }),
      },
    }),
  },
});
```

**Step 4: Implement Backend**

```typescript
// apps/nexus-api/src/modules/postSystem/post.repository.ts
import { supabase } from "@/lib/supabase.js";

export class PostRepository {
  private table = "posts";

  async findById(postId: string) {
    const { data, error } = await supabase
      .from(this.table)
      .select("*")
      .eq("id", postId)
      .single();

    if (error) throw error;
    return data;
  }

  async create(dto: any) {
    const { data, error } = await supabase
      .from(this.table)
      .insert(dto)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

export const postRepositoryInstance = new PostRepository();
```

```typescript
// apps/nexus-api/src/modules/postSystem/post.controller.ts
import { RequestHandler } from "express";
import { createExpressController } from "@packages/api-typing";
import { Contract } from "@packages/nexus-api-contracts";

export class PostController {
  getPost: RequestHandler = createExpressController(
    Contract.postSystem.posts.post.get,
    async ({ input, output }) => {
      const post = await postRepository.findById(input.params.postId);

      return output(200, {
        status: "success",
        message: "Post fetched",
        data: post,
      });
    },
  );
}
```

**Step 5: Use in Frontend**

```typescript
// apps/nexus-web/app/posts/[postId]/page.tsx
"use client";

import { callEndpoint } from "@packages/api-typing";
import { Contract } from "@packages/nexus-api-contracts";

export default function PostPage({ params }: { params: { postId: string } }) {
  const result = await callEndpoint(
    process.env.NEXT_PUBLIC_API_URL!,
    Contract.postSystem.posts.post.get,
    { params: { postId: params.postId } }
  );

  if (result.status === 200) {
    return <div>{result.body.data.title}</div>;
  }

  return <div>Error</div>;
}
```