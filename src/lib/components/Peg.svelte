<script lang="ts">
	import type { PegConfig } from "$lib/peg";

    let {peg}: {
        peg: PegConfig,
    } = $props();
</script>

<!-- Viewport 0 0 100 100 -->

<g>
{#if peg.style === 'circle'}
    <circle cx="50" cy="50" r="40" class="fill-{peg.color}-600" />
{:else if peg.style === 'rect'}
    <rect x="10" y="10" width="80" height="80" class="fill-{peg.color}-600" rx="10%" />
{/if}
</g>