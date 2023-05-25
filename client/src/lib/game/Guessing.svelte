<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { GAME_STATE } from '$lib/stores/game';
	import { client, type Item, type PlayerGuessPayload, type RoundAnswerPayload } from '$lib/ws';

	let yourGuess: string;
	let answer: Item | null = null;

	$: question =
		$GAME_STATE.question?.type === 'title'
			? 'Qual o nome dessa música?'
			: 'Quem é o artista dessa música?';

	const guess = (id: string) => {
		if (!!yourGuess) return;
		yourGuess = id;
		client.emit('guess', { optionID: id });
	};

	onMount(() => {
		if (!browser || !$GAME_STATE.question) return;
		const audio = new Audio($GAME_STATE.question.preview);
		audio.volume = 0.25;
		audio.play();
		$GAME_STATE.guesses = [];
		answer = null;
	});

	client.on('player-guess', (payload: PlayerGuessPayload) => {
		$GAME_STATE.guesses = [...$GAME_STATE.guesses, payload.guess];
	});

	client.on('game:answer', (payload: RoundAnswerPayload) => {
		$GAME_STATE.state = 'answer';
		answer = $GAME_STATE.question?.type === 'title' ? payload.track.track : payload.track.artist;
	});
</script>

{#if $GAME_STATE.question}
	<h1>{question}</h1>
	<ul>
		{#each $GAME_STATE.question.options as option}
			<li>
				<button disabled={$GAME_STATE.state === 'answer'} on:click={() => guess(option.id)}>
					{option.name}
					{#if answer?.id === option.id}
						✅
					{/if}
				</button>
				{#if yourGuess === option.id}
					🍆
				{/if}
			</li>
		{/each}
	</ul>
{/if}
