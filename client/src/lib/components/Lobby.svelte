<script lang="ts">
	import { goto } from '$app/navigation';
	import { GAME_STATE } from '$lib/stores/game';
	import { client, type WarmupStatePayload } from '$lib/ws';
	import { page } from '$app/stores';

	let playlistID = '';

	const handleSubmit = () => {
		client.emit('set-playlist', { playlistID }, () => {
			console.log('Playlist set!');
			client.emit('start', () => {
				console.log('Game will start soon!');
			});
		});
	};

	client.on('game:warmup', (payload: WarmupStatePayload) => {
		console.log('game:warmup', { payload });
		$GAME_STATE.nextRound = new Date(payload.startsAt);
		goto(`/play/${$page.params.roomID}/game`);
	});
</script>

<form on:submit|preventDefault={handleSubmit}>
	<input type="text" bind:value={playlistID} placeholder="Playlist ID" />
	<button type="submit">Start game!</button>
</form>
