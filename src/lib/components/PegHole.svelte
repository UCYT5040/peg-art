<script lang="ts">
	import type { PegConfig } from '$lib/peg';
	import Peg from './Peg.svelte';

	type events = MouseEvent | FocusEvent;

	let {
		peg,
		onmousedown,
		onmouseup,
		onmouseoverFocus,
		onmouseoutBlur,
		position
	}: {
		peg: PegConfig | null;
		onmousedown: (position: number, e: events) => void;
		onmouseup: (position: number, e: events) => void;
		onmouseoverFocus: (position: number, e: events) => void;
		onmouseoutBlur: (position: number, e: events) => void;
		position: number;
	} = $props();

	let hovered = $state(false);

	function handleEvent(handler: (position: number, e: events) => void, e: events) {
		handler(position, e);
	}

	function mouseoverFocus(e: MouseEvent | KeyboardEvent) {
		hovered = true;
		handleEvent(onmouseoverFocus, e);
	}

	function mouseoutBlur(e: MouseEvent | KeyboardEvent) {
		hovered = false;
		handleEvent(onmouseoutBlur, e);
	}
</script>

<div
	class="flex aspect-square items-center justify-center"
	class:animate-[wiggle_1s_ease-in-out_infinite]={hovered}
	onmousedown={(e) => handleEvent(onmousedown, e)}
	onmouseup={(e) => handleEvent(onmouseup, e)}
	onmouseover={mouseoverFocus}
	onmouseout={mouseoutBlur}
	onfocus={mouseoverFocus}
	onblur={mouseoutBlur}
	role="button"
	tabindex="0"
>
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
		<rect x="0" y="0" width="100" height="100" class="fill-gray-800" rx="10%" />
		<circle cx="50" cy="50" r="20" class="fill-gray-900" />
		{#if peg}
			<Peg {peg} />
		{/if}
	</svg>
</div>
