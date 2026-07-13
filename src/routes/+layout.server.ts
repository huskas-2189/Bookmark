import type { LayoutServerLoad } from './$types';
import { projectName, projectVersion } from '$lib/server/project';
import { getGlobalConfig } from '$lib/server/global-config';
import { getAuthProvider } from '$lib/server/auth/auth';

export const load: LayoutServerLoad = async () => {
    return {
        title: getGlobalConfig().title,
        description: getGlobalConfig().description,
        projectName: projectName,
        projectVersion: projectVersion,
        defaultAttrs: getGlobalConfig().defaultAttrs,
        username: getAuthProvider().getConnectedUser()?.username,
        style: getGlobalConfig().style
    };
};
