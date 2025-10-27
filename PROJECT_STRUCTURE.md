# Monorepo Structure

```
.
├── apps
│   ├── marketing
│   │   └── README.md
│   ├── mobile
│   │   └── README.md
│   └── web
│       ├── app
│       │   ├── (athlete)
│       │   │   ├── layout.tsx
│       │   │   ├── live
│       │   │   │   ├── live-client.tsx
│       │   │   │   └── page.tsx
│       │   │   ├── page.tsx
│       │   │   └── workouts
│       │   │       ├── [assignmentId]
│       │   │       │   ├── page.tsx
│       │   │       │   └── workout-logger.tsx
│       │   │       └── page.tsx
│       │   ├── (coach)
│       │   │   ├── billing
│       │   │   │   └── page.tsx
│       │   │   ├── clients
│       │   │   │   └── page.tsx
│       │   │   ├── dashboard
│       │   │   │   └── page.tsx
│       │   │   ├── media
│       │   │   │   ├── page.tsx
│       │   │   │   └── upload
│       │   │   │       └── page.tsx
│       │   │   ├── layout.tsx
│       │   │   └── page.tsx
│       │   ├── api
│       │   │   ├── _utils.ts
│       │   │   ├── assignments
│       │   │   │   ├── [id]
│       │   │   │   │   └── route.ts
│       │   │   │   └── route.ts
│       │   │   ├── exercises
│       │   │   │   ├── [id]
│       │   │   │   │   └── route.ts
│       │   │   │   └── route.ts
│       │   │   ├── media
│       │   │   │   ├── [id]
│       │   │   │   │   └── route.ts
│       │   │   │   └── route.ts
│       │   │   ├── mux
│       │   │   │   ├── upload
│       │   │   │   │   └── route.ts
│       │   │   │   └── webhook
│       │   │   │       └── route.ts
│       │   │   ├── phases
│       │   │   │   ├── [id]
│       │   │   │   │   └── route.ts
│       │   │   │   └── route.ts
│       │   │   ├── programs
│       │   │   │   ├── [id]
│       │   │   │   │   └── route.ts
│       │   │   │   └── route.ts
│       │   │   ├── pusher
│       │   │   │   ├── auth
│       │   │   │   │   └── route.ts
│       │   │   │   ├── events
│       │   │   │   │   └── route.ts
│       │   │   │   ├── heartbeat
│       │   │   │   │   └── route.ts
│       │   │   │   └── note
│       │   │   │       └── route.ts
│       │   │   ├── sets
│       │   │   │   ├── [id]
│       │   │   │   │   └── route.ts
│       │   │   │   └── route.ts
│       │   │   ├── stripe
│       │   │   │   └── webhook
│       │   │   │       └── route.ts
│       │   │   ├── subscriptions
│       │   │   │   └── route.ts
│       │   │   ├── workout-logs
│       │   │   │   ├── [id]
│       │   │   │   │   └── route.ts
│       │   │   │   └── route.ts
│       │   │   └── workouts
│       │   │       ├── [id]
│       │   │       │   └── route.ts
│       │   │       └── route.ts
│       │   ├── layout.tsx
│       │   ├── page.tsx
│       │   └── providers
│       │       ├── posthog-provider.tsx
│       │       └── tracing-provider.tsx
│       ├── instrumentation.ts
│       ├── middleware.ts
│       ├── next-env.d.ts
│       ├── next.config.js
│       ├── postcss.config.cjs
│       ├── public
│       │   ├── icons
│       │   │   ├── icon-192.png
│       │   │   └── icon-512.png
│       │   ├── manifest.webmanifest
│       │   ├── offline.html
│       │   └── sw.js
│       ├── sentry.client.config.ts
│       ├── sentry.edge.config.ts
│       ├── sentry.server.config.ts
│       ├── styles
│       │   └── globals.css
│       ├── tailwind.config.cjs
│       └── tsconfig.json
├── packages
│   ├── config
│   │   ├── package.json
│   │   ├── tailwind
│   │   │   └── base.cjs
│   │   ├── eslint
│   │   │   └── base.cjs
│   │   └── tsconfig
│   │       └── base.json
│   ├── db
│   │   ├── package.json
│   │   ├── schema.prisma
│   │   └── src
│   │       └── index.ts
│   ├── ui
│   │   ├── package.json
│   │   └── src
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── index.ts
│   │       └── input.tsx
│   └── utils
│       ├── package.json
│       └── src
│           ├── formatters.ts
│           ├── index.ts
│           ├── roles.ts
│           └── schemas.ts
├── PROJECT_STRUCTURE.md
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── turbo.json
└── vercel.json
```
