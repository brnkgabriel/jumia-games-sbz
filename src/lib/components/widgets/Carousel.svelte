<script lang="ts">
  import * as Carousel from "$lib/components/ui/carousel/index.js";
    import type { iSKU } from "$lib/interfaces";
    import {Button} from "../ui/button";

  export let products: iSKU[] = []
</script>
<Carousel.Root
  opts={{
    align: "start",
    duration: 200
  }}
  class="w-full mx-auto"
>
  <Carousel.Content>
    {#each products as product (product.name)}
      <Carousel.Item class="basis-2/3">
        <a href={product.url} class="relative flex flex-col gap-1 overflow-hidden w-full rounded">
          <div class="relative w-full">
            {#if product.badges}
              {#if product.badges.campaign}
                <img class="absolute top-2 left-2 h-[18px]" src={product.badges.campaign.image} alt={product.badges.campaign.name}/>
              {/if}
              {#if product.badges.main}
                <Button href={product.badges.main.url} variant="officialstore">{product.badges.main.name}</Button>
              {/if}
            {/if}
            <img class="w-full object-cover" src={product.image} alt={product.name} title={product.name}/>
          </div>
          <p class="two-lines">{product.name}</p>
          <div>
            <h3 class="font-semibold text-lg">{product.prices.price}</h3>
            {#if product.prices.oldPrice}
              <h3 class="line-through text-muted-foreground">{product.prices.oldPrice}</h3>
            {/if}
          </div>
          <Button variant="jumia">add to cart</Button>
        </a>
      </Carousel.Item>
    {/each}
  </Carousel.Content>
  <!-- <Carousel.Previous />
  <Carousel.Next /> -->
</Carousel.Root>