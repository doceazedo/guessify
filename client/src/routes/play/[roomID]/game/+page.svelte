<script lang="ts">
	import type { SvelteComponent } from 'svelte';
	import { GAME_STATE, type RoundState } from '$lib/stores/game';
	import { client, type GuessingStatePayload } from '$lib/ws';
	import WarmUp from '$lib/game/WarmUp.svelte';
	import Guessing from '$lib/game/Guessing.svelte';
	import RoomPlayers from '$lib/components/RoomPlayers.svelte';

	client.on('game:guessing', (payload: GuessingStatePayload) => {
		$GAME_STATE.question = payload.question;
		$GAME_STATE.state = 'guessing';
	});

	const states = new Map<RoundState, typeof SvelteComponent>([
		['warmup', WarmUp],
		['guessing', Guessing],
		['answer', Guessing]
	]);
</script>

<main>
	<svelte:component this={states.get($GAME_STATE.state)} />
</main>
