import { io } from 'socket.io-client';
import { env } from '$env/dynamic/public';

export type JoinRoomResponse = {
	roomID: string;
	members: Member[];
	ownerID: string;
};

export type WarmupStatePayload = {
	startsAt: string;
};

export type GuessingStatePayload = {
	question: {
		type: string;
		preview: string;
		options: Item[];
	};
};

export type PlayerGuessPayload = {
	guess: PlayerGuess;
};

export type RoundAnswerPayload = {
	track: Track;
	scores: [];
};

export type Item = {
	id: string;
	name: string;
};

export type PlayerGuess = {
	playerID: string;
	option?: string;
	date: Date;
};

export type Track = {
	track: Item;
	artist: Item;
	preview: string;
	cover: string;
};

export type Member = {
	id: string;
	nickname: string;
	score: number;
};

export const client = io(env.PUBLIC_WEBSOCKET_URL);
client.on('connect', () => console.log('Conectou :)'));
