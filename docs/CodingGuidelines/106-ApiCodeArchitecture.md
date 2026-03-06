# Why we need to properly structure the backend

Unlike the frontend, which is mostly presentational and contains only lightweight logic for displaying data, the backend is responsible for the majority of the system’s business logic. Frontend components are usually isolated and loosely coupled, making issues easier to detect since problems are often visible in the UI. The backend, however, coordinates multiple processes such as validation, persistence, and interactions between modules. These processes often depend on one another, which can quickly lead to tight coupling and hidden dependencies if the codebase is not properly structured. As the system grows, this makes the backend difficult to maintain, extend, and debug. Proper structure introduces clear separation of concerns and modular boundaries, allowing the system to scale without becoming unmanageable.

# Global API Structure

The API is organized around versioned applications to allow the system to evolve without breaking existing clients. Each API version is treated as an independent Express application with its own configuration, routes, and internal architecture.

At the top level, the project contains shared components that apply across all API versions. These include global configurations, loaders, and middlewares such as CORS, request parsers, logging, and global rate limiting. These global components are initialized in app.ts, where the main Express application is created and configured.

API versions are also registered at the top level. Each version is mounted on its own route prefix (e.g., /api/v1, /api/v2), allowing multiple versions of the API to run simultaneously.

Each API version is implemented as its own Express app instance. This allows every version to define its own loaders, middlewares, error classes, error handlers, utilities, and types without interfering with other versions.

Within each version folder, an index.ts file exposes a Version class. The constructor of this class initializes the Express app and executes the version’s loaders, which attach routes and middlewares to the application.

This structure isolates versions from each other while allowing the top-level application to manage shared infrastructure and mount each API version cleanly.

```
src/
├── configs/            # Global configurations (e.g., environment variables)
├── loaders/            # Global Express loaders (CORS, parsers, rate limiters)
├── middlewares/        # Global middlewares (error catching, logging)
├── v0/                 # Legacy API version (Deprecated architecture)
├── v1/                 # Current API version (Clean Architecture)
├── app.ts              # Main Express application initialization
└── index.ts            # Application entry point and server startup
```

# API Initialization and Loading Flow

Each API version behaves like an independent Express application. For clarity, the terms API and version folder are used interchangeably.

- Every API exposes a Version class through its index.ts file. The constructor initializes an Express app instance and calls the API’s loaders to configure it.
- Loaders are responsible for attaching middlewares, routes, and other runtime configurations to the Express application. They are located in the loaders folder and are executed during the initialization of the Version class.
- Middlewares are functions that process or handle incoming requests before they reach the route handlers. They may also be middleware factories (e.g., createAuthMiddleware). Both pure middlewares and middleware factories are collectively referred to as middlewares. These are located in the middlewares folder.
- Utilities are reusable functions or classes designed to accomplish a specific task. They must remain context-agnostic, meaning they should not depend on feature-specific logic (e.g., avoid utilities like createUserUtil). Utilities should only perform generic operations.
- The types folder contains shared type definitions used across the API. However, for better maintainability, types should be colocated with the modules that use them whenever possible. Types that are only used within a specific module should be defined inside that module rather than the global types folder.
- The routes folder defines the API endpoints. This layer exposes the external functionality of the API and connects incoming HTTP requests to the appropriate controllers.
- The modules folder contains the core API modules where the application’s business logic resides. These modules are responsible for processing data and implementing the main behaviors of the system.

```
src/v1/
├── errors/             # Version-specific custom error classes (HttpError, DatabaseError)
├── lib/                # External library wrappers and clients (Supabase, Firebase)
├── loaders/            # Version-specific loaders (attaching v1 routes and error handlers)
├── middlewares/        # Version-specific middlewares (auth guards, token parsers)
├── types/              # Version-wide TypeScript type definitions
├── utils/              # Context-agnostic utilities (try-catch wrappers, formatting)
├── routes/             # Presentation Layer: Express routes and HTTP controllers
├── modules/            # Application Layer: Core business logic and use cases
└── index.ts            # Version class initialization and loader execution
```

# clean architecture

The API follows Clean Architecture to enforce clear separation of concerns, strong modularity, and maintainability. The system is divided into three primary layers:

- Application Layer – Contains the core business logic of the system.
- Infrastructure Layer – Implements external integrations and persistence.
- Presentation Layer – Exposes the functionality of the application to external consumers.

Each layer has a specific responsibility and depends only on layers inside it. This prevents business logic from depending on frameworks, databases, or external services.

```
# presentation layer

src/v1/routes/
├── auth-system/
├── files/
│   ├── files.controller.ts  # Handles req/res, formatting, and HTTP status codes
│   └── files.router.ts      # Defines Express endpoints (GET, POST, etc.)
├── gdg-scraped-events/
└── health/
```

```
# application and infrastructure layer

src/v1/modules/filesModule/
├── domain/                      # The Enterprise Business Rules
│   ├── FileRecord.ts            # Domain entity with private state and validation
│   ├── IFileRepository.ts       # Interface defining database operations
│   └── IFileStorage.ts          # Interface defining file storage operations
│
├── useCases/                    # The Application Business Rules
│   ├── UploadFile.ts            # Orchestrates storage, DB, and domain logic
│   ├── DeleteFileById.ts
│   └── ListFIlesWithPagination.ts
│
├── infrastructure/              # The External Implementations
│   ├── GCPFileStorage.ts        # Concrete implementation of IFileStorage
│   ├── SupabaseFileRepository.ts# Concrete implementation of IFileRepository
│   ├── MockFileRepository.ts    # Mock implementation for testing
│   └── MockFileStorage.ts
│
├── __tests__/                   # Isolated Unit Tests
│   ├── UploadFile.test.ts       # Tests Use Case behavior using Mock Infrastructure
│   └── DeleteFileById.test.ts
│
├── FilesModuleController.ts     # The Application Controller (adapts data for routes)
└── index.ts                     # Dependency Injection: wires infrastructure to use cases
```

## Application Layer

The application layer contains all business logic of the API. Any operation that processes, creates, modifies, or manages a resource must exist within this layer. Business logic must never be placed in the presentation or infrastructure layers.

In the project structure, the application layer corresponds to the modules folder. Each module represents a focused domain of the system and is responsible for a specific set of functionality.

Key design rules:

- Each module is **self-contained and decoupled** from other modules.
- A module **must not directly call another module**. If interaction is required, the dependency should be treated as an external dependency and injected through interfaces.
- Every module bundles its components using an index.ts file, which constructs a default instance by wiring its dependencies together.
- External consumers may still create their own instances and inject alternative implementations if needed.

Each module typically contains:

- **domains/** – Domain entities and interfaces
- **usecases/** – Application actions and workflows
- **Controller file** – Entry point for external callers
- **infrastructure/** – Implementations of interfaces (collocated for convenience but logically separate)
- **index.ts** – Dependency wiring and module export

### domains

The domain layer defines the core resources and the contracts required to operate on them.

A resource represents a domain entity (e.g., StudyJam). It may be implemented as a class or an interface but must only be aware of its own state and related domain concepts.

Domain resources enforce valid state by validating data during:

- creation
- hydration
- updates

To guarantee integrity:

- constructors are typically private
- instances are created using factory methods such as create or hydrate
- updates must go through controlled methods instead of directly mutating properties

Domains should not rely on external systems for critical fields like IDs or timestamps if doing so could lead to invalid states or coupling between the application layer and the external libraries/frameworks.

```typescript
// ./domains/StudyJam.ts

// defining the properties of the resource
// it is recommended to define it outside of the class so that interfaces and usecases can also use it.
export type StudyJamProps = {
  id: string;
  creatorId: string;
  title: string;
  summary: string;
  description: string;
  createdAt: Date;
};

// the insert props defines the properties of the resources required to create a new instance of the resource.
export type StudyJamInsertProps = Omit<StudyJamProps, "id" | "createdAt">;

// the update props defines the properties of the resources required to update an existing instance of the resource.
export type StudyJamUpdateProps = Partial<
  Omit<StudyJamProps, "id" | "creatorId" | "createdAt">
>;

export class StudyJam {
  // we make props private to avoid users from directly modifying the state of the resource without passing through the validaton processes of create, hydrate, and update methods.
  private _props: StudyJamProps;

  // the constructor is private to avoid direct instantiation.
  // we avoid direct instantiation as it creates a way to bypass validation process done by the create, hydrate, and update methods.
  private constructor(props: StudyJamProps) {
    this._props = props;
  }

  // method to create a new study jam
  static create(props: StudyJamInsertProps): StudyJam {
    // validate props

    // create new study jam and return it
    return new StudyJam({
      ...props,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    });
  }

  // method to hydrate an existing study jam
  static hydrate(props: StudyJamProps): StudyJam {
    // validate if props is ready

    // initialize a study jam object and return it
    return new StudyJam(props);
  }

  // method to expose the properties of the object
  get props(): StudyJamProps {
    return this._props;
  }

  // method to update the properties of the object
  update(props: StudyJamUpdateProps): void {
    // validate the changes if it is allowed.
    // this is where we prevent users from changing protected properties such as the id, creation time, etc.

    // after validation, update the properties
    this._props = { ...this._props, ...props };
  }
}
```

### Interfaces (Ports)

Interfaces define contracts for external dependencies required by the application layer.

These interfaces describe what must happen, but not how it happens. For example, a repository interface may define methods like:

- findById
- saveNew
- persistUpdates
- delete

The application layer only depends on these abstractions. Concrete implementations are provided later by the infrastructure layer.

Important rules:

- Interfaces must not contain implementations
- They must remain independent of frameworks or libraries
- They exist to enforce the dependency inversion principle

```typescript
// ./domains/IStudyJamRepository.ts
import { StudyJam } from "./StudyJam";

// we create a definition of the repository and how we expect to use it within the application. We do not care how it is implemented as long as it does exactly what it is meant to do.
export abstract class IStudyJamRepository {
  findById(id: string): Promise<StudyJam | null>;

  // to prevent coupling between the database and the application layer, the implementation MUST NOT make any modification to the resource passed to it.
  // what i pass here on the saveNew method must be the exact same object that i will get when i call the findById method.
  saveNew(studyJam: StudyJam): Promise<StudyJam>;

  // similar to saveNew method, this should not modify the resource in any way
  // it should only update the existing entry on the db to match the current state of the resource.
  persistUpdates(studyJam: StudyJam): Promise<StudyJam>;
  delete(id: string): Promise<void>;
}
```

### Use Cases

Use cases define the actions that can be performed within a module. Each use case represents a single operation or workflow that the system supports. It does the operation by orchestrating the domains and interfaces together.

Examples:

- CreateStudyJam

- UpdateStudyJam

- CheckInUserToEventUsingQRCode

A use case:

- Receives input data
- Retrieves required resources through interfaces
- Applies domain logic
- Persists changes through repositories
- Returns the resulting resource or outcome

There is no limit to the number of use cases in a module. Each use case should perform a single clearly defined task.

```typescript
// ./usecases/UpdateStudyJam.ts

import { IStudyJamRepository } from "../domain/IStudyJamRepository";
import { StudyJam, StudyJamUpdateProps } from "../domain/StudyJam";

export class UpdateStudyJam {
  constructor(private readonly repo: IStudyJamRepository) {}

  async execute(id: string, updates: StudyJamUpdateProps): Promise<StudyJam> {
    // we ask the repository for a resource with the id.
    // we dont know the implementation of the repository. we dont know where it stores the resources
    // the only thing that we know is that findById method returns the resource with the id that we passed.
    const studyJam = await this.repo.findById(id);

    if (!studyJam) {
      throw new Error(`Cannot update: Study Jam with ID ${id} not found.`);
    }

    // we use the update method instead of directly modifying the props
    // update will do some validation to prevent invalid states.
    // this design prevents invalid updates such as accidentally changing the id of the resource, changing its createAt field, etc.
    studyJam.update(updates);

    // we use the persistUpdates method of the repository so to sync the external copy of the resource to the current state.
    return await this.repo.persistUpdates(studyJam);
  }
}
```

### Controllers (Application Controllers)

Controllers serve as the entry point to the application layer.

Their responsibilities include:

- Accepting simple input parameters from external callers
- Converting those inputs into structures expected by use cases
- Executing the appropriate use case
- Transforming the result into simple, external-friendly data structures

Controllers should not contain business logic. They only orchestrate use cases and adapt data formats.

```typescript
// ./StudyJamController.ts
import { StudyJam } from "./domain/StudyJam";
import { CreateStudyJam } from "./useCases/CreateStudyJam";
import { UpdateStudyJam } from "./useCases/UpdateStudyJam";

export class StudyJamController {
  constructor(private readonly updateUseCase: UpdateStudyJam) {}

  // we ask for simple plain parameters instead of demanding a resourceUpdateDTO as it is more convenient for external users
  async update(
    id: string,
    title?: string,
    summary?: string,
    description?: string,
  ) {
    // we convert the simple and plain parameters into a format more convenient to the use case.
    const studyJam = await this.updateUseCase.execute(id, {
      title,
      summary,
      description,
    });

    // we convert the result back into a simple, plain, and shallow format for the convenience of external users
    return {
      id: studyJam.props.id,
      creatorId: studyJam.props.creatorId,
      title: studyJam.props.title,
      summary: studyJam.props.summary,
      description: studyJam.props.description,
      createdAt: studyJam.props.createdAt.toISOString(),
    };
  }
}
```

```typescript
// ./index.ts
import { SupabaseStudyJamRepository } from "./infrastructure/SupabaseStudyJamRepository";
import { CreateStudyJam } from "./useCases/CreateStudyJam";
import { UpdateStudyJam } from "./useCases/UpdateStudyJam";

// we initialize the dependencies
const repository = new SupabaseStudyJamRepository();

// we initialize the use cases, passing its dependencies
const updateStudyJamUseCase = new UpdateStudyJam(repository);

// finally, we initialize the controller, passing its dependencies
export const studyJamController = new StudyJamController(updateStudyJamUseCase);
```

## Infrastructure Layer

The infrastructure layer implements the interfaces defined in the application layer.

Its purpose is to connect the system to external services such as:

- databases
- third-party APIs
- messaging systems
- storage services

For convenience, infrastructure code is placed within each module under an infrastructure folder. This improves collocation, although it is conceptually a separate architectural layer.

Key rules:

- Infrastructure classes implement application interfaces
- They may use external libraries or frameworks
- They must not introduce business logic

Infrastructure code should only:

- store data
- retrieve data
- translate data formats between external systems and domain objects

Any transformation must remain reversible, allowing data retrieved from storage to be converted back into valid domain objects.

```typescript
// ./infrastructure/SupabaseStudyJamRepository.ts
import { supabase } from "@/v1/lib/supabase";
import {
  IStudyJamRepository,
  StudyJamFilters,
} from "../domain/IStudyJamRepository";
import { StudyJam } from "../domain/StudyJam";

export class SupabaseStudyJamRepository implements IStudyJamRepository {
  private readonly tableName = "study_jam";

  // a simple utility that maps data structure of the database to the data structure of the database.
  private mapToDomain(row: any): StudyJam {
    return StudyJam.hydrate({
      id: row.id,
      creatorId: row.creator_id,
      title: row.title || "",
      summary: row.summary || "",
      description: row.description || "",
      createdAt: new Date(row.created_at || Date.now()),
    });
  }

  // implementing the saveNew method
  async saveNew(studyJam: StudyJam): Promise<StudyJam> {
    const props = studyJam.props;
    const { data, error } = await supabase
      .from(this.tableName)
      .insert({
        id: props.id,
        creator_id: props.creatorId,
        title: props.title,
        summary: props.summary,
        description: props.description,
        created_at: props.createdAt.toISOString(),
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create Study Jam: ${error.message}`);
    return this.mapToDomain(data);
  }

  // ...the other methods must be implemented as well
}
```

## Presentation Layer

The presentation layer exposes the functionality of the application layer to external consumers.

This layer may take several forms, such as:

- an HTTP API
- a CLI
- a user interface
- background jobs

In this project, the presentation layer is implemented as HTTP routes using Express.

Its responsibilities include:

- handling HTTP requests
- validating request structures
- calling the appropriate application controller
- formatting responses for the client

The presentation layer must not contain business logic. It only exposes the capabilities already defined in the application layer.

```typescript
// ./routes/gdg-scraped-events/gdgScrapedEvents.controller.ts

import { BevyEventController } from "@/v1/modules/bevyEvents/BevyEventController";
import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest/serverExpress";
import { RequestHandler } from "express";

export class GdgScrapedEventsHttpController {
  constructor(private bevyEventsModuleController: BevyEventController) {}

  list: RequestHandler = createExpressController(
    contract.api.v1.gdg_scraped_events.GET,
    async ({ input, output, ctx }) => {
      const pageNumber = input.query.pageNumber || 1;
      const pageSize = input.query.pageSize || 10;

      const data = await this.bevyEventsModuleController.list(
        pageNumber,
        pageSize,
      );

      return output(200, {
        status: "success",
        message: "Events fetched successfully",
        data: data.list,
        meta: {
          totalRecords: data.count,
          currentPage: pageNumber,
          pageSize: pageSize,
          totalPages: Math.ceil(data.count / pageSize),
        },
      });
    },
  );
}
```

```typescript
// ./routes/gdg-scraped-events/gdgScrapedEvents.router.ts

import { Router } from "express";
import { GdgScrapedEventsHttpController } from "./gdgScrapedEvents.controller";

export class GdgScrapedEventsRouter {
  router: Router;

  constructor(
    private gdgScrapedEventsHttpController: GdgScrapedEventsHttpController,
  ) {
    this.router = Router();

    this.router.get("/", this.gdgScrapedEventsHttpController.list);
  }
}
```

```typescript
// ./loaders/loadRoutes.ts
import { Express, Router } from "express";
import { GdgScrapedEventsHttpController } from "../routes/gdg-scraped-events/gdgScrapedEvents.controller";
import { bevyEventController } from "../modules/bevyEvents";
import { GdgScrapedEventsRouter } from "../routes/gdg-scraped-events/gdgScrapedEvents.router";

export const loadRoutes = (app: Express) => {
  // build the dependencies of the routes and inject it
  const gdgScrapedEventsHttpController = new GdgScrapedEventsHttpController(
    bevyEventController,
  );
  const gdgScrapedEventsRouter = new GdgScrapedEventsRouter(
    gdgScrapedEventsHttpController,
  );

  // register the routes to the express application
  app.use("/gdg-scraped-events", gdgScrapedEventsRouter.router);
};
```

# Testing Strategy

The modular design and dependency injection used throughout the architecture make the system highly testable. Because modules depend on interfaces rather than concrete implementations, external dependencies such as databases or APIs can easily be replaced with mock implementations during testing. This allows tests to focus on verifying the behavior of the component being tested without relying on real infrastructure.

General testing guidelines:

- All tests must be placed inside folders named **tests**.
- Test files must follow the naming format <ComponentName>.test.ts (e.g., UpdateStudyJamUseCase.test.ts).
- Each test should initialize mock dependencies, then use those mocks to construct the test subject.
- Tests should verify the behavior of the component in isolation, without relying on real databases or services.

Testing responsibilities by component:

- **Use Cases** – Each use case must have its own test file that verifies its workflow and interactions with dependencies.
- **Domain Classes** – Each domain entity must have tests validating creation, hydration, state updates, and rule enforcement.
- **Interfaces** – Interface contracts should have tests verifying that implementations conform to the expected behavior.
- **Controllers** – Each controller must have tests ensuring that inputs are correctly transformed and that the appropriate use cases are executed.
