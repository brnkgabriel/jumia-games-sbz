<script lang="ts">
  import * as Tabs from "../ui/tabs/index.js";
  import { Card } from "../ui/card/index.js";
  import type { iPrize } from "$lib/interfaces/index.js";
  import { format } from "$lib/common/index.js";

  export let map: Map<number, iPrize[]>; 
  const firstKey = map.keys().next().value
  const firstValue = `id-${firstKey}`
  const list = Array.from(map.entries())
  console.log({ list })
</script>

<Tabs.Root value={firstValue} class="w-full">
  <Tabs.List class="grid grid-flow-col auto-cols-max gap-2">
    {#each Array.from(map.entries()) as [key, value] (key)}
      <Tabs.Trigger value={`id-${key}`}>{format(new Date(key), "MMM DD, YYYY")}</Tabs.Trigger>
    {/each}
  </Tabs.List>
  
  {#each Array.from(map.entries()) as [key, value] (key)}
    <Tabs.Content value={`id-${key}`} class="h-fit max-h-[300px] overflow-auto">
      {#each value as item, i}
      <Card class="aspect-[312/160] w-full grid grid-cols-2 gap-2 p-2 first:mt-0 last:mb-0 my-2">
        <img class="w-full object-cover" src={item.image} alt={item.name}/>
        <div class="flex flex-col gap-2">
          <p class="font-medium">{item.name}</p>
          <p class="text-muted-foreground">{item.desc}</p>
        </div>
      </Card>
      {/each}
    </Tabs.Content>
  {/each}
</Tabs.Root>
