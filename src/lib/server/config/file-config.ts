import { env } from '$env/dynamic/private';
import fs from 'node:fs';
import { load } from 'js-yaml';
import type { BookmarkConfig } from '$lib/server/models/bookmark-config';
import type { App } from '$lib/models/app';
import type { Group } from '$lib/models/group';

export type BookmarkConfigFile = BookmarkConfig & {
    apps: App[];
    groups: Group[];
};

/**
 * Read the config file
 */

let globalConfig: BookmarkConfigFile | null = null;

function loadConfig(): BookmarkConfigFile {
    if (!env.CONFIG_FILE) {
        throw new Error('CONFIG_FILE env is undefined');
    }

    try {
        const file = fs.readFileSync(env.CONFIG_FILE, 'utf8');

        return load(file, {}) as BookmarkConfigFile;
    } catch (error: unknown) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            throw new Error(`File ${env.CONFIG_FILE} doesn't exist.`, { cause: error });
        } else {
            throw error;
        }
    }
}

function getGlobalConfig(): BookmarkConfigFile {
    if (!globalConfig) {
        globalConfig = loadConfig();
    }

    return globalConfig;
}

export function getFileConfig(): BookmarkConfig {
    const globalConfig = getGlobalConfig();

    return {
        title: globalConfig.title,
        description: globalConfig.description ?? '',
        auth: globalConfig.auth ?? 'basic_auth',
        users: globalConfig.users ?? [],
        defaultAttrs: globalConfig.defaultAttrs ?? {}
    };
}

export function getFileApps(): App[] {
    const globalConfig = getGlobalConfig();

    return globalConfig.apps ?? [];
}

export function getFileGroups(): Group[] {
    const globalConfig = getGlobalConfig();

    return globalConfig.groups ?? [];
}
