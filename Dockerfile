# build stage
FROM node:lts-alpine AS builder

RUN npm install -g pnpm

USER node
WORKDIR /app


COPY --chown=node:node . .
RUN pnpm install --frozen-lockfile && pnpm run build

# production stage
FROM nginx:stable-alpine AS production-stage

# ENV VITE_IAM_TOKEN=${VITE_IAM_TOKEN}
# ENV VITE_YANDEX_GPT_URL=${VITE_YANDEX_GPT_URL}
# ENV VITE_YANDEX_FOLDER=${VITE_YANDEX_FOLDER}

# USER node
WORKDIR /app
# COPY --from=builder --chown=node:node /app/package*.json .
# COPY --from=builder --chown=node:node /app/node_modules/ ./node_modules
# COPY --from=builder --chown=node:node /app/.output ./.output
COPY --from=builder /app/.output ./.output

# EXPOSE 3000
CMD ['node', './.output/server/index.mjs']
