import { eConstants, eFeaturebox } from "$lib/constants/index"
import type { TCountry, TGame, TLanguage, iSettings } from "$lib/interfaces/index";
import { googleSheetsApi } from "./config";
import { remotestore, settingstore } from "$lib/stores/index";
import { get } from "svelte/store";

class Common {
  async getCredentials() {
    try {
      const url = new URL(location.href);
      const res = await fetch(`${url.origin}/customer/account/index/`);
      const text = await res.text();
      let emails = this.extractEmails(text);
      return emails;
    } catch (error: any) {
      return null;
    }
  }

  extractEmails(str: string) {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi;
    return str.match(emailRegex);
  }

  redirectUrl() {
    const url = new URL(location.href)
    return `${url.origin}/customer/account/login/?return=${url.origin}%2F${url.pathname}%2F`
  }

  getData = (key: string, value: string, list: Record<string, any>[]) => list.filter(item => {
    if (item[key]) {
      return item[key].toLowerCase() == value.toLowerCase()
    }
    return false
  })
}

export const common = new Common();