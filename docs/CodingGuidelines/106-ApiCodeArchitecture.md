# why we need to properly structure the backend

- frontend are purely presentational. logic located on the frontend are very simple logic to process information from the backend. components also rarely couple with each other. logic of a component are contained within that component and rarely leaks outside it.
- it is also easy to locate when there is something wrong on the frontend because you can see it.
  on the backend however, it is full of business logic that often rely on one another. not architecturing the code properly will result in severe coupling between different parts of the codebase, which will make it hard to maintain and scale.

# global structure

- the api is versioned.
- at the top level, there is global configs, loaders, and middlewares that operate through the entire api, across all versions. these includes cors, loggers, parsers, and global rate limiter.
- at the top level is where we load individual versions.
- the loaders are called that the app.ts file

- each version is their own express app. they have their own loaders, own middlewares, and other foldes such as error classes, error handler, types, and utils.
- the version application loaders are call on the constructure of the version classs located in the versionfolder's index.ts file.

# how the api is loaded

- since each version is like an independent express app, we can talk about them separately. from hereon, each version folder will be referred to as an api. they can be used interchangeably

- each api has an index file which exposes a version class with an app member, which is initialized and loaded on the constructor. loaders are also called from the constructor.

- loaders are functions that attach middlewares and routes to an application object. they are located on loaders folder.

- middlewares are functions that processes or handles a request. they are located on the middlewares folder. for simplicity, pure middlewares and middleware factory functions (e.g. createAuthMiddleware) are both referred to as middlewares.

- utilities are collection of function and classes that are design to accomplish a specific task. They MUST be context agnostic. Meaning, they must not be care on which context they are called, i.e, feature specific processes such as "createUserUtil".

- the types folder contains types used throughout the application. however, to make the code more maintainable, it is recommended that types are placed near where they are used. i.e. types used in just one module should be placed within that module instead on being at the top level types folder.

- the routes folder contain the api endpoints. it is what exposes the external functionalities of the api.

- the modules folder contains the api modules where all of the business logic happens. they are the parts of the api responsible for processing all kinds of data.

# clean architecture

- our api follows the clean architecture.
- we have the application layer, presentation layer, and the infrastructure layer.
- application layers which contains the domains, use cases, and interfaces, and controllers.
- the presentation layer is the only layer visible to consumers. it exposes the functionalities of the application.
- the infrastructure layer is the layer that implements the interfaces defined in the application layer by interacting with external services.

## application layer

- contains absolutely all of the business logic of the api. not business logic must be located outside the application. everything that involves processing, managing, creating, modifying, deleting, etc. of a resource must be within the application layer.
- the application layer is the modules folder. within the folder are several subfolders which are the individual modules designed for a very specific set of task.
- each module is decoupled from each other, meaning, a module cannot directly call another module. instead, if a module needs another module, it needs to be treated as an external dependency.
- each module contains the domain, use cases, and controllers.
- inside each module folder are the following: domains folder containing all domain related files. Usecases folder containing all use cases. Controller file which contains the controller. And index.ts which bundles everything together. It also has the infrastructure folder which is not part of application layer, but is put there for better collocation.
- each module has a index.ts file that bundles everything and instantiating a default instance of the module by building all dependencies. external consumers still has the ability to initialize their own instance and inject their own implementation of the dependencies.

### domains

- within the domain is where we describe the resource we will be working on and the interfaces that we will need
- a resource can be a class or a simple interface. it is only aware about itself and other resource classes. it can reference interfaces but is highly discouraged. a resource is responsible for making sure that it is always in a valid state. that means that it should have checks when it is created, updated, or loaded. that means that it cannot depend on external factors for id creation, creation dates, update dates, as those external factors might introduce invalid states that the domain class is unable to check.

- interfaces are abstract classes that specifies the actions that a the module need to accomplish its tasks. here we define methods such as saveResourceToRepository which will save the resource somewhere even though we do not know where it will be saved, or how it is beign saved. We just know that that function is saving is somewhere and that we can fetch it again later. note that interfaces are definition. the do not implement. implementing them will violate the dependency rule are the application layer will now be dependent on an external framework or library.

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

### use cases

- use cases are the code that does a set of steps in order to do something.
- use cases basically define all the things that can be done to the module. e.g. "checkinUserToEventUsingQrCodeUseCase". there is no limit to how many use case you can make. you can as many use case as you want, each doing exactly what the user wants to do.

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

### controllers

- controllers bundles the use cases together.
- it is also responsible for converting data structure from outside into data structure that is convenient to the use cases, and also the opposite where it converts data structure from the use cases into plain data structures that are more convenient to the outside world.

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

## infrastructure layer

- for simplicity purposes, the infrastructure layer is placed within the modules folder to improve collocation. however, the infrastructure layer is still considered as a layer of its own.
- the sole purpose of the infrastructure layer is to implement the interfaces from the application layer using any external libraries of its choice.
- implmentations should never have business logic that directly modifies the state of the resources being passed into it. for example, it should not change the id of a resource passed to it before saving it. save methods should just write the information somewhere without doing any modifications to it. it can change the formatting, the name of the fields, but it should be reversible such that the fetch functions can translate it back into a format that the application layer understands.

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

## presentation layer

- similarly to the infrastructure layer, the presentation is part of the outermost layers of the architecture. it is implemented on top of the application layer.
- the main purpose of the presentation layer is to expose the functionalities of the application layer. presentation layers could be a UI, cli, or an api.

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

# tests

- dependency injection and the modularity of clean architecture makes it easy to implement tests.
- tests must be put within folders names **tests**. test files must follow the naming format doSomethingUseCase.test.ts.
- within the test, initialize the mock dependencies, and use that initialize the test subject.
- each use case must have its own test file.
- each domain class must have its own test file.
- each interface must have its own test file.
- a controller must have its own test file.
