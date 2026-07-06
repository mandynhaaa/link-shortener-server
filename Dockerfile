FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml* ./

RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

FROM node:20-alpine AS runner

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package.json pnpm-lock.yaml* ./

RUN npm install -g pnpm && pnpm install --frozen-lockfile --prod

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3333

CMD ["node", "dist/server.js"]