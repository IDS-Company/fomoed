<script lang="ts">
	import MainButton from '$lib/comps/buttons/MainButton.svelte';
</script>

<div class="w-[138px]">
	<a href="/auth">
		<MainButton>
			<span class="uppercase">Login</span>
			<img src="/icons/login-arrow.svg" width={17} height={13} alt="Arrow right" />
		</MainButton>
	</a>
</div>
