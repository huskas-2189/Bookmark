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
            // const iconName = icon.split(':')[1];
            // return `/icons/${iconName}`;
        }

        return `${defaultUrl}${icon}.png`;
    }
</script>

<img src={getUrl()} {alt} />

<style lang="postcss">
    @reference '#style';

    img {
        @apply h-8 w-auto;
    }
</style>
