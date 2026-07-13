<script lang="ts">
    import '../style/_style.css';
    import favicon from '$lib/assets/favicon.svg';
    import type { LayoutProps } from './$types';
    import { applicableTheme } from '$lib/stores/theme.store';
    import { onMount } from 'svelte';
    import { browser } from '$app/env';
    import Header from '$lib/components/layout/Header.svelte';
    import Footer from '$lib/components/layout/Footer.svelte';

    let { data, children }: LayoutProps = $props();

    onMount(() => {
        if (!browser) return;
        applicableTheme.subscribe((mode) => {
            if (!browser) return;
            document.documentElement.setAttribute('data-theme', mode);
        });
    });
</script>

<svelte:head>
    <title>{data.title} - {data.projectName}</title>
    <link rel="icon" href={favicon} />
    <meta name="description" content={data.description} />
</svelte:head>

<Header />
<main data-icon-size={data.style.iconSize}>
    {@render children()}
</main>
<Footer />

<style lang="postcss">
    @reference '#style';

    main {
        @apply flex items-center justify-center;
        @apply py-3 px-6;
        min-height: calc(100vh - calc(2 * var(--header-height)));
    }
</style>
