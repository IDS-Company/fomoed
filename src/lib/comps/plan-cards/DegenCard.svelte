<script lang="ts">
	import SecondaryButton from '../buttons/SecondaryButton.svelte';
</script>

<div
	class="bg-black w-[333px] h-[436px] rounded-[20px] border border-transparent flex flex-col"
	style="background: linear-gradient( #0F0F0F, #0F0F0F) padding-box, linear-gradient(165.22deg, rgba(255, 255, 255, 0.4) -12.61%, rgba(153, 153, 159, 0.1) 104.22%) border-box"
>
	<div class="h-1/2 grid place-items-center text-center">
		<div>
			<div
				class="text-[28px] font-paralucent-demibold leading-[32px] bg-gradient-to-r from-primary to-yellow bg-clip-text text-transparent"
			>
				Degen
			</div>
			<div class="text-[48px] mt-[9px] leading-[54px] font-paralucent-demibold">$50</div>
			<div class="opacity-60 font-paralucent font-medium">/year</div>
			<div class="pt-[12px] opacity-60 text-sm font-paralucent font-medium">
				Renews every 1 year
			</div>
		</div>
	</div>

	<div class="h-px bg-[#FFFFFF33] mx-[10px]"></div>

	<ul class="px-[24px] pt-[20px] grid gap-y-[10px] text-sm">
		<li class="checkmark-list-item">Access to all time frame 15M, 1H, and 4H Data</li>
		<li class="checkmark-list-item">Access to more than 45 of the most popular crypto assets</li>
	</ul>

	<div class="flex-grow"></div>

	<div class="px-[20px] pb-[25px]">
		<SecondaryButton>Select Plan</SecondaryButton>
	</div>
</div>
