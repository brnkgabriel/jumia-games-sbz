import { Util } from "./utils"

export class Products extends Util {
  constructor() {
    super()
  }

  getProducts(data: string) {
    // this.fetched.innerHTML = data;
    // const textC: string[] = []
    // const scripts = this.fetched.querySelectorAll('script')
    // this.fetched.innerHTML = ''
    // scripts.forEach(script => textC.push(script.innerHTML))
    // const foundIdx = textC.findIndex(script => script.indexOf('"products":[{') !== -1) 
    // return textC[foundIdx]
    return data
  }
  
  async getSKU(url: string) {
    const response = await fetch(url)
    const textCont = await response.text()

    try {
      const products = this.getProducts(textCont)
      const formatted = this.mobile(products)
      const parsed = JSON.parse(formatted).products 
      return parsed
    } catch (error) {
      this.onError(error)
      return []
    }
  }
  
  mobile(raw_products: string) {
    var start = raw_products.indexOf('"products":')
    var products = '{' + raw_products.substring(start, raw_products.length)
    var l_idx = products.indexOf(',"head"')
    return products.substring(0, l_idx - 1) + '}'
  }
}