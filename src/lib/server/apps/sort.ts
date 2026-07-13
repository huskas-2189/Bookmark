import type { App } from '$lib/models/app';

/**
 * Sort apps by weight (ascending), falling back to alphabetical order
 * on the app name when weights are equal.
 */
export function sortApps(apps: App[]): App[] {
    return [...apps].sort((a, b) => {
        if (a.weight !== b.weight) {
            return a.weight - b.weight;
        }
        return a.name.localeCompare(b.name);
    });
}
