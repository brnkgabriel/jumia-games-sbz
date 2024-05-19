<script lang="ts">
  import "./app.css";
  import Carousel from "./lib/components/widgets/Carousel.svelte";
  import Tabs from "./lib/components/widgets/Tabs.svelte";
  import { Skeleton } from "./lib/components/ui/skeleton";
  import { common } from "./lib/common/index";
  import type { iSettings } from "./lib/interfaces/index";
  import { remotestore, settingstore, fboxstore } from "$lib/stores";
  import { onMount } from "svelte";

  $: console.log({ remotestore: $remotestore });
  const emailPrefix = (email:string) => email.split("@")[0]
  const init = async () => {
    const emails = await common.getCredentials();

    await $fboxstore.setRemotestore();

    // build is not supposed to happen here
    // $fboxstore.build()
    if (!emails) {
      window.parent.location.href = common.redirectUrl();
    } else {
      if ($settingstore) {
        $settingstore.email = emails[0] as string
      }
    }
  };

  init();
  onMount(() => {
    // @ts-ignore
    $settingstore = window.settings as iSettings;
  });
</script>

<main class="flex flex-col gap-2 p-2 max-w-[480px] mx-auto text-sm">
  <div class="aspect-[730/292] overflow-hidden">
    {#await init()}
      <Skeleton class="w-full rounded h-full" />
    {:then _}
      <img
        src={$fboxstore.getSingleBanner()}
        class="w-full rounded object-cover aspect-[730/292]"
        alt="top banner"
      />
    {:catch error}
      <p style="color: red">{error.message}</p>
    {/await}
  </div>
  <div class="flex items-center justify-between gap-2">
    <div class="flex items-center justify-center gap-2">
      <div class="flex flex-col items-center">
        <p class="font-bold uppercase text-muted-foreground">position</p>
        <span class="text-xs font-bold">1</span>
      </div>
      <div class="flex flex-col items-center">
        <p class="font-bold uppercase text-muted-foreground">score</p>
        <span class="text-xs font-bold">2654</span>
      </div>
      <div class="flex flex-col items-center">
        <p class="font-bold uppercase text-muted-foreground">date</p>
        <span class="text-xs font-bold">May 2, 2024</span>
      </div>
    </div>
    <div class="flex flex-col items-center">
      <p class="font-bold uppercase text-muted-foreground">Welcome</p>
      {#if $settingstore?.email}
        <span class="text-xs font-bold">{emailPrefix($settingstore.email)}</span>
      {:else}
        <Skeleton class="h-4 w-full" />
      {/if}
    </div>
  </div>
  <!-- <Skeleton class="aspect-square max-h-[300px]" /> -->
  <div class="w-full rounded-lg overflow-hidden">
    <Tabs />
  </div>
  <div class="flex items-center gap-2">
    <Skeleton class="h-10 w-[100px]" />
    <Skeleton class="h-10 w-[100px]" />
    <Skeleton class="h-10 w-[100px]" />
  </div>
  <Skeleton class="h-6 w-3/4 self-center" title="ended last" />
  <div class="flex flex-col gap-2" title="voucher card">
    <Skeleton class="aspect-[312/160] w-full self-center" />
    <Skeleton class="aspect-[312/160] w-full self-center" />
    <Skeleton class="aspect-[312/160] w-full self-center" />
  </div>
  <h2 class="h-10 w-full bg-white uppercase font-medium text-center">all games</h2>
  {#await init()}
    <div class="grid grid-cols-4 gap-2" title="games">
      <Skeleton class="aspect-[70/96] w-full" title="game" />
      <Skeleton class="aspect-[70/96] w-full" title="game" />
      <Skeleton class="aspect-[70/96] w-full" title="game" />
      <Skeleton class="aspect-[70/96] w-full" title="game" />
    </div>
  {:then _}
  <div class="grid grid-cols-4 gap-2">
    {#each $fboxstore.getGames() as {name, image, url} (name)}
			<a href={url} class="w-full aspect-[70/96] flex flex-col items-center">
        <img src={image} class="w-full" alt={name}/>
        <p>{name}</p>
      </a>
		{/each}
  </div>
  {:catch error}
    <p style="color: red">{error.message}</p>
  {/await}
  <h2 class="h-10 w-full bg-white uppercase font-medium text-center">Other offers and best deals</h2>
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
  {#await init()}
  <div class="grid grid-cols-4 gap-2" title="freelinks">
    <Skeleton class="aspect-square w-full" title="freelink" />
    <Skeleton class="aspect-square w-full" title="freelink" />
    <Skeleton class="aspect-square w-full" title="freelink" />
    <Skeleton class="aspect-square w-full" title="freelink" />
  </div>
  {:then _}
  <div class="grid grid-cols-4 gap-2">
    {#each $fboxstore.getUserneeds() as {name, image, url} (image)}
      <a href={url} class="w-full aspect-square flex flex-col items-center">
        <img src={image} class="w-full rounded" title={name} alt={name}/>
        {#if name}
          <p>{name}</p>
        {/if}
      </a>
    {/each}
  </div>
  {:catch error}
    <p style="color: red">{error.message}</p>
  {/await}
  <h2 class="h-10 w-full bg-white uppercase font-medium text-center">Top  deals</h2>
  <Carousel />
</main>
