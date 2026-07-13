import type { PageServerLoad } from './$types';
import { getAuthProvider } from '$lib/server/auth/auth';
import type { User } from '$lib/models/user';
import { getApps, getGroups } from '$lib/server/apps/apps';
import { sortApps } from '$lib/server/apps/sort';

export const load: PageServerLoad = async () => {
    const user = getAuthProvider().getConnectedUser() as User;

    const userRoles = new Set(user.roles);
    const apps = (await getApps()).filter((app) => app.roles.some((role) => userRoles.has(role)));

    return {
        groups: await getGroups(),
        apps: sortApps(apps)
    };
};
