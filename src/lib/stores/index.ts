import { writable } from "svelte/store";
import type { iSettings, iRemoteData } from "$lib/interfaces/index"
import { Featurebox, fbox } from "$lib/constants/featurebox";
import { eConstants } from "$lib/constants";

const remotestore = writable<iRemoteData | undefined>()
const initialValue = {
  country: "ng",
  credentials: null,
  email: "",
  game: "hextris",
  language: "en"
}
const getInitialValue = () => {
  const storedValue = localStorage.getItem(eConstants.SETTINGS)
  return storedValue ? JSON.parse(storedValue) : initialValue
}
const settingstore = writable<iSettings>(getInitialValue())

const fboxstore = writable<Featurebox>(fbox)

const emailstore = writable<string | undefined>()

const convexstore = writable<any>()
settingstore.subscribe(value => {
  localStorage.setItem(eConstants.SETTINGS, JSON.stringify(value))
})

export { remotestore, settingstore, fboxstore }

