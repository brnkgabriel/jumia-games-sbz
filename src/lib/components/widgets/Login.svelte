<script lang="ts">
  import { Input } from "../ui/input";
  import { Button } from "../ui/button";
  import { settingstore } from "$lib/stores";
  import type { iCredentials } from "$lib/interfaces";

  const onSubmit = (evt: SubmitEvent) => {
    evt.preventDefault();
    const form = evt.target as HTMLFormElement;
    const formData = new FormData(form);
    const entries = formData.entries();
    const json = Object.fromEntries(entries);
    console.log({ json });
    $settingstore.credentials = json as unknown as iCredentials;
  };
</script>

<form action="" on:submit={onSubmit} class="flex flex-col gap-2 items-center">
  <h2 class="font-semibold text-lg">Enter your details</h2>
  <Input placeholder="Name" name="name" required />
  <Input placeholder="Email" type="email" name="email" required />
  <Button class="w-full" type="submit">Proceed</Button>
</form>
