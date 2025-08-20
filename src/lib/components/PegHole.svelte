<script lang="ts">
	import type { PegConfig } from "$lib/peg";
	import Peg from "./Peg.svelte";

    type events = MouseEvent | FocusEvent;

	let {
        peg,
		onmousedown,
		onmouseup,
		onmouseoverFocus,
		position
	}: {
        peg: PegConfig | null;
		onmousedown: (position: number, e: events) => void;
		onmouseup: (position: number, e: events) => void;
		onmouseoverFocus: (position: number, e: events) => void;
		position: number;
	} = $props();

	function handleEvent(handler: (position: number, e: events) => void, e: events) {
		handler(position, e);
	}
</script>

<div
	class="flex aspect-square items-center justify-center"
	onmousedown={(e) => handleEvent(onmousedown, e)}
	onmouseup={(e) => handleEvent(onmouseup, e)}
	onmouseover={(e) => handleEvent(onmouseoverFocus, e)}
    onfocus={(e) => handleEvent(onmouseoverFocus, e)}
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
