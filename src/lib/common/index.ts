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

  emailPrefix = (email: string) => email.split("@")[0];
  
  extractEmails(str: string) {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi;
    return str.match(emailRegex);
  }

  redirectUrl() {
    const url = new URL(parent.location.href)
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

type FormatToken = 'YYYY' | 'MM' | 'MMM' | 'DD' | 'HH' | 'mm' | 'ss';

export function format(date: Date, format: string): string {
  const months: string[] = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const tokens: Record<FormatToken, string> = {
      YYYY: date.getFullYear().toString(),
      MM: String(date.getMonth() + 1).padStart(2, '0'), // Months are zero-indexed
      MMM: months[date.getMonth()],
      DD: String(date.getDate()).padStart(2, '0'),
      HH: String(date.getHours()).padStart(2, '0'),
      mm: String(date.getMinutes()).padStart(2, '0'),
      ss: String(date.getSeconds()).padStart(2, '0'),
  };

  // Ensure `MMM` is processed before `MM` to avoid partial replacements
  return format.replace(/YYYY|MMM|MM|DD|HH|mm|ss/g, (match) => tokens[match as FormatToken]);
}
