FROM node:lts-alpine AS builder
WORKDIR /home/bot
COPY package.json yarn.lock ./
RUN yarn install
COPY tsconfig.json ./
COPY src/ ./src/
RUN yarn build

FROM node:lts-alpine AS dependencies
WORKDIR /home/bot
COPY package.json yarn.lock ./
RUN yarn install --production

FROM alpine:3.17 AS runner
RUN apk add --update --no-cache nodejs
WORKDIR /home/bot
COPY --from=dependencies /home/bot/node_modules ./node_modules/
COPY --from=builder /home/bot/dist ./dist/
CMD ["node", "dist/index.js"]
