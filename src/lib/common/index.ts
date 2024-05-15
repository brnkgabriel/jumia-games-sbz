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
}

export const common = new Common();
