<script lang="ts">
    import type { PageProps } from './$types';
    import type { App as AppModel } from '$lib/models/app';
    import App from '$lib/components/App.svelte';

    let { data }: PageProps = $props();
</script>

{#snippet appgroup(apps: AppModel[])}
    <div class="bookmark-container">
        {#each apps as app (app.id)}
            <App {app}></App>
        {/each}
    </div>
{/snippet}

{#if data.groups.length}
    <div class="groups">
        {#each data.groups as group (group.id)}
            {@const groupApps = data.apps.filter((app) => app.group === group.id)}
            {#if groupApps.length}
                <div class="group">
                    <h2>{group.label}</h2>
                    {@render appgroup(groupApps)}
                </div>
            {/if}
        {/each}
    </div>
{:else}
    {@render appgroup(data.apps)}
{/if}

<style lang="postcss">
    @reference '#style';

    .groups {
        @apply flex flex-col;
    }

    .bookmark-container {
        @apply place-content-center;

        @apply py-3;
        @apply gap-4;
    }

    :global([data-icon-size='small']) .bookmark-container {
        @apply grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8;
    }

    :global([data-icon-size='medium']) .bookmark-container {
        @apply grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6;
    }

    :global([data-icon-size='large']) .bookmark-container {
        @apply grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4;
    }
</style>
