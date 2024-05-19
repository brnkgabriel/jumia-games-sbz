import { writable } from "svelte/store";
import type { iSettings, iRemoteData } from "$lib/interfaces/index"
import { Featurebox, fbox } from "$lib/constants/featurebox";

const remotestore = writable<iRemoteData | undefined>()

const settingstore = writable<iSettings | undefined>()

const fboxstore = writable<Featurebox>(fbox)

const emailstore = writable<string | undefined>()

export { remotestore, settingstore, fboxstore }