<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	export let date: Date;

	let timer: ReturnType<typeof setInterval>;
	let secondsUntil = 0;

	const updateSecondsUntil = () => {
		secondsUntil = Math.floor((date.getTime() - new Date().getTime()) / 1000);
		if (secondsUntil < 0) {
			secondsUntil = 0;
			clearInterval(timer);
		}
	};

	onMount(() => {
		timer = setInterval(updateSecondsUntil, 250);
		updateSecondsUntil();
	});

	onDestroy(() => clearInterval(timer));
</script>

<h1>{secondsUntil}</h1>
