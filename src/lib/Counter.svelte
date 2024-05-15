<script lang="ts">
  import { cn } from './utils'
  let count: number = 0
  export let classes: string = ""
  const increment = () => {
    count += 1
  }
</script>

<button on:click={increment} class={cn(classes)}>
  count is {count}
</button>

pnpm dlx shadcn-svelte@latest add table
pnpm install -D svelte-headless-table