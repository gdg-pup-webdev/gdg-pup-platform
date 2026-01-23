
## SETUP

This repository uses a monorepo setup using **pnpm** as the package manager and **turborepo** as the workspace manager.

Follow all the steps below in order to setup your local workspace.

1. **Clone the reponsitory**

```cmd
git clone https://github.com/gdg-pup-webdev/gdg-pup-platform.git
cd gdg-pup-webdev
```

2. **Add the .env files**
Ask the project organizers for the .env files and put then in the appropriate folders.

3. **Install pnpm and dependencies**

```cmd
npm install -g pnpm@latest
pnpm i
```

4. **Build the project**

```cmd
pnpm run build
```

5. **Start development mode**

```cmd
pnpm run dev
```

If you want to know more about the tools that we use, follow the links below:

- [pnpm](https://pnpm.io/pnpm-cli)
- [turborepo](https://turborepo.dev/docs/crafting-your-repository/running-tasks)
- [turborepo_guide_youtube](https://www.youtube.com/watch?v=gpWDZir8dAA&list=WL&index=11&t=137s)