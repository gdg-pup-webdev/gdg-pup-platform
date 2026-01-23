# Database Schema Guide

This document outlines the database schema for the GDG PUP Platform, hosted on **Supabase (PostgreSQL)**.

> **Project Link**: [Supabase Dashboard](https://supabase.com/dashboard/project/xrsmassoekhstkeuwozc)

## 🗂 Tables Overview

### 1. `user`

The central identity table for all platform users.

| Column         | Type        | Description                    |
| :------------- | :---------- | :----------------------------- |
| `id`           | `uuid`      | Primary Key.                   |
| `email`        | `text`      | Unique email address.          |
| `gdg_id`       | `text`      | Internal GDG identifier.       |
| `display_name` | `text`      | Publicly visible name.         |
| `first_name`   | `text`      | _Optional_                     |
| `last_name`    | `text`      | _Optional_                     |
| `avatar_url`   | `text`      | Profile picture URL.           |
| `status`       | `text`      | Account status (e.g., active). |
| `created_at`   | `timestamp` |                                |
| `updated_at`   | `timestamp` |                                |

---

### 2. `user_profile`

Extended profile information for a user.

- **Relationship**: One-to-One with `user`.

| Column           | Type        | Description             |
| :--------------- | :---------- | :---------------------- |
| `id`             | `uuid`      | Primary Key.            |
| `user_id`        | `uuid`      | FK to `user.id`.        |
| `bio`            | `text`      |                         |
| `program`        | `text`      | Academic program/major. |
| `year_level`     | `integer`   |                         |
| `skills_summary` | `text`      |                         |
| `is_public`      | `boolean`   | Visibility toggle.      |
| `github_url`     | `text`      |                         |
| `linkedin_url`   | `text`      |                         |
| `portfolio_url`  | `text`      |                         |
| `created_at`     | `timestamp` |                         |
| `updated_at`     | `timestamp` |                         |

---

### 3. `user_project`

Projects showcased by users.

| Column        | Type        | Description          |
| :------------ | :---------- | :------------------- |
| `id`          | `uuid`      | Primary Key.         |
| `user_id`     | `uuid`      | FK to `user.id`.     |
| `title`       | `text`      | Project title.       |
| `description` | `text`      |                      |
| `tech_stack`  | `text`      | Technologies used.   |
| `repo_url`    | `text`      | Git repository link. |
| `demo_url`    | `text`      | Live demo link.      |
| `created_at`  | `timestamp` |                      |

---

### 4. `event`

Events managed by the system.

| Column              | Type        | Description                   |
| :------------------ | :---------- | :---------------------------- |
| `id`                | `uuid`      | Primary Key.                  |
| `title`             | `text`      | Event title.                  |
| `description`       | `text`      |                               |
| `venue`             | `text`      | Location of the event.        |
| `start_date`        | `timestamp` |                               |
| `end_date`          | `timestamp` |                               |
| `category`          | `text`      | Event category.               |
| `attendance_points` | `integer`   | Points awarded for attending. |
| `attendees_count`   | `integer`   | Cached count of attendees.    |
| `creator_id`        | `uuid`      | FK to `user.id`.              |
| `created_at`        | `timestamp` |                               |
| `updated_at`        | `timestamp` |                               |

---

### 5. `event_attendance`

Tracks user participation in events.

| Column           | Type        | Description                     |
| :--------------- | :---------- | :------------------------------ |
| `id`             | `uuid`      | Primary Key.                    |
| `event_id`       | `uuid`      | FK to `event.id`.               |
| `user_id`        | `uuid`      | FK to `user.id`.                |
| `checkin_method` | `text`      | How they checked in (e.g., QR). |
| `is_present`     | `boolean`   | Confirmation of presence.       |
| `created_at`     | `timestamp` | Check-in timestamp.             |

---

### 6. `resource`

Educational or shared resources.

| Column         | Type        | Description           |
| :------------- | :---------- | :-------------------- |
| `id`           | `uuid`      | Primary Key.          |
| `title`        | `text`      |                       |
| `description`  | `text`      |                       |
| `resource_url` | `text`      | Link to the resource. |
| `uploader_id`  | `uuid`      | FK to `user.id`.      |
| `created_at`   | `timestamp` |                       |
| `updated_at`   | `timestamp` |                       |

---

### 7. `resource_tag` & `resource_tag_junction`

Tagging system for resources.

- **resource_tag**: Defines available tags (`tag_name`).
- **resource_tag_junction**: Many-to-Many link between `resource` and `resource_tag`.

---

### 8. `article`

Content/Blog posts.

| Column             | Type        | Description                  |
| :----------------- | :---------- | :--------------------------- |
| `id`               | `uuid`      | Primary Key.                 |
| `title`            | `text`      |                              |
| `body`             | `text`      | Content body.                |
| `author_id`        | `uuid`      | FK to `user.id`.             |
| `is_published`     | `boolean`   | Draft/Published state.       |
| `published_at`     | `timestamp` |                              |
| `related_event_id` | `uuid`      | FK to `event.id` (Optional). |

---

### 9. `wallet` & `wallet_transaction`

User internal currency/points system.

#### `wallet`

| Column    | Type     | Description            |
| :-------- | :------- | :--------------------- |
| `id`      | `uuid`   | Primary Key.           |
| `user_id` | `uuid`   | FK to `user.id`.       |
| `balance` | `number` | Current point balance. |

#### `wallet_transaction`

| Column        | Type     | Description                                       |
| :------------ | :------- | :------------------------------------------------ |
| `id`          | `uuid`   | Primary Key.                                      |
| `wallet_id`   | `uuid`   | FK to `wallet.id`.                                |
| `amount`      | `number` | Positive (credit) or negative (debit).            |
| `source_type` | `text`   | Origin of transaction (e.g., 'event_attendance'). |
| `source_id`   | `text`   | ID of the source entity.                          |

---

### 10. RBAC System (`user_role`, `user_role_junction`, `user_role_permission`)

Role-Based Access Control implementation.

- **`user_role`**: Defines roles (e.g., Admin, Member).
- **`user_role_junction`**: Assigns roles to users (Many-to-Many).
- **`user_role_permission`**: Granular permissions (`can_read`, `can_write`, `can_delete`, `can_update`) per `resource_name` for a given role.
