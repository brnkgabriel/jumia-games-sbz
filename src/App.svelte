
<script lang="ts">
  import "./app.css";
  import Counter from './lib/Counter.svelte'
  import Carousel from './lib/components/widgets/Carousel.svelte'
  import Tabs from './lib/components/widgets/Tabs.svelte'
  import { Skeleton } from './lib/components/ui/skeleton'
  import { common } from './lib/common/index'
  import type { iSettings } from './lib/interfaces/index'
  import { featurebox } from "./lib/common/index";

  const init = async () => {
    const emails = await common.getCredentials()
    // @ts-ignore
    const settings = window.settings as iSettings
    
    console.log({ emails, settings, from: "2" })
    const data = await featurebox.records()
    if (!emails) {
      window.parent.location.href = common.redirectUrl()
    }
  }

 init()
</script>


<main class="flex flex-col gap-2 p-2  max-w-[480px] mx-auto">
  <Skeleton class="w-full aspect-[730/292] rounded" />
  <div class="flex items-center justify-between gap-2">
    
    <div class="flex items-center justify-center gap-2">
      <Skeleton class="h-4 w-16" />
      <Skeleton class="h-4 w-16" />
      <Skeleton class="h-4 w-16" />
    </div>
    <Skeleton class="h-10 w-[160px]" />
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
  <Skeleton class="h-10 w-full" title="all games" />
  <div class="grid grid-cols-4 gap-2" title="games">
    <Skeleton class="aspect-[70/96] w-full" title="game" />
    <Skeleton class="aspect-[70/96] w-full" title="game" />
    <Skeleton class="aspect-[70/96] w-full" title="game" />
    <Skeleton class="aspect-[70/96] w-full" title="game" />
  </div>
  <Skeleton class="h-10 w-full" title="other offers and best deals" />
  <div class="grid grid-cols-2 gap-2" title="offers">
    <Skeleton class="aspect-[148/122] w-full" title="banner 1" />
    <Skeleton class="aspect-[148/122] w-full" title="banner 2" />
  </div>
  <div class="grid grid-cols-4 gap-2" title="freelinks">
    <Skeleton class="aspect-square w-full" title="freelink" />
    <Skeleton class="aspect-square w-full" title="freelink" />
    <Skeleton class="aspect-square w-full" title="freelink" />
    <Skeleton class="aspect-square w-full" title="freelink" />
  </div>
  <Skeleton class="h-10 w-full" title="Top deals" />
  <Carousel />
</main>
