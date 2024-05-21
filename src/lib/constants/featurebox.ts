import { get } from "svelte/store"
import { remotestore, settingstore } from "$lib/stores"
import type { iPrize, iRemoteData, iSKU, iSettings } from "$lib/interfaces"
import { eConstants, eFeaturebox, eQueries } from "."
import { Util } from "./utils"
import { googleSheetsApi } from "$lib/common/config"
import { Products } from "./products"

export class Featurebox extends Util {
  #products: Products
  constructor() {
    super()

    this.#products = new Products()
  }

  async setRemotestore() {
    const settings = get(settingstore) as iSettings
    const country = settings.country
    const url = googleSheetsApi[country]

    try {
      const response = await fetch(url)
      const json = await response.json()
      const data = json.records

      const prizes = this.getList(eConstants.INITIATIVE, settings.game, data)
      // const userneeds = this.getList(eConstants.INITIATIVE, eConstants.USERNEED, data)
      // const skus = this.getList(eConstants.INITIATIVE, eConstants.FBSKUS, data)
      // const games = this.getList(eConstants.INITIATIVE, eConstants.GAMES, data)
      const configList = this.getList(eConstants.INITIATIVE, eConstants.CONFIG, data)
      const config = configList[0] ? this.strToJSON(configList[0].name) : {}
      const value = { config, prizes } as iRemoteData
      remotestore.set(value)
      return value
    } catch (error: any) {
      return {}
    }
  }

  getList(key: string, value: string, list: Record<string, any>[]) {
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
    
  reduceProp(arr: Record<string, any>, prop: string) {
    var key_val = prop.split('==')
    var key = key_val[0]
    arr[key] = key_val[1] ? key_val[1].toLocaleString() : key_val[1]
    return arr
  }

  show() {
    const { config } = this.configAndGameName()
    const games = config[eFeaturebox.DISPLAYGAMES] === eFeaturebox.YES ? true : false
    const title = config[eFeaturebox.DISPLAYFEATUREBOXTITLE] === eFeaturebox.YES ? true : false
    const doubleBanners = config[eFeaturebox.DISPLAYDOUBLEBANNER] === eFeaturebox.YES ? true : false
    const userneeds = config[eFeaturebox.DISPLAYCOLLECTIONICONS] === eFeaturebox.YES ? true : false
    const catalog = config[eFeaturebox.DISPLAYCATALOG] === eFeaturebox.YES ? true : false
    
    return { games, title, doubleBanners, userneeds, catalog }
  }

  configAndGameName() {
    const settings = get(settingstore) as iSettings
    const remotedata = get(remotestore) as iRemoteData
    const config = remotedata.config
    const game = settings.game.toLowerCase()
    return { game, config }
  }

  getSingleBanner() {
    const {game, config} = this.configAndGameName()
    const mkey = `${game}_mobile_banner`
    return config[mkey]
  }

  getGames() {
    const remotedata = get(remotestore) as iRemoteData
    return remotedata.games
  }

  getDoubleBanners() {
    const { config } = this.configAndGameName()
    const camp1Banner = config[eFeaturebox.CAMP1MDB]
    const camp1Url = config[eFeaturebox.CAMP1URL]
    const camp2Banner = config[eFeaturebox.CAMP2MDB]
    const camp2Url = config[eFeaturebox.CAMP2URL]
    const camp1 = { banner: camp1Banner, url: camp1Url }
    const camp2 = { banner: camp2Banner, url: camp2Url }
    return { camp1, camp2 }
  }

  getUserneeds() {
    const remotedata = get(remotestore) as iRemoteData
    return remotedata.userneeds
  }

  getPrizes() {
    const remotedata = get(remotestore) as iRemoteData
    const { prizes } = remotedata
    const times = prizes.map(prize => +new Date(prize.time))
    const unique = [...new Set(times)].sort((a, b) => a - b)

    const pastTimes = unique.filter(time => this.isPast(time))
    const liveTimes = unique.filter(time => this.isLive(time))
    const futrTimes = unique.filter(time => this.isFuture(time))

    const reordered = [...liveTimes, ...futrTimes, ...pastTimes ]
    
    const map: Map<number, iPrize[]> = new Map()

    reordered.forEach(time => {
      const filtered = prizes.filter(prize => +new Date(prize.time) === time)
      map.set(time, filtered)
    })

    console.log({ map })
    return map
  }

  async getProductsHtml() {
    const remotedata = get(remotestore) as iRemoteData
    const { skus } = remotedata
    const urls = skus.map(_ => _.sku)
    const texts = await this.getskudata(urls)

    console.log({ texts })
    return texts
  }

  async getskudata(urls: string[]) {
    try {
      const promises = await Promise.all(
        urls.map(async (url) => await this.#products.getSKU(url))
      )
      const docs = promises.flat()
      return docs
    } catch (error) {
      this.onError(error)
      return null
    }
  }

  getProducts(ref: HTMLElement) {
    const extractedProducts = this.#products.getProducts(ref)
    const formattedProducts = this.isMobile
    ? this.#products.mobile(extractedProducts)
    : this.#products.desktop(extractedProducts)
    const products = JSON.parse(formattedProducts).products as iSKU[]
    return products
  }

  isAtScrollEdge(products: HTMLElement) {
    return (products.scrollLeft + products.clientWidth + 100) >= products.scrollWidth
  }

  percent(rating: number) { return ((rating / 5) * 100).toFixed(2) }
  id(name: string) { return name.split(' ').join('-').toLowerCase() }
  badge(datum: iSKU) {
    if (datum?.badges) {
      const badges = Object.keys(datum?.badges).map(key => {
        var badge = (datum?.badges as Record<string, any>)[key]
        return key === 'main' ? `<span class="-badge -main -posabs -${this.id(badge?.name)}">${badge?.name}</span>` : `<img class="-badge -campaign -posabs lazy-image -loading" data-src="${badge?.image}" alt="badge"/>`
      })
      return badges.join('')
    } else return ''
  }

  escape(str: string) {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
  }

  findRegexIndex(str: string, regex: RegExp) {
    const match = str.match(regex) as RegExpMatchArray
    return match ? match.index : -1;
  }

  findEndIndex(str: string, regex: RegExp, regex2: RegExp) {
    let match = str.match(regex)
    match = !match ? str.match(regex2) : match
    const matchLen = match ? match[0].length : 0
    // we're subtracting one to exclude the comma from the regex
    let endIndex = -1
    if (match) {
      endIndex = (match.index as number) + matchLen - 1
    }
    return endIndex
  }

  braceIndices(str: string, brace: string) {
    let regex = new RegExp(brace, "gi"), result, indices = []
    while ((result = regex.exec(str))) {
      // @ts-ignore
      indices.push(result.index)
    }
    return indices
  }

  escapeStr(str: string) {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
  }
}

export const fbox = new Featurebox()