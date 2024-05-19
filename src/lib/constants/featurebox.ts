import { get } from "svelte/store"
import { remotestore, settingstore } from "$lib/stores"
import type { iRemoteData, iSKU, iSettings } from "$lib/interfaces"
import { eConstants, eFeaturebox, eQueries } from "."
import { Util } from "./utils"
import { googleSheetsApi } from "$lib/common/config"

export class Featurebox extends Util {
  constructor() {
    super()
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
      const userneeds = this.getList(eConstants.INITIATIVE, eConstants.USERNEED, data)
      const skus = this.getList(eConstants.INITIATIVE, eConstants.FBSKUS, data)
      const games = this.getList(eConstants.INITIATIVE, eConstants.GAMES, data)
      const configList = this.getList(eConstants.INITIATIVE, eConstants.CONFIG, data)
      const config = configList[0] ? this.strToJSON(configList[0].name) : {}
      const value = { userneeds, skus, games, config, prizes }
      remotestore.set(value)
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

  async build() {
    const data = get(remotestore) as iRemoteData
    const { userneeds, games, skus, config } = data

    const showGames =  config[eFeaturebox.DISPLAYGAMES]
    const showFeatureBoxTitle = config[eFeaturebox.DISPLAYFEATUREBOXTITLE]
    const showDoubleBanners = config[eFeaturebox.DISPLAYDOUBLEBANNER]
    const showCollectionIcons = config[eFeaturebox.DISPLAYCOLLECTIONICONS]
    const showCatalog = config[eFeaturebox.DISPLAYCATALOG]

    if (showGames === eFeaturebox.YES) {
      console.log("show games")
    }
    if (showFeatureBoxTitle === eFeaturebox.YES) {
      console.log("show featurebox title")
    }

    if (showDoubleBanners === eFeaturebox.YES) {
      console.log("show double banners")
    }

    if (showCollectionIcons === eFeaturebox.YES) {
      console.log("show collection icons")
    }
    console.log("show all showables")

    if (showCatalog === eFeaturebox.YES) {
      // const urls = skus.map(prd => this.getSKUUrl(prd.sku))
      // const skuList = await this.getskudata(urls) as unknown as iSKU[]
      // const products = skuList ? skuList.filter(sku => sku !== null) : []
      console.log("show all products")
      // console.log({ products })
    }
  }

  getSingleBanner() {
    const settings = get(settingstore) as iSettings
    const remotedata = get(remotestore) as iRemoteData
    const config = remotedata.config

    const game = settings.game.toLowerCase()
    const mkey = `${game}_mobile_banner`
    return config[mkey]
  }
  
  getSKUUrl(sku: string) {
    const isCatalog = sku.indexOf("https") !== -1
    if (isCatalog) {
      return sku
    }
    const domain = this.config[eConstants.COUNTRYDOMAIN]
    return domain === eConstants.ZANDOTLD
      ? `https://www.zando.co.za/catalog/?q=${sku}`
      : `https://www.jumia${domain}/catalog/?q=${sku}`
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

  async getskudata(urls: string[]) {
    try {
      const promises = await Promise.all(
        urls.map(async (url) => await this.getSKU(url))
      )
      const docs = promises.flat()
      return docs
    } catch (error) {
      this.onError(error)
      return null
    }
  }

  otherMarkets(textCont: string) {

    const startIdx = textCont.indexOf('"products":[{')
    const regex = /"selectedVariation":"([a-zA-Z0-9-]+)"}/
    const regExIdx = this.findRegexIndex(textCont, regex) as number
    let closeIdx = -1



    if (regExIdx > -1) {

      const substr1 = textCont.substring(regExIdx, textCont.length)
      // 3 is the index of the character after }]}
      closeIdx = substr1.indexOf("}]") + 2
    }
    const eIdx = regExIdx + closeIdx
    return '{' + textCont.substring(startIdx, eIdx) + '}'
  }

  zandoMarket(textCont: string) {

    const startIdx = textCont.indexOf('"products":[{')
    const productsStr = '{' + textCont.substring(startIdx, textCont.length)

    const closingBraces = this.braceIndices(productsStr, this.escapeStr("}],"))
    const endIdx = closingBraces[closingBraces.length - 2]
    return productsStr.substring(0, endIdx + 2) + '}'
  }

  mobile(raw_products: string) {
    var start = raw_products.indexOf('"products":')
    var products = '{' + raw_products.substring(start, raw_products.length)
    var l_idx = products.indexOf(',"head"')
    return products.substring(0, l_idx - 1) + '}'
  }

  desktop(raw_products: string) {
    var start = raw_products.indexOf('"products":')
    var products = '{' + raw_products.substring(start, raw_products.length)
    var closing_brace_indices = this.braceIndices(products, this.escape("}]"))
    var last_idx = closing_brace_indices[closing_brace_indices.length - 1]
    return products.substring(0, last_idx + 2) + '}'
  }
  escape(str: string) {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
  }

  // format(raw_products: string) {
  //   return innerWidth > 600 ? this.desktop(raw_products) : this.mobile(raw_products)
  // }

  async getSKU(url: string) {
    const response = await fetch(url)
    const textCont = await response.text()


    // const settings = this.singleton.getSettings()
    // let products = settings.country === "za" ? this.zandoMarket(textCont) : this.otherMarkets(textCont)

    // try {
    //   const products = this.getProducts(textCont)
    //   const formatted = this.mobile(products)
    //   const parsed = JSON.parse(formatted).products
    //   return parsed
    // } catch (error) {
    //   this.onError(error)
    //   return []
    // }
  }

  getProducts(data: string) {
    // this.fetched.innerHTML = data;
    // const textC: string[] = []
    // const scripts = this.fetched.querySelectorAll('script')
    // this.fetched.innerHTML = ''
    // scripts.forEach(script => textC.push(script.innerHTML))
    // const foundIdx = textC.findIndex(script => script.indexOf('"products":[{') !== -1) 
    // return textC[foundIdx]
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