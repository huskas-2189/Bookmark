# Bookmark

![Latest release](https://codeberg.org/huskas-2189/Bookmark/badges/release.svg)
![Release deploiement pipeline status](https://codeberg.org/huskas-2189/Bookmark/badges/workflows/build_app.yaml/badge.svg?branch=main&label=Release%20Pipeline)

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](./LICENSE)
[![Svelte](https://img.shields.io/badge/Svelte-5.x-orange?logo=svelte)](https://svelte.dev/)
[![Docker](https://img.shields.io/badge/Docker-ready-blue?logo=docker)](https://www.docker.com/)
![Self-hosted](https://img.shields.io/badge/Self--hosted-yes-success)
![Homelab](https://img.shields.io/badge/Homelab-friendly-purple)

A simple self-hosted dashboard for homelab bookmarks.

Bookmark displays only the apps that the current user is allowed to access, based on their assigned roles.

![Bookmark dashboard screenshot](./docs/screenshot.png)

## Features

- Simple bookmark dashboard
- Role-based app visibility
- Configuration through a single YAML file
- Built-in basic authentication
- Docker and Docker Compose support
- Optional custom icons

## Why Bookmark?

Bookmark was created for homelab users who want a simple entry point to all their other applications.

Many dashboards are powerful,
but they can also become complex when all you need is a list of links with basic access control.
Bookmark keeps the scope intentionally small: define your apps, define your users, assign roles,
and each user only sees what they are allowed to access.

No database is required. No complex setup is needed. Everything is configured from a single YAML file.

Bookmark is designed to be:

- Simple to deploy
- Easy to understand
- Lightweight to run
- Role-aware by default
- Friendly to Docker and reverse proxy setups

The goal is not to be the most feature-rich homelab dashboard.
The goal is to be the dashboard that does one thing well: showing the right bookmarks to the right users.

## Tech stack

Bookmark is built with a lightweight and self-hosting-friendly stack:

| Technology     |             Version |
| -------------- | ------------------: |
| **Node.js**    | `lts` (Alpine 3.23) |
| **Svelte**     |            `5.56.9` |
| **SvelteKit**  |            `2.70.3` |
| **Vite**       |             `8.2.1` |
| **TypeScript** |             `6.0.3` |

_This table should be kept updated with renovate._

This stack keeps Bookmark simple to deploy, easy to maintain, and approachable for contributors.

## Usage

### Docker compose

#### Basic example

```yaml
# compose.yaml
---
name: bookmark

services:
  bookmark:
    container_name: bookmark
    image: codeberg.org/huskas-2189/bookmark:latest
    environment:
      BOOKMARK_ORIGIN: 'http://localhost:3000'
    ports:
      - '3000:3000'
    volumes:
      - ./config.yaml:/config.yaml:ro
      - ./icons:/app/static/icons:ro
```

Start the service:

```bash
docker compose up -d
```

Then open http://localhost:3000

#### Traefik example

```yaml
# compose.yaml
---
name: bookmark

services:
  bookmark:
    container_name: bookmark
    image: codeberg.org/huskas-2189/bookmark:latest
    environment:
      BOOKMARK_ORIGIN: 'https://bookmark.domain.org'
    networks:
      - traefik
    volumes:
      - ./config.yaml:/config.yaml:ro
    labels:
      - 'traefik.enable=true'
      - 'traefik.docker.network=traefik'
      - 'traefik.http.routers.bookmark.service=bookmark-service'
      - 'traefik.http.routers.bookmark.rule=Host(`bookmark.domain.org`)'
      - 'traefik.http.services.bookmark-service.loadbalancer.server.port=3000'
      - 'traefik.http.services.bookmark-service.loadbalancer.server.scheme=http'

networks:
  traefik:
    external: true
```

Make sure **BOOKMARK_ORIGIN** matches the public URL used to access the app.

#### Environment variables

List of available environment variables:

| Env             | Default Value         |
| --------------- | --------------------- |
| BOOKMARK_ORIGIN | http://localhost:3000 |
| CONFIG_FILE     | /config.yaml          |

### Configuration file

Create a `config.yaml` file:

```yaml
# config.yaml
title: MyBookmarks
description: My apps are awesome
auth: basic_auth
defaultAttrs:
  target: _self
style:
  iconSize: medium
  displayLabel: false
groups:
  - id: apps
    label: Apps
apps:
  - id: app_1
    name: App 1
    url: https://app1.yourdomain.org
    roles:
      - admin
    group: apps
    weight: 10

users:
  - username: your_user
    password: '{your_hashed_password}'
    roles:
      - admin
```

#### Title and description

The `title` and `description` fields are used by the page template.

They define the page title and description metadata, which can be displayed by the browser or link previews.

Example:

```yaml
title: MyBookmarks
description: My personal homelab dashboard
```

#### auth

The auth field defines the authentication method.
Currently, the only supported value are `basic_auth` and `forward_auth`

Next integrated provider will be OpenId.

#### defaultAttrs

Default attributes for app links.

| Field    | Required | Description                                                                                                                                                                                           |
| -------- | -------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `target` |       No | Default value for the link `target` attribute ([@see MDN doc for further information](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a#target)).<br />Default value to "\_self" |

#### style

Global display settings for the dashboard.

| Field          | Required | Description                                                                         |
| -------------- | -------: | ----------------------------------------------------------------------------------- |
| `iconSize`     |       No | Size of the app icons. One of `small`, `medium`, `large`. Default value is `large`. |
| `displayLabel` |       No | Whether the app name is displayed below the icon. Default value is `true`.          |

When `iconSize` is set to `small`, the app name label is always hidden,
regardless of the `displayLabel` value, to keep the layout compact.

The label is never fully removed from the page: when hidden, it stays
available to screen readers, so hiding it has no impact on accessibility.

Example:

```yaml
style:
  iconSize: small
  displayLabel: false
```

#### groups

Define groups to group apps

| Field   | Required | Description                 |
| ------- | -------: | --------------------------- |
| `id`    |      Yes | Unique group identifier.    |
| `label` |      Yes | Display label of the group. |

If you don't want to display apps sorted by group, remove the field.

#### apps

The apps section defines the bookmarks displayed in the dashboard.
Each app requires:

| Field    | Required | Description                                                                                                                                                                                          |
| -------- | -------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`     |      Yes | Unique app identifier. Also used as the default icon ID.                                                                                                                                             |
| `name`   |      Yes | Display name of the app.                                                                                                                                                                             |
| `url`    |      Yes | URL where the user will be redirected.                                                                                                                                                               |
| `roles`  |      Yes | List of roles allowed to see this app.                                                                                                                                                               |
| `icon`   |       No | Custom icon ID. [See Icons](#icons).                                                                                                                                                                 |
| `target` |       No | value for the link `target` attribute ([@see MDN doc for further information](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a#target). Default value to `defaultAttrs.target` |
| `group`  |       No | Group of the app. [See Groups](#groups). If `groups` is not defined, this field is useless.                                                                                                          |
| `weight` |       No | Determines the display order among apps. Lower values are shown first. Apps sharing the same weight are sorted alphabetically by name. Defaults to `100`.                                            |

Example:

```yaml
apps:
  - id: jellyfin
    name: Jellyfin
    url: https://jellyfin.yourdomain.org
    roles:
      - admin
      - media
    target: _blank
    group: my_group
```

Apps can also be configured with docker labels. [See labels](#docker-labels)

#### Ordering apps

Apps are sorted by their `weight` field, from lowest to highest.
This is especially useful when apps are declared through Docker labels,
where display order otherwise depends on container creation order rather than a defined position.

If two apps share the same weight, they are sorted alphabetically by name.
Apps without an explicit weight default to `100`, leaving room to insert
apps before (lower values) or after (higher values) without renumbering everything.

Example:

```yaml
apps:
  - id: app_1
    name: App 1
    url: https://app1.yourdomain.org
    roles: [admin]
    weight: 10
  - id: app_2
    name: App 2
    url: https://app2.yourdomain.org
    roles: [admin]
    weight: 20
```

#### users

The `users` section is required when `auth` is set to `basic_auth`.

When `auth` is set to `forward_auth`, this section is ignored.
In that mode, the authenticated user and their groups are provided by the reverse proxy using these headers:

- `Remote-User`
- `Remote-Name`
- `Remote-Groups`

With `basic_auth`, the `users` section defines who can access Bookmark.

Each user requires:

| Field      | Required | Description                                             |
| ---------- | -------: | ------------------------------------------------------- |
| `username` |      Yes | Username used to sign in.                               |
| `password` |      Yes | Hashed password. See [Hash passwords](#hash-passwords). |
| `roles`    |      Yes | List of roles assigned to the user.                     |

Example:

```yaml
users:
  - username: alice
    password: '$2b$...'
    roles:
      - admin
      - media
```

### Docker labels

Apps can be defined with docker labels.

| Label                    | Required | Description                                                 |
| ------------------------ | -------- | ----------------------------------------------------------- |
| bookmark.enabled         | true     | Enable labels for the given container                       |
| bookmark.app.{id}.name   | true     | Display name of the app.                                    |
| bookmark.app.{id}.url    | true     | URL where the user will be redirected.                      |
| bookmark.app.{id}.roles  | true     | List of roles allowed to see this app, separate by a comma. |
| bookmark.app.{id}.icon   | false    | Custom icon ID. [See Icons](#icons).                        |
| bookmark.app.{id}.target | false    | Target field.                                               |
| bookmark.app.{id}.group  | false    | App group.                                                  |
| bookmark.app.{id}.weight | false    | Display order weight (ascending, default `100`).            |

example:

```yaml
services:
  httpd:
    container_name: httpd
    image: httpd
    ports:
      - '8000:80'
    labels:
      - 'bookmark.enabled=true'
      - 'bookmark.app.httpd.icon=apache'
      - 'bookmark.app.httpd.name=My web App'
      - 'bookmark.app.httpd.url=http://localhost:8000'
      - 'bookmark.app.httpd.roles=bookmark_admin'
      - 'bookmark.app.httpd.target=_blank'
      - 'bookmark.app.httpd.group=my_group'
      - 'bookmark.app.httpd.weight=0'
```

### Hash Passwords

Passwords must be hashed before being added to `config.yaml`.

Run:
`docker run --rm codeberg.org/huskas-2189/bookmark:latest npm run hash-password -- {your_very_strong_password}`

Then copy the generated hash into your configuration file:

```yaml
users:
  - username: your_user
    password: '{generated_hash}'
    roles:
      - admin
```

**Do not store plain-text passwords in config.yaml.**

### Icons

Icons are provided by [Homarr-labs](https://github.com/homarr-labs/homarr).
By default, Bookmark tries to use the app `id` as the icon ID.

If the icon does not exist, or if you want to use a different icon, add the icon field:

```yaml
apps:
  - id: my-media-server
    name: Jellyfin
    icon: jellyfin
    url: https://jellyfin.yourdomain.org
    roles:
      - media
```

#### Local icons

You can also use your own icons instead of the ones provided by Homarr-labs.

First, mount a volume to the `/app/static/icons` folder inside the container and place your icon files in it:

```yaml
# compose.yaml
services:
  bookmark:
    container_name: bookmark
    image: codeberg.org/huskas-2189/bookmark:latest
    volumes:
      - ./config.yaml:/config.yaml:ro
      - ./icons:/app/static/icons:ro
```

Then, reference the icon in your configuration with the `local:` prefix followed by the file name:

```yaml
apps:
  - id: my-media-server
    name: Jellyfin
    icon: 'local:mon-icon.jpg'
    url: https://jellyfin.yourdomain.org
    roles:
      - media
```

In this example, Bookmark will load the icon from `/app/static/icons/mon-icon.jpg`.

## Roadmap

The roadmap is managed in the [`Roadmap` project](https://codeberg.org/huskas-2189/Bookmark/projects/49784).

The current development priorities are:

- OpenID Connect authentication
- Healthcheck endpoint
- Built-in Traefik labels support

Ideas, issues, and contributions are welcome.

## AI usage

AI tools were used as development assistance while building Bookmark.

They helped with algorithm-related advice, understanding Svelte concepts
and features as someone coming from a PHP background,
and learning how to use Codeberg Actions after working mostly with GitLab.

AI was also used for translations, documentation improvements, and writing parts of this README.

## License

This project is licensed under the **GNU General Public License v3.0**.

See the [`LICENSE`](./LICENSE) file for details.
