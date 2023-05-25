<script lang="ts">
	import { ROOM_STATE } from '$lib/stores/room';
</script>

<aside>
	<ul>
		{#each $ROOM_STATE?.members || [] as member}
			<li>
				<b>{member.nickname}</b> ({member.score} ⭐)
			</li>
		{/each}
	</ul>
</aside>
