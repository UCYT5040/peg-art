<script lang="ts">
	import type { PegConfig } from '$lib/peg';

	let {
		peg
	}: {
		peg: PegConfig;
	} = $props();
</script>

<!-- Viewport 0 0 100 100 -->

<g>
	{#if peg.style === 'circle'}
		<circle cx="50" cy="50" r="40" class="fill-{peg.color}-600" />
	{:else if peg.style === 'rect'}
		<rect x="10" y="10" width="80" height="80" class="fill-{peg.color}-600" rx="10%" />
	{:else if peg.style === 'triangle'}
		<!-- TODO: Improve triangle path -->
		<path
			class="fill-{peg.color}-600"
			d="M 10 34.14
            L 10 70
            Q 10 90, 30 90
            L 70 90
            Q 90 90, 75.86 75.86
            L 34.14 34.14
            Q 10 10, 10 34.14
            Z"
		/>
	{/if}
</g>
