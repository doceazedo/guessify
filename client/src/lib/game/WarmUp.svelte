<script lang="ts">
	import { GAME_STATE } from '$lib/stores/game';
	import Countdown from '$lib/components/Countdown.svelte';
</script>

<Countdown date={$GAME_STATE.nextRound || new Date()} />
