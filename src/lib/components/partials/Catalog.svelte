<script lang="ts">
  import type { iSKU } from "$lib";
  import { fboxstore, remotestore } from "$lib/stores";
  import { Skeleton } from "../ui/skeleton";
  import Carousel from "../widgets/Carousel.svelte"; 

  export let init: () => Promise<void>;

  let catalogRef: HTMLElement;
  let previousInnerHTML: string = "";

  let products: iSKU[] = [];

  $: products = products;

  $: {
    if (catalogRef && previousInnerHTML !== undefined) {
      const currentInnerHTML = catalogRef.innerHTML;
      if (currentInnerHTML !== previousInnerHTML) {
        previousInnerHTML = currentInnerHTML;
        products = $fboxstore.getProducts(catalogRef);
      }
    }
  }
</script>

<h2
  class="h-10 w-full bg-white uppercase font-medium text-center flex items-end justify-center"
>
  Top deals
</h2>
{#await init()}
  <div class="hidden"></div>
{:then _}
  {#await $fboxstore.getProductsHtml()}
    <div class="grid grid-cols-2 gap-2" title="offers">
      <Skeleton class="aspect-[148/122] w-full" title="banner 1" />
      <Skeleton class="aspect-[148/122] w-full" title="banner 2" />
    </div>
  {:then _}
    <div class="hidden overflow-hidden" title="fetched" bind:this={catalogRef}>
      {@html _}
    </div>
    <Carousel {products} />
  {:catch error}
    <p style="color: red">{error.message}</p>
  {/await}
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}
