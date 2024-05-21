import { Util } from "./utils"

export class Products extends Util {
  constructor() {
    super()
  }

  getProducts(ref: HTMLElement) {
    const textC: string[] = []
    const scripts = ref.querySelectorAll('script')
    console.log({ scripts, ref })
    ref.innerHTML = ''
    scripts.forEach(script => textC.push(script.innerHTML))
    const foundIdx = textC.findIndex(script => script.indexOf('"products":[{') !== -1)
    return textC[foundIdx]
  }

  async getSKU(url: string) {
    const response = await fetch(url)
    const textCont = await response.text()

    return textCont

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

  braceIndices(str: string, brace: string) {
    let regex = new RegExp(brace, "gi"), result, indices = []
    while ((result = regex.exec(str))) {
      // @ts-ignore
      indices.push(result.index)
    }
    return indices
  }

  escape(str: string) {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
  }
}