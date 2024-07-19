<script lang="ts">
	import Dashboard from '$lib/icons/Dashboard.svelte';
	import { auth_email, auth_user } from '$lib/stores/user';
</script>

<a
	href="/dashboard"
	class="{$auth_user
		? 'h-[52px]'
		: 'h-[45px]'} bg-[#13100F] inline-flex justify-center font-paralucent font-medium text-xs border border-[#FFFFFF1A] rounded-[8px] px-[12px] items-center gap-x-[5px]"
>
	<span class="-translate-y-[2px]">
		<Dashboard />
	</span>

	Dashboard
</a>
