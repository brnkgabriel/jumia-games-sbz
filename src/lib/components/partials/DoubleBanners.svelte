<script lang="ts">
  import { fboxstore } from "$lib/stores";
  import { Skeleton } from "../ui/skeleton";

  export let init: () => Promise<void>;
</script>
{#await init()}
<div class="grid grid-cols-2 gap-2" title="offers">
  <Skeleton class="aspect-[148/122] w-full" title="banner 1" />
  <Skeleton class="aspect-[148/122] w-full" title="banner 2" />
</div>
{:then _}
{@const { camp1, camp2 } = $fboxstore.getDoubleBanners()}
<div class="grid grid-cols-2 gap-2">
  <a href={camp1.url} class="w-full aspect-[148/122] flex flex-col items-center">
    <img src={camp1.banner} class="w-full rounded" title="banner 1" alt="banner 1"/>
  </a>
  <a href={camp2.url} class="w-full aspect-[148/122] flex flex-col items-center">
    <img src={camp2.banner} class="w-full rounded" title="banner 2" alt="banner 2"/>
  </a>
</div>
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}