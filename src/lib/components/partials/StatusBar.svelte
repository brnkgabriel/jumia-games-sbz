<script lang="ts">
    import { Skeleton } from "../ui/skeleton";
    import { settingstore } from "$lib/stores";

    const emailPrefix = (email: string) => email.split("@")[0];

</script>

<div class="flex items-center justify-between gap-2">
  <div class="flex flex-col items-center">
    <p class="font-bold uppercase text-muted-foreground">Welcome</p>
    {#if $settingstore?.email}
      <span class="text-xs font-bold">{emailPrefix($settingstore.email)}</span
      >
    {:else}
      <Skeleton class="h-4 w-full" />
    {/if}
  </div>
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
</div>