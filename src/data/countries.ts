/**
 * Bundled learning data: continent groups, country display names and capitals.
 * Everything is offline; capital roles that need a note carry one.
 */

export type ContinentId =
  | 'africa'
  | 'asia'
  | 'europe'
  | 'north_america'
  | 'south_america'
  | 'oceania';

export type Country = {
  code: string;
  name: string;
  capital: string;
  note?: string;
  continent: ContinentId;
};

export type Continent = {
  id: ContinentId;
  name: string;
  /** Decorative silhouette path in a 0..100 box - never used as gameplay geometry. */
  silhouette: string;
  seed: number;
};

export const CONTINENTS: Continent[] = [
  {
    id: 'africa',
    name: 'Africa',
    silhouette: 'M50 4 L74 10 L82 30 L70 48 L66 70 L54 92 L44 78 L40 56 L28 40 L24 18 Z',
    seed: 1181,
  },
  {
    id: 'asia',
    name: 'Asia',
    silhouette:
      'M10 24 L40 10 L72 14 L92 30 L84 50 L62 56 L70 78 L52 88 L44 66 L24 60 L8 44 Z',
    seed: 2297,
  },
  {
    id: 'europe',
    name: 'Europe',
    silhouette:
      'M18 16 L48 8 L78 18 L88 38 L70 50 L74 72 L54 84 L40 68 L22 62 L10 40 Z',
    seed: 3389,
  },
  {
    id: 'north_america',
    name: 'North America',
    silhouette:
      'M14 12 L56 6 L88 20 L76 40 L62 44 L58 66 L46 92 L38 66 L30 46 L12 32 Z',
    seed: 4493,
  },
  {
    id: 'south_america',
    name: 'South America',
    silhouette: 'M38 6 L68 12 L78 32 L62 50 L58 72 L46 94 L36 72 L34 48 L24 28 Z',
    seed: 5581,
  },
  {
    id: 'oceania',
    name: 'Oceania',
    silhouette:
      'M20 30 L52 20 L82 28 L88 48 L66 62 L36 58 L16 48 Z M74 72 L88 68 L92 82 L78 88 Z',
    seed: 6679,
  },
];

export const COUNTRIES: Country[] = [
  // --- South America ---
  { code: 'AR', name: 'Argentina', capital: 'Buenos Aires', continent: 'south_america' },
  {
    code: 'BO',
    name: 'Bolivia',
    capital: 'Sucre',
    note: 'La Paz is the seat of government.',
    continent: 'south_america',
  },
  { code: 'BR', name: 'Brazil', capital: 'Brasilia', continent: 'south_america' },
  { code: 'CL', name: 'Chile', capital: 'Santiago', continent: 'south_america' },
  { code: 'CO', name: 'Colombia', capital: 'Bogota', continent: 'south_america' },
  { code: 'EC', name: 'Ecuador', capital: 'Quito', continent: 'south_america' },
  { code: 'GY', name: 'Guyana', capital: 'Georgetown', continent: 'south_america' },
  { code: 'PY', name: 'Paraguay', capital: 'Asuncion', continent: 'south_america' },
  { code: 'PE', name: 'Peru', capital: 'Lima', continent: 'south_america' },
  { code: 'SR', name: 'Suriname', capital: 'Paramaribo', continent: 'south_america' },
  { code: 'UY', name: 'Uruguay', capital: 'Montevideo', continent: 'south_america' },
  { code: 'VE', name: 'Venezuela', capital: 'Caracas', continent: 'south_america' },

  // --- Europe ---
  { code: 'FR', name: 'France', capital: 'Paris', continent: 'europe' },
  { code: 'DE', name: 'Germany', capital: 'Berlin', continent: 'europe' },
  { code: 'ES', name: 'Spain', capital: 'Madrid', continent: 'europe' },
  { code: 'IT', name: 'Italy', capital: 'Rome', continent: 'europe' },
  { code: 'PT', name: 'Portugal', capital: 'Lisbon', continent: 'europe' },
  { code: 'PL', name: 'Poland', capital: 'Warsaw', continent: 'europe' },
  {
    code: 'NL',
    name: 'Netherlands',
    capital: 'Amsterdam',
    note: 'The Hague is the seat of government.',
    continent: 'europe',
  },
  { code: 'BE', name: 'Belgium', capital: 'Brussels', continent: 'europe' },
  { code: 'AT', name: 'Austria', capital: 'Vienna', continent: 'europe' },
  { code: 'CH', name: 'Switzerland', capital: 'Bern', continent: 'europe' },
  { code: 'SE', name: 'Sweden', capital: 'Stockholm', continent: 'europe' },
  { code: 'NO', name: 'Norway', capital: 'Oslo', continent: 'europe' },
  { code: 'DK', name: 'Denmark', capital: 'Copenhagen', continent: 'europe' },
  { code: 'FI', name: 'Finland', capital: 'Helsinki', continent: 'europe' },
  { code: 'IE', name: 'Ireland', capital: 'Dublin', continent: 'europe' },
  { code: 'GR', name: 'Greece', capital: 'Athens', continent: 'europe' },
  { code: 'HU', name: 'Hungary', capital: 'Budapest', continent: 'europe' },
  { code: 'CZ', name: 'Czechia', capital: 'Prague', continent: 'europe' },
  { code: 'RO', name: 'Romania', capital: 'Bucharest', continent: 'europe' },
  { code: 'UA', name: 'Ukraine', capital: 'Kyiv', continent: 'europe' },

  // --- Asia ---
  { code: 'JP', name: 'Japan', capital: 'Tokyo', continent: 'asia' },
  { code: 'CN', name: 'China', capital: 'Beijing', continent: 'asia' },
  { code: 'IN', name: 'India', capital: 'New Delhi', continent: 'asia' },
  { code: 'ID', name: 'Indonesia', capital: 'Jakarta', continent: 'asia' },
  { code: 'TH', name: 'Thailand', capital: 'Bangkok', continent: 'asia' },
  { code: 'VN', name: 'Vietnam', capital: 'Hanoi', continent: 'asia' },
  { code: 'MY', name: 'Malaysia', capital: 'Kuala Lumpur', continent: 'asia' },
  { code: 'PH', name: 'Philippines', capital: 'Manila', continent: 'asia' },
  { code: 'KR', name: 'South Korea', capital: 'Seoul', continent: 'asia' },
  { code: 'MN', name: 'Mongolia', capital: 'Ulaanbaatar', continent: 'asia' },
  { code: 'NP', name: 'Nepal', capital: 'Kathmandu', continent: 'asia' },
  { code: 'PK', name: 'Pakistan', capital: 'Islamabad', continent: 'asia' },
  { code: 'BD', name: 'Bangladesh', capital: 'Dhaka', continent: 'asia' },
  {
    code: 'LK',
    name: 'Sri Lanka',
    capital: 'Sri Jayawardenepura Kotte',
    note: 'Colombo is the commercial centre.',
    continent: 'asia',
  },
  { code: 'KZ', name: 'Kazakhstan', capital: 'Astana', continent: 'asia' },
  { code: 'UZ', name: 'Uzbekistan', capital: 'Tashkent', continent: 'asia' },
  { code: 'TR', name: 'Turkey', capital: 'Ankara', continent: 'asia' },
  { code: 'JO', name: 'Jordan', capital: 'Amman', continent: 'asia' },
  { code: 'SA', name: 'Saudi Arabia', capital: 'Riyadh', continent: 'asia' },
  { code: 'SG', name: 'Singapore', capital: 'Singapore', continent: 'asia' },

  // --- Africa ---
  { code: 'EG', name: 'Egypt', capital: 'Cairo', continent: 'africa' },
  { code: 'MA', name: 'Morocco', capital: 'Rabat', continent: 'africa' },
  { code: 'DZ', name: 'Algeria', capital: 'Algiers', continent: 'africa' },
  { code: 'TN', name: 'Tunisia', capital: 'Tunis', continent: 'africa' },
  { code: 'NG', name: 'Nigeria', capital: 'Abuja', continent: 'africa' },
  { code: 'GH', name: 'Ghana', capital: 'Accra', continent: 'africa' },
  { code: 'SN', name: 'Senegal', capital: 'Dakar', continent: 'africa' },
  { code: 'KE', name: 'Kenya', capital: 'Nairobi', continent: 'africa' },
  { code: 'ET', name: 'Ethiopia', capital: 'Addis Ababa', continent: 'africa' },
  { code: 'TZ', name: 'Tanzania', capital: 'Dodoma', continent: 'africa' },
  { code: 'UG', name: 'Uganda', capital: 'Kampala', continent: 'africa' },
  { code: 'RW', name: 'Rwanda', capital: 'Kigali', continent: 'africa' },
  {
    code: 'ZA',
    name: 'South Africa',
    capital: 'Pretoria',
    note: 'Cape Town is legislative, Bloemfontein judicial.',
    continent: 'africa',
  },
  { code: 'NA', name: 'Namibia', capital: 'Windhoek', continent: 'africa' },
  { code: 'BW', name: 'Botswana', capital: 'Gaborone', continent: 'africa' },
  { code: 'ZM', name: 'Zambia', capital: 'Lusaka', continent: 'africa' },
  { code: 'ZW', name: 'Zimbabwe', capital: 'Harare', continent: 'africa' },
  { code: 'MZ', name: 'Mozambique', capital: 'Maputo', continent: 'africa' },
  { code: 'AO', name: 'Angola', capital: 'Luanda', continent: 'africa' },
  { code: 'MG', name: 'Madagascar', capital: 'Antananarivo', continent: 'africa' },

  // --- North America ---
  { code: 'CA', name: 'Canada', capital: 'Ottawa', continent: 'north_america' },
  {
    code: 'US',
    name: 'United States',
    capital: 'Washington, D.C.',
    continent: 'north_america',
  },
  { code: 'MX', name: 'Mexico', capital: 'Mexico City', continent: 'north_america' },
  { code: 'GT', name: 'Guatemala', capital: 'Guatemala City', continent: 'north_america' },
  { code: 'BZ', name: 'Belize', capital: 'Belmopan', continent: 'north_america' },
  { code: 'HN', name: 'Honduras', capital: 'Tegucigalpa', continent: 'north_america' },
  { code: 'SV', name: 'El Salvador', capital: 'San Salvador', continent: 'north_america' },
  { code: 'NI', name: 'Nicaragua', capital: 'Managua', continent: 'north_america' },
  { code: 'CR', name: 'Costa Rica', capital: 'San Jose', continent: 'north_america' },
  { code: 'PA', name: 'Panama', capital: 'Panama City', continent: 'north_america' },
  { code: 'CU', name: 'Cuba', capital: 'Havana', continent: 'north_america' },
  { code: 'JM', name: 'Jamaica', capital: 'Kingston', continent: 'north_america' },
  { code: 'HT', name: 'Haiti', capital: 'Port-au-Prince', continent: 'north_america' },
  {
    code: 'DO',
    name: 'Dominican Republic',
    capital: 'Santo Domingo',
    continent: 'north_america',
  },
  { code: 'BS', name: 'Bahamas', capital: 'Nassau', continent: 'north_america' },
  {
    code: 'TT',
    name: 'Trinidad and Tobago',
    capital: 'Port of Spain',
    continent: 'north_america',
  },

  // --- Oceania ---
  { code: 'AU', name: 'Australia', capital: 'Canberra', continent: 'oceania' },
  { code: 'NZ', name: 'New Zealand', capital: 'Wellington', continent: 'oceania' },
  {
    code: 'PG',
    name: 'Papua New Guinea',
    capital: 'Port Moresby',
    continent: 'oceania',
  },
  { code: 'FJ', name: 'Fiji', capital: 'Suva', continent: 'oceania' },
  { code: 'SB', name: 'Solomon Islands', capital: 'Honiara', continent: 'oceania' },
  { code: 'VU', name: 'Vanuatu', capital: 'Port Vila', continent: 'oceania' },
  { code: 'WS', name: 'Samoa', capital: 'Apia', continent: 'oceania' },
  { code: 'TO', name: 'Tonga', capital: 'Nukualofa', continent: 'oceania' },
  { code: 'KI', name: 'Kiribati', capital: 'Tarawa', continent: 'oceania' },
  { code: 'TV', name: 'Tuvalu', capital: 'Funafuti', continent: 'oceania' },
  {
    code: 'NR',
    name: 'Nauru',
    capital: 'Yaren',
    note: 'Nauru has no official capital; Yaren is the seat of government.',
    continent: 'oceania',
  },
  { code: 'PW', name: 'Palau', capital: 'Ngerulmud', continent: 'oceania' },
  { code: 'MH', name: 'Marshall Islands', capital: 'Majuro', continent: 'oceania' },
  { code: 'FM', name: 'Micronesia', capital: 'Palikir', continent: 'oceania' },
];

const BY_CONTINENT: Record<ContinentId, Country[]> = {
  africa: [],
  asia: [],
  europe: [],
  north_america: [],
  south_america: [],
  oceania: [],
};
COUNTRIES.forEach(c => BY_CONTINENT[c.continent].push(c));

export function countriesOf(id: ContinentId): Country[] {
  return BY_CONTINENT[id];
}

export function continentById(id: ContinentId): Continent {
  return CONTINENTS.find(c => c.id === id) || CONTINENTS[4];
}

export const ATTRIBUTION =
  'Country names and capitals are bundled from curated public reference data. Map boards are generated learning layouts, not survey-grade borders.';
