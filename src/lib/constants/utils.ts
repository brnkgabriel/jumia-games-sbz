import { get } from "svelte/store"
import { remotestore, settingstore } from "$lib/stores"
import type { iRemoteData, iSettings } from "$lib/interfaces"
import { eConstants } from "."

export class Util {
  public all = (query: string, parent?: HTMLElement) => parent ? parent.querySelectorAll(query) : document.querySelectorAll(query)
  public el = (query: string, parent?: HTMLElement) => parent ? parent.querySelector(query) : document.querySelector(query)
  protected minutesInADay: number = 1440
  protected minutesInMs: number = 60000
  protected numberExtract = (str: string) => Number(str.replace(/,/g, '').match(/\d+(\.\d+)?/g))
  protected isMobile: boolean = navigator.userAgent.toLowerCase().includes("mobi")
  protected regExReplace = (str: string) => str.replace(/\"|\,/g, '')
  protected getData = (key: string, value: string, list: Record<string, any>[]) => list.filter(item => {
    if (item[key]) {
      return item[key].toLowerCase() == value.toLowerCase()
    }
    return false
  })
  protected setLs = (key: string, data: Record<string, any>) => localStorage.setItem(key, JSON.stringify(data))
  protected getLs = (key: string) => JSON.parse(localStorage.getItem(key) as string)
  protected categoryId = (category: string) => `cat-${this.id(category, "-")}`
  protected getCategories = (data: Record<string, any>[]) => ([...new Set(data.map(datum => datum.category))])
  protected num2Array = (num: number) => Array.from(Array(num).keys())
  protected midnight = (timestamp?: number) => timestamp ? new Date(timestamp).setHours(0, 0, 0, 0) : new Date().setHours(0, 0, 0, 0)
  protected randomize = (list: Record<string, any>[]) => list.sort(() => Math.random() - 0.5)
  protected randomBtw2Nos = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min)
  protected isPast = (time: number) => Date.now() > time && Date.now() > this.endTime(time)
  protected isFuture = (time: number) => Date.now() < time
  protected isLive = (time: number) => Date.now() >= time && Date.now() < this.endTime(time)

  protected onError = (error: any) => console.trace(error.message)

  protected endTime = (time: number) => {
    const config = get(remotestore) as iRemoteData
    const settings = get(settingstore) as iSettings

    const minuteDuration = this.minDuration()
    console.log({ minuteDuration })
    return time + (minuteDuration * 60 * 1000)
  }
  protected pad = (time: number) => time.toString().length == 1 ? '0' + time : time
  protected dateUtils = new DateUtils()

  public getDate = () => this.dateUtils.getDate()


  constructor() {
  }

  minDuration() {
    const settings = get(settingstore) as iSettings
    const remotedata = get(remotestore) as iRemoteData
    const { config } = remotedata
    const keyStr = `${eConstants.MINDURATION}_${settings.game}`
    const gameDuration = config[keyStr]
    return Number(gameDuration)
  }

  reduceProp(acc: Record<string, any>, prop: string) {
    const key_val = prop.split('==')
    const key = key_val[0]
    acc[key] = key_val[1] ? key_val[1].toLocaleString() : key_val[1]
    return acc
  }

  getConfig(list: any[]) {
    const configObj = list[0]
    const str = configObj ? configObj.name : ""
    const replaced = this.regExReplace(str)
    const props = replaced.split('|')
    return props.reduce(this.reduceProp.bind(this), {})
  }

  id(name: string, delim: string) {
    const replaceApostrophe = this.replacePattern("'", name)
    const replaceAmpersand = this.replacePattern("&", replaceApostrophe)
    const replacePercent = this.replacePattern("%", replaceAmpersand)
    return replacePercent.toLowerCase().split(" ").join(delim)
  }

  replacePattern(pattern: string | RegExp, str: string) {
    const re = new RegExp(pattern, "g")
    return str.replace(re, "-")
  }

  toggle(toRemove: NodeListOf<Element>, toAdd: HTMLElement, className: string) {
    toRemove.forEach(el => el.classList.remove(className))
    toAdd.classList.add(className)
  }

  pastFutureLiveTimes(times: number[]) {
    const past = times.filter(this.isPast).sort((a, b) => a - b)
    const future = times.filter(this.isFuture).sort((a, b) => a - b)
    const live = times.filter(this.isLive).sort((a, b) => a - b)
    return { past, future, live }
  }

  getTimes(data: Record<string, any>[]) {
    const times = data.map(datum => +new Date(datum.time))
    return [...new Set(times)]
  }

  reorderTime(data: Record<string, any>[]) {
    const times = this.getTimes(data)
    const { past, future, live } = this.pastFutureLiveTimes(times)
    const all = [...live, ...future, ...past]
    return { past, future, live, all }
  }

}

class DateUtils {
  constructor() {

  }

  timeUnits(time: number) {
    const _date = new Date(time);
    const day = _date.getDay();
    const month = _date.getMonth();
    const date = _date.getDate();
    const hr = _date.getHours();
    const mn = _date.getMinutes();
    return { day, month, date, hr, mn };
  }

  notLiveTimes(time: number) {
    return { time, isFirst: false, isLive: false }
  }
  liveTimes(time: number, idx: number) {
    return { time, isFirst: idx === 0, isLive: idx === 0 }
  }

  twelveHrFormat(hr: number, mn: number): string {
    const pad = (num: number) => (num < 10 ? '0' + num : num.toString());

    if (hr === 12) return pad(hr) + ':' + pad(mn) + 'pm';
    else if (hr > 12) return pad(hr - 12) + ':' + pad(mn) + 'pm';
    else if (hr === 0) return '12:' + pad(mn) + 'am';
    else return pad(hr) + ':' + pad(mn) + 'am';
  }

  dayDiff(time: number): number {
    const time_date = new Date(time).getDate();
    return new Date().getDate() - time_date;
  }

  sameMonth(time: number): boolean {
    return new Date(time).getMonth() === new Date().getMonth();
  }

  capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  fullDate(time: number): string {
    const date = new Date(time);
    const mnth = date.toLocaleDateString("en-US", { month: 'short' });
    const day = date.toLocaleDateString("en-US", { weekday: 'short' });
    return day + ' ' + mnth + ' ' + date.getDate();
  }

  date(time: number): string {
    const day_diff = this.dayDiff(time);

    if (day_diff === 0 && this.sameMonth(time)) {
      return this.capitalize('today');
    } else if (day_diff === 1 && this.sameMonth(time)) {
      return this.capitalize('yesterday');
    } else if (day_diff === -1 && this.sameMonth(time)) {
      return this.capitalize('tomorrow');
    } else {
      return this.fullDate(time);
    }
  }

  getDate() {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${year}-${month}-${day}`
  }
}