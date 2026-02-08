**[🏠 Repository](../../README.md)** • **[📚 Onboarding](../Onboarding/README.md)** • **[📖 Coding Guidelines](./README.md)**

# 706 - Agile-Kanban Workflow

## Overview

This document defines how we manage the **Nexus Mono-repo**. By following these stages and role assignments, we ensure that our Dockerized environments, Storybook components, and core services remain high-quality and scalable. We combine **Agile** (our mindset) with **Kanban** (our visual tool) to ensure high-quality, iterative delivery.

---

## Core Concepts

### 1. What is Agile?
Agile is an iterative approach to software development that prioritizes flexibility and customer feedback. Instead of a single "Big Bang" release, we deliver work in small, functional increments.
* **Our Focus:** Responding to change, continuous delivery, and cross-functional collaboration.

### 2. What is a Kanban Board?
Kanban is a visual method for managing work as it moves through various stages. 
* **The Board:** Visualizes the entire workflow.
* **The Cards:** Represent individual work items (features, bugs, or tasks).
* **Flow:** The movement of cards from left to right, focusing on "finishing" rather than just "starting."

### 3. Our Hybrid Implementation
For **GDG PUP NEXUS**, we use a hybrid approach (often called **Scrumban**):
* **Sprints:** We organize work into fixed time-blocks (Sprints) to meet specific project milestones.
* **Visual Flow:** We use the Kanban board to manage the daily technical tasks within those sprints.
* **WIP Limits:** We restrict the number of active tasks to prevent bottlenecks in our Docker and Mono-repo environments.

---

## The 7 Stages of our Kanban Board


### 1. New Issues (The Inbox)
* **Who:** Lead Developer & Senior Developers.
* **What:** Every bug or feature starts here. 
* **Action:** The Lead Developer triages the issue for clarity and technical feasibility.

### 2. Icebox (Cold Storage)
* **Who:** Lead Developer & Senior Developers.
* **What:** Ideas that are "out of scope" for the current phase but worth keeping.
* **Action:** Keeps the active backlog clean and focused on current goals.

### 3. Product Backlog (Prioritization)
* **Who:** Lead Developer & Senior Developers.
* **What:** The "Ready to Build" list.
* **Action:** Seniors refine the technical requirements (e.g., API specs or UI architecture) to ensure Developers can start without blockers.

### 4. Sprint Backlog (The Commitment)
* **Who:** The Whole Team.
* **What:** Tasks selected for the current 2-week development cycle.
* **Action:** Developers "pull" cards from the Product Backlog into this column during Sprint Planning.

### 5. In Progress (Active Work)
* **Who:** Frontend/Backend Developers & DevOps.
* **What:** Active coding, Docker configuration, or Storybook development.
* **Rule:** **WIP Limit of 2.** Do not start a third task until one is moved to Review.

### 6. Review / QA (Verification)
* **Who:** Senior Developers, Frontend QA, Backend QA, & DevOps.
* **What:** Code review and functional testing.
* **Action:** - **Seniors:** Code logic and architectural review.
    - **QA:** Verify against Acceptance Criteria.
    - **DevOps:** Confirm Docker builds and deployment compatibility.

### 7. Done (Closure)
* **Who:** Lead Developer & Senior Developers.
* **What:** The final sign-off.
* **Action:** The card moves here only after the Pull Request (PR) is merged and the feature is verified in the staging environment.

---

## Responsibility Matrix (RACI)

| Stage | Lead Dev | Seniors | Developers | QA Team | DevOps |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **New Issues** | Accountable | Consulted | - | - | - |
| **Icebox** | Accountable | Consulted | - | - | - |
| **Product Backlog** | Responsible | Responsible | Consulted | - | Consulted |
| **Sprint Backlog** | Informed | Consulted | Responsible | Informed | Informed |
| **In Progress** | - | Consulted | Responsible | - | Responsible |
| **Review / QA** | Informed | Responsible | Consulted | Responsible | Responsible |
| **Done** | Accountable | Informed | Informed | Informed | Informed |

---

## Sprint Cadence & Rituals

We operate in **2-week Sprints**. Each sprint follows a specific rhythm:


### Week 1: Monday - Sprint Planning
* **The Goal:** Decide what will be "Done" by the end of the 2 weeks.
* **What people do:**
    * **Lead & Seniors:** Present the prioritized **Product Backlog**.
    * **Frontend/Backend Developers:** Estimate effort and pull tasks into the **Sprint Backlog**.
    * **DevOps:** Prepares the infrastructure/environment needed for the new features.

### Daily: The Stand-up (15 mins)
* **The Goal:** Sync on progress and remove blockers.
* **What people do:**
    * **Everyone:** Briefly states: 
        1. What I did yesterday, 
        2. What I'm doing today, 
        3. Any blockers (e.g., "I need a Senior Backend review" or "Docker build is failing").

### Week 2: Thursday - Sprint Review & Demo
* **The Goal:** Showcase completed work.
* **What people do:**
    * **Developers:** Demo features from the **Done** column.
    * **QA Team:** Confirm that all Acceptance Criteria were met during the live demo.
    * **Stakeholders:** Provide feedback for the next sprint's planning.

### Week 2: Friday - Sprint Retrospective
* **The Goal:** Improve our process.
* **What people do:**
    * **The Whole Team:** Discusses "What went well," "What didn't," and "What can we improve in our Kanban flow?"

---

## Compliance & Reporting for Nexus Tracker Google Sheets

[NOTE] This kanban board is **not** a replacement for the Nexus Tracker Google Sheets.
- **For Department Leads:** Upon moving a task to **Done** or closing a **Sprint**, ensure the **Nexus Tracker Google Sheet** is updated accordingly.  
- This is required for **project management compliance** and **internal progress auditing**.
