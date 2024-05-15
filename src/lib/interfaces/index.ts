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
}
