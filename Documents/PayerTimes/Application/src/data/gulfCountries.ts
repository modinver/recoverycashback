export interface City {
  name: string;
  timezone: string;
}

export interface Country {
  name: string;
  cities: City[];
}

export const gulfCountries: Country[] = [
  {
    name: 'UAE',
    cities: [
      { name: 'Abu Dhabi', timezone: 'Asia/Dubai' },
      { name: 'Dubai', timezone: 'Asia/Dubai' },
      { name: 'Sharjah', timezone: 'Asia/Dubai' },
      { name: 'Ajman', timezone: 'Asia/Dubai' },
      { name: 'Umm Al-Quwain', timezone: 'Asia/Dubai' },
      { name: 'Ras Al Khaimah', timezone: 'Asia/Dubai' },
      { name: 'Fujairah', timezone: 'Asia/Dubai' },
    ],
  },
  {
    name: 'Saudi Arabia',
    cities: [
      { name: 'Riyadh', timezone: 'Asia/Riyadh' },
      { name: 'Jeddah', timezone: 'Asia/Riyadh' },
      { name: 'Mecca', timezone: 'Asia/Riyadh' },
      { name: 'Medina', timezone: 'Asia/Riyadh' },
      { name: 'Dammam', timezone: 'Asia/Riyadh' },
    ],
  },
  {
    name: 'Kuwait',
    cities: [
      { name: 'Kuwait City', timezone: 'Asia/Kuwait' },
    ],
  },
  {
    name: 'Oman',
    cities: [
      { name: 'Muscat', timezone: 'Asia/Muscat' },
      { name: 'Salalah', timezone: 'Asia/Muscat' },
    ],
  },
  {
    name: 'Bahrain',
    cities: [
      { name: 'Manama', timezone: 'Asia/Bahrain' },
    ],
  },
  {
    name: 'Qatar',
    cities: [
      { name: 'Doha', timezone: 'Asia/Qatar' },
    ],
  },
];