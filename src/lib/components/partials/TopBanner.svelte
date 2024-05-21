<script lang="ts">
  import { fboxstore } from "$lib/stores";
  import { Skeleton } from "../ui/skeleton";

  export let init: () => Promise<void>;
</script>


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