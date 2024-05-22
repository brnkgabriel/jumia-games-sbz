import { writable } from "svelte/store";
import type { iSettings, iRemoteData } from "$lib/interfaces/index"
import { Featurebox, fbox } from "$lib/constants/featurebox";

const remotestore = writable<iRemoteData | undefined>()

const settingstore = writable<iSettings>({
  country: "ng",
  credentials: null,
  email: "",
  game: "hextris",
  language: "en"
})

const fboxstore = writable<Featurebox>(fbox)

const emailstore = writable<string | undefined>()

const convexstore = writable<any>()

export { remotestore, settingstore, fboxstore }