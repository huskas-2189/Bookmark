import type { Target } from '$lib/models/app';

export type IconSize = 'small' | 'medium' | 'large';

export type DefaultAttrs = {
    target?: Target;
};

export type Style = {
    iconSize?: IconSize;
    displayLabel?: boolean;
};

export type BookmarkConfig = {
    title: string;
    description: string;
    defaultAttrs: DefaultAttrs;
    style: Style;
};
