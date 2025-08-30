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

	let pendingResize: number | null = $state(null);
	let currentSize: number | null = $state(null);

	function calculatePegHoles() {
		if (!container) return;

		const containerRect = container.getBoundingClientRect();
		const pegHoleSize = 48 + 4; // 3rem (48px) + gap (4px)

		const cols = Math.floor(containerRect.width / pegHoleSize);
		const rows = Math.floor(containerRect.height / pegHoleSize);

		const totalPegHoles = cols * rows;

		if (totalPegHoles === currentSize) {
			pendingResize = null;
		} else if (currentSize) {
			pendingResize = totalPegHoles;
		} else {
			currentSize = totalPegHoles;
			clear();
		}
	}

	function clear() {
		pegHoles = Array.from({ length: currentSize || 0 }, () => null);
	}

	function resize() {
		if (pendingResize !== null) {
			currentSize = pendingResize;
			clear();
			pendingResize = null;
		}
	}

	let pegLibrary: PegConfig[][] = $state([]);

	for (const color of colors) {
		let row: PegConfig[] = [];
		for (const style of styles) {
			row.push({ style, color });
		}
		pegLibrary.push(row);
	}

	let action: null | 'copy' | 'move' | 'delete' = $state(null);
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
		// Right click = delete (immediate)
		if (e.button === 0) {
			action = 'move';
		} else if (e.button === 1) {
			action = 'copy';
		} else if (e.button === 2) {
			action = 'delete';
		} else {
			action = null;
		}
	}

	function mouseUp(position: number, e: UIEvent) {
		console.log('Mouse up');
		e.preventDefault();
		if (origin === null) return;
		if (action == 'delete' && position === origin) {
			// If the user wants to cancel the delete, they can drag away
			pegHoles[origin] = null;
			action = null;
			return;
		}
		if (position == origin) {
			action = null; // Allows for cancelling moves
		}
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

	function cancelAction() {
		action = null;
		origin = null;
	}
</script>

<svelte:window onmousemove={mousemove} onmouseup={cancelAction} />

<div class="flex h-screen w-full" class:overflow-hidden={pendingResize}>
	<div class="h-full overflow-y-auto p-2">
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
		<h2 class="text-lg font-semibold">Controls</h2>
		<p>
			<strong>Left click</strong> - Move peg<br />
			<strong>Middle click</strong> - Copy peg<br />
			<strong>Right click</strong> - Delete peg
		</p>
		<p>
			<small> Drag away from a peg to cancel deletion. </small>
		</p>
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
	{#if action === 'delete'}
		{#if selection === origin}
			<img
				src="/icons/trash.svg"
				alt="Trash can"
				class="pointer-events-none absolute h-12 w-12"
				style="left: {mousePosition[0]}px; top: {mousePosition[1]}px;"
			/>
		{:else}
			<img
				src="/icons/trash-cancel.svg"
				alt="Cancel trash"
				class="pointer-events-none absolute h-12 w-12"
				style="left: {mousePosition[0]}px; top: {mousePosition[1]}px;"
			/>
		{/if}
	{:else}
		<!-- Possibly move this to the script? -->
		{@const source = origin ? (origin === -1 ? librarySelection : pegHoles[origin]) : null}
		{#if source}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="pointer-events-none absolute h-12 w-12"
				style="left: {mousePosition[0]}px; top: {mousePosition[1]}px;"
				viewBox="0 0 100 100"
			>
				<Peg peg={source} />
			</svg>
		{/if}
	{/if}
{/if}

{#if pendingResize}
	<div class="fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center bg-black/50">
		<div class="flex flex-col gap-2 rounded bg-gray-900 p-4">
			<h2>Resize Board?</h2>
			<p>
				Your screen size has changed. If you continue, the board will be resized and all pegs will
				be cleared.
			</p>
			<button class="rounded bg-red-500 px-4 py-2 font-semibold text-white" onclick={resize}>
				Resize Board
			</button>
			<p class="text-sm">Return to the previous screen size to keep the current board.</p>
		</div>
	</div>
{/if}
