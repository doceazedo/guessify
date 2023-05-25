import { writable } from 'svelte/store';
import type { Member } from '$lib/ws';

type Room = {
	members: Member[];
	ownerID: string;
};

export const ROOM_STATE = writable<Room>();
