# Power Turborepo

This repository contains an empty [Turborepo](https://turbo.build/) monorepo scaffold that is ready for new applications and packages.

## Getting started

1. Install dependencies:

   ```bash
   pnpm install
   # or
   npm install
   ```

2. Add your applications under `apps/` and shared packages under `packages/`.

3. Use the provided scripts:

   - `pnpm dev` – run development tasks in parallel.
   - `pnpm build` – run build pipelines across the workspace.
   - `pnpm lint` – run linting tasks across the workspace.
   - `pnpm test` – run tests across the workspace.

The Turborepo pipeline is configured in `turbo.json`. Adjust the configuration as your project grows.
