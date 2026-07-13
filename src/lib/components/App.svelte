<script lang="ts">
    import type { App } from '$lib/models/app';
    import Icon from '$lib/components/Icon.svelte';
    import { page } from '$app/state';
    import type { DefaultAttrs, Style } from '$lib/models/bookmark-config';

    const uid = $props.id();
    const {
        app
    }: {
        app: App;
    } = $props();

    const defaultAttrs = page.data.defaultAttrs as DefaultAttrs;
    const style = page.data.style as Style;
</script>

<article
    id="{app.id}-{uid}"
    class={{ bookmark: true, 'no-label': style.iconSize === 'small' || !style.displayLabel }}
>
    <Icon icon={app.icon ?? app.id} alt={app.name}></Icon>
    <a
        href={app.url}
        aria-label="Open {app.name}"
        rel="external noreferrer"
        target={app.target ?? defaultAttrs.target ?? '_self'}
    >
        <span>
            {app.name}
        </span>
    </a>
</article>

<style lang="postcss">
    @reference '#style';

    article {
        @apply p-2;
        @apply w-full;
        @apply text-center;

        @apply card;

        @apply relative;
        @apply flex flex-col items-center;

        &:hover {
            @apply shadow-lg/20;
        }

        a {
            @apply p-2 pb-0;

            &::after {
                content: '';
                position: absolute;
                inset: 0;
            }

            &:focus-visible {
                outline: 2px solid currentColor;
                outline-offset: 4px;
            }
        }

        &.no-label a {
            @apply p-0;
            span {
                @apply sr-only;
            }
        }
    }

    :global([data-icon-size='medium']) article {
        @apply px-1 py-2;

        a {
            @apply px-1;
        }
    }
</style>
