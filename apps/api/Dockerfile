FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/rbac/package.json ./packages/rbac/
COPY packages/tsconfig/package.json ./packages/tsconfig/
RUN pnpm install --frozen-lockfile

FROM base AS runner
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY apps/api/src ./apps/api/src
COPY apps/api/package.json ./apps/api/
COPY packages ./packages

WORKDIR /app/apps/api
EXPOSE 3333
CMD ["node", "--experimental-strip-types", "--no-warnings", "src/http/server.ts"]