
# Project Setup

This guide will walk you through setting up your local development environment. This repository utilizes a monorepo structure managed by **pnpm** and **Turborepo**.

## Prerequisites

Before you begin, ensure you have the following installed:

-   [Node.js](https://nodejs.org/) (v18 or higher recommended)
-   [Git](https://git-scm.com/)

## Setup Steps

Follow these steps to get the project running on your local machine.

### 1. Clone the Repository

First, clone the project repository to your local machine.

```bash
git clone https://github.com/gdg-pup-webdev/gdgnexussecondclone.git
cd gdgnexussecondclone
```

### 2. Environment Variables

The project requires environment variables for configuration.

-   Obtain the necessary `.env` files from the project organizers.
-   Place them in the corresponding folders as instructed.

### 3. Install Dependencies

This project uses `pnpm` for package management. Install it globally if you haven't already, then install the project dependencies.

```bash
npm install -g pnpm@latest
pnpm install
```

### 4. Build the Project

Build all the packages and applications in the monorepo.

```bash
pnpm run build
```

### 5. Run in Development Mode

Start the development servers for all applications.

```bash
pnpm run dev
```

You are now ready to start developing!

## Additional Resources

To learn more about the tools used in this project, refer to the following resources:

-   [pnpm Documentation](https://pnpm.io/pnpm-cli)
-   [Turborepo Documentation](https://turborepo.dev/docs)