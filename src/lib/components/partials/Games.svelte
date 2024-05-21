<script lang="ts">
  import { fboxstore } from "$lib/stores";
  import { Skeleton } from "../ui/skeleton";

  export let init: () => Promise<void>;
</script>

<h2 class="h-10 w-full bg-white uppercase font-medium text-center">
  all games
</h2>
{#await init()}
  <div class="grid grid-cols-4 gap-2" title="games">
    <Skeleton class="aspect-[70/96] w-full" title="game" />
    <Skeleton class="aspect-[70/96] w-full" title="game" />
    <Skeleton class="aspect-[70/96] w-full" title="game" />
    <Skeleton class="aspect-[70/96] w-full" title="game" />
  </div>
{:then _}
  <div class="grid grid-cols-4 gap-2">
    {#each $fboxstore.getGames() as { name, image, url } (name)}
      <a href={url} class="w-full aspect-[70/96] flex flex-col items-center">
        <img src={image} class="w-full" alt={name} />
        <p>{name}</p>
      </a>
    {/each}
  </div>
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}
