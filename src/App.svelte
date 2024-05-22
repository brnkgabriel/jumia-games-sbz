<script lang="ts">
  import "./app.css";
  import Carousel from "./lib/components/widgets/Carousel.svelte";
  import Tabs from "./lib/components/widgets/Tabs.svelte";
  import { Skeleton } from "./lib/components/ui/skeleton";
  import { common } from "./lib/common/index";
  import type { iSettings } from "./lib/interfaces/index";
  import { remotestore, settingstore, fboxstore } from "$lib/stores";
  import { onMount } from "svelte";
  import Games from "$lib/components/partials/Games.svelte";
  import DoubleBanners from "$lib/components/partials/DoubleBanners.svelte";
  import TopBanner from "$lib/components/partials/TopBanner.svelte";
  import StatusBar from "$lib/components/partials/StatusBar.svelte";
  import Userneeds from "$lib/components/partials/Userneeds.svelte";
  import Prizes from "$lib/components/partials/Prizes.svelte";
  import Catalog from "$lib/components/partials/Catalog.svelte";


  let convexclient

  const init = async () => {
    const emails = await common.getCredentials();

    await $fboxstore.setRemotestore();

    // build is not supposed to happen here
    // $fboxstore.build()
    if (!emails) {
      window.location.href = common.redirectUrl();
    } else {
      if ($settingstore) {
        $settingstore.email = emails[0] as string;
      }
    }
  };

  init();
  onMount(() => {
    // @ts-ignore
    $settingstore = window.settings as iSettings;

    // @ts-ignore
    convexclient = window.convexclient

    console.log({ convexclient })
  });
</script>

<main class="flex flex-col gap-2 p-2 max-w-[480px] mx-auto text-sm">
  <a href="https://jumia.com.ng/customer/account/login/?return=https://jumia.com.ng/mlp-hextris" class="p-4 bg-[#ff9900] text-center font-bold text-white">Login</a>
  <!-- <div class="aspect-[730/292] overflow-hidden">
    {#if $remotestore}
      <TopBanner {init} />
    {/if}
  </div> -->
  <StatusBar />
  <div class="w-full rounded-lg overflow-hidden">
    <Tabs />
  </div>
  {#if $remotestore}
    <Prizes {init} />
  {/if}
  <!-- {#if $remotestore && $fboxstore.show().games}
    <Games {init} />
  {/if}
  <h2
    class="h-10 w-full bg-white uppercase font-medium text-center flex items-end justify-center"
  >
    Other offers and best deals
  </h2>
  {#if $remotestore && $fboxstore.show().doubleBanners}
    <DoubleBanners {init} />
  {/if}
  {#if $remotestore && $fboxstore.show().userneeds}
    <Userneeds {init} />
  {/if}
  {#if $remotestore && $fboxstore.show().catalog}
    <Catalog {init} />
  {/if} -->
</main>
