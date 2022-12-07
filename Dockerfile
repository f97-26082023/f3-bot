FROM node:lts AS build
WORKDIR /home/f3bot
COPY package.json yarn.lock ./
RUN yarn install
COPY tsconfig.json ./
COPY src/ ./src/
RUN yarn build

FROM node:lts AS deps
WORKDIR /home/f3bot
COPY package.json yarn.lock ./
RUN yarn install --production

FROM alpine:latest
RUN apk add --update --no-cache nodejs
WORKDIR /home/f3bot
COPY --from=deps /home/f3bot/node_modules ./node_modules/
COPY --from=build /home/f3bot/dist ./dist/
CMD ["node", "dist/index.js"]
