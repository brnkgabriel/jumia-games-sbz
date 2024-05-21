export type TCountry =
  | 'ng'
  | 'eg'
  | 'ke'
  | 'ci'
  | 'ma'
  | 'gh'
  | 'tn'
  | 'sn'
  | 'dz'
  | 'za'
  | 'ug';

export type TLanguage = 'en' | 'fr' | 'ar';

export type TGame = 'hextris' | 'puzzle';

export interface iSettings {
  country: TCountry;
  language: TLanguage;
  game: TGame;
  email: string
}

export interface iRemoteData {
  userneeds: iGameAndUserneed[],
  skus: iCatalog[],
  games: iGameAndUserneed[],
  config: Record<string, any>,
  prizes: iPrize[],
  products: iSKU[]
}

export interface iCatalog {
  sku: string;
  initiative: string;
}

export interface iGameAndUserneed {
  name: string;
  image: string;
  url: string;
  initiative: string;
}

export interface iPrize {
  sku: string;
  name: string;
  desc: string;
  units: string;
  category: string;
  url: string;
  image: string;
  value: string;
  type: string;
  time: string;
  initiative: string;
}


export interface iSKU {
  sku: string;
  name: string;
  displayName: string;
  brand: string;
  sellerId: number;
  isShopExpress?: boolean;
  categories: string;
  prices: iPrice;
  tags: string;
  rating?: iRating,
  image: string;
  url: string;
  badges?: {
    campaign: iCampaign;
    main: iMain;
  },
  isBuyable: boolean
  shopExpress?: {
      title: string;
  },
  shopGlobal?: iGlobal,
  simples?: iSimple[],
  selectedVariation?: string;
  variationSelection?: boolean;
}

export interface iGlobal {
identifier: string,
name: string
}

export interface iPrice {
discount: string;
oldPrice: string;
oldPriceEuro: string;
price: string;
priceEuro: string;
rawPrice: string;
taxEuro: string;
}

export interface iRating {
average: number;
totalRatings: number;
}
export interface iSimple {
  sku: string;
  loginUrl: string;
  isBuyable: boolean;
  name: string;
  prices: iPrice
}

export interface iMain {
  name: string;
  identifier: string;
  url: string;
}

export interface iCampaign {
  name: string;
  identifier: string;
  image: string;
  url: string;
  bgColor: string;
  txtColor: string;
}

export type FormatToken = 'YYYY' | 'MM' | 'MMM' | 'DD' | 'HH' | 'mm' | 'ss';