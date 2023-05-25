import { writable } from 'svelte/store';
import type { Item, PlayerGuess } from '$lib/ws';

export type RoundState = 'warmup' | 'guessing' | 'answer' | 'end';

type Game = {
	round: number;
	state: RoundState;
	question?: {
		type: string;
		preview: string;
		options: Item[];
	};
	guesses: PlayerGuess[];
	nextRound?: Date;
};

export const GAME_STATE = writable<Game>({
	round: 0,
	state: 'warmup',
	guesses: []
});
