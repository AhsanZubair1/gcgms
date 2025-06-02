# Architecture

---

## Table of Contents <!-- omit in toc -->

- [Hexagonal Architecture](#hexagonal-architecture)
- [Benefits](#benefits)
  - [Database Interactions](#database-interactions)
    - [Decoupling Services from Database Repositories \& Enhanced Testability](#decoupling-services-from-database-repositories--enhanced-testability)
  - [Third-Party Integrations](#third-party-integrations)
- [Description of the module structure](#description-of-the-module-structure)
- [Recommendations](#recommendations)
  - [Repository](#repository)
- [Pitfalls](#pitfalls)
- [FAQ](#faq)
  - [Is there a way to generate a new resource (controller, service, DTOs, etc) with Hexagonal Architecture?](#is-there-a-way-to-generate-a-new-resource-controller-service-dtos-etc-with-hexagonal-architecture)
  - [I don't want to use Hexagonal Architecture. How can I use a traditional (three-tier) architecture for NestJS?](#i-dont-want-to-use-hexagonal-architecture-how-can-i-use-a-traditional-three-tier-architecture-for-nestjs)
- [Links](#links)

---

## Hexagonal Architecture

This project is based on [Hexagonal Architecture](https://www.youtube.com/watch?v=bDWApqAUjEI). This architecture is also known as Ports and Adapters.

![Hexagonal Architecture Diagram](https://github.com/brocoders/nestjs-boilerplate/assets/6001723/6a6a763e-d1c9-43cc-910a-617cda3a71db)

## Benefits

### Database Interactions

#### Decoupling Services from Database Repositories & Enhanced Testability

The project uses a structure where services operate independently of the inner workings of repositories. In this architecture, the service layer interacts exclusively with domain entities, remaining unaware of the underlying database entities. Conversely, repositories handle database entities without any knowledge of the domain entities. This clear separation is maintained through the use of mappers, which are responsible for converting data between domain models and persistence entities.

Mappers play a crucial role in breaking the coupling at the column level, ensuring that changes in the database schema do not directly affect the business logic, and vice versa. This decoupling is essential for several reasons:

1. **Modularity**: Services can be developed and maintained independently of the database schema, making the codebase more modular and easier to manage.
2. **Flexibility**: Changes to the database schema, like adding or modifying columns, do not affect the business logic. This reduces the risk of errors and simplifies maintenance. In large-scale projects, this flexibility ensures that evolving database schemas won't disrupt endpoint responses.
3. **Testability**: With database interactions abstracted behind interfaces, it's easier to mock the database during testing. This leads to more reliable and faster tests, as the business logic can be tested independently of the database.

4. **Adaptability**: The project can adapt to changes in third-party providers or database technologies with minimal impact on the core business logic, enhancing the project's longevity and resilience.

By enforcing these practices, the project ensures a clean separation of concerns, promotes maintainability, and supports robust testing strategies.

### Third-Party Integrations

Given this project will involve a lot of 3rd party integrations, so it can pay off there as well.

1. **Isolated and Replaceable Integrations**: Third-party integrations are modular and can be easily swapped out without affecting the core business logic. This is particularly advantageous for long-term projects, where you may need to replace one third-party provider with another offering similar services.
2. **Improved Testability and Reliability**: Abstracting third-party services makes it easier to create mock versions, leading to more reliable and faster testing.

## Description of the module structure

```txt
.
├── domain
│   └── [DOMAIN_ENTITY].ts
├── dto
│   ├── create.dto.ts
│   ├── find-all.dto.ts
│   └── update.dto.ts
├── infrastructure
│   └── persistence
│       ├── document
│       │   ├── document-persistence.module.ts
│       │   ├── entities
│       │   │   └── [SCHEMA].ts
│       │   ├── mappers
│       │   │   └── [MAPPER].ts
│       │   └── repositories
│       │       └── [ADAPTER].repository.ts
│       ├── relational
│       │   ├── entities
│       │   │   └── [ENTITY].ts
│       │   ├── mappers
│       │   │   └── [MAPPER].ts
│       │   ├── relational-persistence.module.ts
│       │   └── repositories
│       │       └── [ADAPTER].repository.ts
│       └── [PORT].repository.ts
├── controller.ts
├── module.ts
└── service.ts
```

`[DOMAIN ENTITY].ts` represents an entity used in the business logic. Domain entity has no dependencies on the database or any other infrastructure.

`[SCHEMA].ts` represents the **database structure**. It is used in the document-oriented database (MongoDB).

`[ENTITY].ts` represents the **database structure**. It is used in the relational database (PostgreSQL).

`[MAPPER].ts` is a mapper that converts **database entity** to **domain entity** and vice versa.

`[PORT].repository.ts` is a repository **port** that defines the methods for interacting with the database.

`[ADAPTER].repository.ts` is a repository that implements the `[PORT].repository.ts`. It is used to interact with the database.

`infrastructure` folder - contains all the infrastructure-related components such as `persistence`, `uploader`, `senders`, etc.

Each component has `port` and `adapters`. `Port` is interface that define the methods for interacting with the infrastructure. `Adapters` are implementations of the `port`.

## Recommendations

### Repository

Don't try to create universal methods in the repository because they are difficult to extend during the project's life. Instead of this create methods with a single responsibility.

```typescript
// ❌
export class UsersRelationalRepository implements UserRepository {
  async find(condition: UniversalConditionInterface): Promise<User> {
    // ...
  }
}

// ✅
export class UsersRelationalRepository implements UserRepository {
  async findByEmail(email: string): Promise<User> {
    // ...
  }

  async findByRoles(roles: string[]): Promise<User> {
    // ...
  }

  async findByIds(ids: string[]): Promise<User> {
    // ...
  }
}
```

## Pitfalls

Hexagonal Architecture can take more effort to implement, but it gives more flexibility and scalability. [You still can use Three-tier architecture](#i-dont-want-to-use-hexagonal-architecture-how-can-i-use-a-traditional-three-tier-architecture-for-nestjs), but we recommend using Hexagonal Architecture. Try to create resources via our [CLI](cli.md), you will be sure that makes the same time (maybe even less 🤔) as Three-tier architecture.

---

## FAQ

### Is there a way to generate a new resource (controller, service, DTOs, etc) with Hexagonal Architecture?

Yes, you can use the [CLI](cli.md) to generate a new resource with Hexagonal Architecture.

### I don't want to use Hexagonal Architecture. How can I use a traditional (three-tier) architecture for NestJS?

You still can use [Three-tier Architecture](https://en.wikipedia.org/wiki/Multitier_architecture#Three-tier_architecture) `[controllers] -> [services] -> [data access]` near [Hexagonal Architecture](#hexagonal-architecture).

Database example: Just keep the existing approach of getting data from the database for auth, files, etc, as is (with Hexagonal Architecture), but for new modules use repositories from TypeORM directly in [services](https://docs.nestjs.com/providers#services). Entities and Schemas are ready for this.

---

## Links

- [Dependency Inversion Principle](https://trilon.io/blog/dependency-inversion-principle) with NestJS.

---

Previous: [Installing and Running](installing-and-running.md)

Next: [Command Line Interface](cli.md)
