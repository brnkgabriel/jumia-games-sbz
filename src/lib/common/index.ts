import { eConstants, eFeaturebox } from "$lib/constants/index"
import type { TCountry, TGame, TLanguage, iSettings } from "$lib/interfaces/index";
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
  constructor() { }

  setSettings(settings: iSettings) {
    this.#game = settings.game
    this.#language = settings.language
    this.#country = settings.country
  }

  async records() {
    const url = googleSheetsApi[this.#country]
    try {
      const response = await fetch(url)
      const json = await response.json()
      const data = json.records

      const userneeds = this.get(eConstants.INITIATIVE, eConstants.USERNEED, data)
      const skus = this.get(eConstants.INITIATIVE, eConstants.FBSKUS, data)
      const games = this.get(eConstants.INITIATIVE, eConstants.GAMES, data)
      const configList = this.get(eConstants.INITIATIVE, eConstants.CONFIG, data)
      const config = configList[0] ? this.strToJSON(configList[0].name) : {}
      console.log({ userneeds, skus, games, config })
    } catch (error: any) {
      return {}
    }
  }

  get(key: string, value: string, list: Record<string, any>[]) {
    return list.filter(item => {
      if (item[key]) {
        return item[key].toLowerCase() == value.toLowerCase()
      }
      return false
    })
  }

  strToJSON(str: string) {
    var replaced = this.regExReplace(str)
    var props = replaced.split('|')
    return props.reduce(this.reduceProp.bind(this), {})
  }
    
  reduceProp(arr, prop) {
    var key_val = prop.split('==')
    var key = key_val[0]
    arr[key] = key_val[1] ? key_val[1].toLocaleString() : key_val[1]
    return arr
  }
  
  regExReplace(str: string) { return str.replace(/\"|\,/g, '') }
}

export const common = new Common();
export const featurebox = new Featurebox()