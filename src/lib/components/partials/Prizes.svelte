<script lang="ts">
  import { fboxstore } from "$lib/stores";
  import { Skeleton } from "../ui/skeleton";
  import PrizeTab from "../widgets/PrizeTab.svelte";

  $: map = $fboxstore.getPrizes();

  export let init: () => Promise<void>;
</script>

{#await init()}
  <Skeleton class="h-6 w-3/4 self-center" title="ended last" />
  <div class="flex flex-col gap-2" title="voucher card">
    <Skeleton class="aspect-[312/160] w-full self-center" />
    <Skeleton class="aspect-[312/160] w-full self-center" />
  </div>
{:then _}
  <PrizeTab {map} />
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}
