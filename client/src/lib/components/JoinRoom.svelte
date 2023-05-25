<script lang="ts">
	import { goto } from '$app/navigation';
	import { ROOM_STATE } from '$lib/stores/room';
	import { client, type JoinRoomResponse } from '$lib/ws';

	let nickname = '';
	let roomID = '';

	const handleSubmit = () => {
		client.emit('join-room', { nickname, roomID }, (resp: JoinRoomResponse) => {
			console.log('Joined!');
			$ROOM_STATE = {
				members: resp.members,
				ownerID: resp.ownerID
			};
			goto(`/play/${resp.roomID}`);
		});
	};
</script>

<form on:submit|preventDefault={handleSubmit}>
	<input type="text" bind:value={nickname} placeholder="Nickname" />
	<input type="text" bind:value={roomID} placeholder="Room ID" />
	<button type="submit">Entrar!</button>
</form>
