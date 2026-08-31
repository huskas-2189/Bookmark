# node:lts-alpine3.23
FROM node:lts-alpine3.23@sha256:244cc2b53f46f9e876304391d17682b0ddae9ac33491f4857e25e35a36ba7995 AS upstream

ARG VERSION

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm version ${VERSION} --no-git-tag-version --allow-same-version

FROM upstream AS build

COPY . .
COPY --from=upstream /app/package.json /app/package-lock.json ./

RUN npm ci
RUN npm run build

FROM upstream AS deps

COPY --from=upstream /app/package.json /app/package-lock.json ./
RUN npm ci --omit=dev

FROM alpine:3.24 AS runner

ARG VERSION
ARG BUILD_DATE

LABEL org.opencontainers.image.title="Bookmark" \
      org.opencontainers.image.description="A simple self-hosted dashboard for homelab bookmarks." \
      org.opencontainers.image.version="${VERSION}" \
      org.opencontainers.image.created="${BUILD_DATE}" \
      org.opencontainers.image.source="https://codeberg.org/huskas-2189/Bookmark" \
      org.opencontainers.image.licenses="GNU General Public License v3.0"

ENV NODE_ENV=production
ENV BOOKMARK_ORIGIN=http://localhost:3000
ENV CONFIG_FILE=/config.yaml

WORKDIR /app

RUN apk add --no-cache \
    dumb-init \
    'libcrypto3>=3.5.8-r0' \
    libstdc++ \
    && addgroup -g 1000 node && adduser -u 1000 -G node -s /bin/sh -D node \
    && chown node:node .

# Getting Node
COPY --from=upstream /usr/local/bin/node /usr/local/bin/
COPY --from=upstream /usr/local/bin/docker-entrypoint.sh /usr/local/bin/
ENTRYPOINT ["docker-entrypoint.sh"]

USER node

COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/build ./build

COPY ./static ./static
COPY ./docker/healthcheck.js /healthcheck.js

HEALTHCHECK CMD ["node", "/healthcheck.js"]

EXPOSE 3000
CMD ["dumb-init", "node", "build"]
