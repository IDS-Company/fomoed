<script lang="ts">
	import LogoContainer from '$lib/comps/LogoContainer.svelte';
</script>

<div
	style="background-image: url(/background/auth-single-pane.svg)"
	class="bg-no-repeat bg-cover absolute inset-0 grid place-items-center"
>
	<div class="max-w-[400px]">
		<slot></slot>
	</div>
</div>

<LogoContainer></LogoContainer>
