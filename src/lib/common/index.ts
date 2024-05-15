import { eFeaturebox } from "$lib/constants/index"
import type { TCountry, TGame, TLanguage, iSettings } from "$lib/interfaces";
import { googleSheetsApi } from "./config";

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

class Featurebox {
  #game: TGame = "hextris";
  #language: TLanguage = "en";
  #country: TCountry = "ng"
  constructor() {}

  setSettings(settings: iSettings) {
    this.#game = settings.game
    this.#language = settings.language
    this.#country = settings.country
  }

  async get() {
    const url = googleSheetsApi[this.#country]
    try {
      const response = await fetch(url)
      const data = await response.json()
      console.log({data})

    } catch (error: any) {
      return {}
    }
  }
}

export const common = new Common();
export const featurebox = new Featurebox()