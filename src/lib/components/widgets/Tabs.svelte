<script lang="ts">
  import * as Tabs from "../ui/tabs/index.js";
  import * as Card from "../ui/card/index.js";
  import { Button } from "../ui/button/index.js";
  import { Input } from "../ui/input/index.js";
  import { Skeleton } from '../ui/skeleton'
  import DataTable from '../table/data-table.svelte'
</script>
 
<Tabs.Root value="game" class="w-full">
  <Tabs.List class="grid w-full grid-cols-2">
    <Tabs.Trigger value="game">Game</Tabs.Trigger>
    <Tabs.Trigger value="leaderboard">Leaderboard</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="game" class="w-full">
    <iframe title="hextris" src="https://static-cms-cdn.netlify.app/hextris/" class="border-none rounded-lg w-full aspect-square"></iframe> 
    <div class="flex items-center justify-center gap-2 mt-2">
      <Skeleton class="w-16 h-10" />
      <Skeleton class="w-16 h-10" />
    </div>
  </Tabs.Content>
  <Tabs.Content value="leaderboard">
    <DataTable />
  </Tabs.Content>
</Tabs.Root>
