# Custom Auth Module

This module handles custom username and password-based authentication for the Stackd Web application.

## Authentication Logic
- **Primary Identifier:** `username`
- **Password Hashing:** Uses `BCryptEncryptionService` with 10 salt rounds.
- **Session Management:** JWT-based tokens signed using `jsonwebtoken` and stored in HttpOnly cookies (`auth_token`).

## Components
- **Domain:** `User` entity and abstract interfaces for Repository, Encryption, and JWT services.
- **Use Cases:** 
  - `CreateUserUseCase`: Registers new users.
  - `LoginUseCase`: Validates credentials and generates a token.
  - `VerifyTokenUseCase`: Validates JWT tokens and returns user info.
  - `ChangeUsernameUseCase`: Updates a user's username.
  - `ChangePasswordUseCase`: Updates a user's password.
  - `DeleteUserUseCase`: Removes a user.
- **Infrastructure:**
  - `SupabaseCustomAuthRepository`: Persists user data to the `user_credentials` table in the `client_stackd` schema using the Supabase Service Role.
  - `BCryptEncryptionService`: Implements real password hashing.
  - `JWTService`: Handles JWT signing and verification.
- **Controller:** `CustomAuthModuleController` - The public API for the module.

## Superadmin Script
A CLI script is available for manually creating users using the real application logic:
```bash
pnpm create-user
```
The script will prompt for username and password, and will hash the password correctly before inserting it into the database via the `CreateUserUseCase`.
