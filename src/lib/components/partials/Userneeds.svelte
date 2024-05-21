<script lang="ts">
  import { fboxstore } from "$lib/stores";
  import { Skeleton } from "../ui/skeleton";

  export let init: () => Promise<void>;
</script>


{#await init()}
<div class="grid grid-cols-4 gap-2" title="freelinks">
  <Skeleton class="aspect-square w-full" title="freelink" />
  <Skeleton class="aspect-square w-full" title="freelink" />
  <Skeleton class="aspect-square w-full" title="freelink" />
  <Skeleton class="aspect-square w-full" title="freelink" />
</div>
{:then _}
<div class="grid grid-cols-4 gap-2">
  {#each $fboxstore.getUserneeds() as { name, image, url } (image)}
    <a href={url} class="w-full aspect-square flex flex-col items-center">
      <img src={image} class="w-full rounded" title={name} alt={name} />
      {#if name}
        <p>{name}</p>
      {/if}
    </a>
  {/each}
</div>
{:catch error}
<p style="color: red">{error.message}</p>
{/await}