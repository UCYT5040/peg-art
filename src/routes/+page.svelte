<script lang="ts">
	import Peg from '$lib/components/Peg.svelte';
	import PegHole from '$lib/components/PegHole.svelte';
	import { colors, styles } from '$lib/peg';
	import { onMount } from 'svelte';
	import type { PegConfig } from '$lib/peg';

	let pegHoles: (PegConfig | null)[] = $state([]);
	let container: HTMLDivElement;

	onMount(() => {
		calculatePegHoles();
		// Recalculate on window resize
		window.addEventListener('resize', calculatePegHoles);
		return () => window.removeEventListener('resize', calculatePegHoles);
	});

	function calculatePegHoles() {
		if (!container) return;

		const containerRect = container.getBoundingClientRect();
		const pegHoleSize = 48 + 4; // 3rem (48px) + gap (4px)

		const cols = Math.floor(containerRect.width / pegHoleSize);
		const rows = Math.floor(containerRect.height / pegHoleSize);

		const totalPegHoles = cols * rows;
		pegHoles = Array.from({ length: totalPegHoles }, () => null);
	}

	let pegLibrary: PegConfig[][] = $state([]);

	for (const color of colors) {
		let row: PegConfig[] = [];
		for (const style of styles) {
			row.push({ style, color });
		}
		pegLibrary.push(row);
	}

	let action: null | 'copy' | 'move' = $state(null);
	let origin: null | number = $state(null); // -1 for library
	let librarySelection: null | PegConfig = $state(null);
	let selection: null | number = $state(null); // Represents the peghole under the mouse
	let mousePosition: [number, number] = $state([0, 0]); // Actual mouse coordinates

	function mouseDown(position: number, e: UIEvent) {
		console.log('Mouse down');
		e = e as MouseEvent; // Probably a better way to do this (should be handled in PegHole???)
		e.preventDefault();
		origin = position;
		// Left click = move
		// Middle click = copy
		if (e.button === 0) {
			action = 'move';
		} else if (e.button === 1) {
			action = 'copy';
		} else {
			action = null;
		}
	}

	function mouseUp(position: number, e: UIEvent) {
		console.log('Mouse up');
		if (origin === null) return;
		let source: PegConfig;
		if (origin === -1) {
			if (!librarySelection) return;
			console.log('Using library selection');
			source = librarySelection;
		} else {
			if (!pegHoles[origin]) return;
			source = pegHoles[origin];
		}
		if (action == 'move') {
			pegHoles[position] = source;
			pegHoles[origin] = null;
			pegHoles = pegHoles;
		} else if (action == 'copy') {
			pegHoles[position] = source;
			pegHoles = pegHoles;
		}
		action = null;
	}

	function mouseoverFocus(position: number, e: UIEvent) {
		selection = position;
	}

	function mouseoutBlur(position: number, e: UIEvent) {
		selection = null;
	}

	function setLibrarySelection(selection: PegConfig) {
		librarySelection = selection;
		action = 'copy';
		origin = -1;
	}

	function mousemove(e: MouseEvent) {
		mousePosition[0] = e.clientX;
		mousePosition[1] = e.clientY;
	}
</script>

<svelte:window onmousemove={mousemove} />

<div class="flex h-screen w-full">
	<div>
		<h2 class="text-lg font-semibold">Pegs</h2>
		{#each pegLibrary as row (row)}
			<div class="flex gap-1">
				{#each row as peg (peg)}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 100 100"
						class="h-12 w-12"
						role="button"
						tabindex="0"
						onmousedown={() => setLibrarySelection(peg)}
					>
						<Peg {peg} />
					</svg>
				{/each}
			</div>
		{/each}
		<h3 class="text-md font-semibold">Recently used</h3>
	</div>
	<div
		bind:this={container}
		class="m-1 grid flex-1 grid-cols-[repeat(auto-fill,minmax(3rem,1fr))] justify-center gap-1"
	>
		{#each pegHoles as peg, index (index)}
			<PegHole
				{peg}
				position={index}
				onmousedown={mouseDown}
				onmouseup={mouseUp}
				onmouseoverFocus={mouseoverFocus}
				onmouseoutBlur={mouseoutBlur}
			/>
		{/each}
	</div>
</div>

{#if action}
    <!-- Possibly move this to the script? -->
	{@const source = origin ? (origin === -1 ? librarySelection : pegHoles[origin]) : null}
	{#if source}
		<svg xmlns="http://www.w3.org/2000/svg"
			class="pointer-events-none absolute w-12 h-12"
			style="left: {mousePosition[0]}px; top: {mousePosition[1]}px;"
			viewBox="0 0 100 100"
		>
			<Peg peg={source} />
		</svg>
	{/if}
{/if}
