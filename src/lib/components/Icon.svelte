<script lang="ts">
    const defaultUrl = 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/';
    const {
        icon,
        alt
    }: {
        icon: string;
        alt: string;
    } = $props();

    function getUrl(): string {
        if (icon.startsWith('local:')) {
            return icon.replace('local:', '/icons/');
        }

        return `${defaultUrl}${icon}.png`;
    }
</script>

<img src={getUrl()} {alt} />

<style lang="postcss">
    @reference '#style';

    img {
        @apply w-auto;
    }

    :global([data-icon-size='small']) img {
        @apply h-4;
    }

    :global([data-icon-size='medium']) img {
        @apply h-6;
    }

    :global([data-icon-size='large']) img {
        @apply h-8;
    }
</style>
