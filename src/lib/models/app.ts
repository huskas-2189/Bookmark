export const DEFAULT_APP_WEIGHT: number = 100;

export type Target = '_blank' | '_self' | '_parent' | '_top' | '_unfencedTop';

export type App = {
    id: string;
    name: string;
    url: string;
    icon?: string;
    roles: string[];
    target?: Target;
    group?: string;
    weight: number;
};
