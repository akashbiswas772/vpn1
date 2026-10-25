export interface ProxyGeoPreset {
  ipPrefix: string;
  country: string;
  countryCode: string;
  city: string;
  timezone: string;
  timezoneOffset: string;
  flag: string;
  isp: string;
}

export const KNOWN_PROXY_GEOS: ProxyGeoPreset[] = [
  {
    ipPrefix: '194.',
    country: 'United States',
    countryCode: 'US',
    city: 'New York',
    timezone: 'America/New_York',
    timezoneOffset: 'UTC-4 (EDT)',
    flag: '🇺🇸',
    isp: 'Akash Decentralized Cloud NY'
  },
  {
    ipPrefix: '45.',
    country: 'United Kingdom',
    countryCode: 'GB',
    city: 'London',
    timezone: 'Europe/London',
    timezoneOffset: 'UTC+1 (BST)',
    flag: '🇬🇧',
    isp: 'Akash High-Bandwidth Node LDN'
  },
  {
    ipPrefix: '185.',
    country: 'Germany',
    countryCode: 'DE',
    city: 'Frankfurt',
    timezone: 'Europe/Berlin',
    timezoneOffset: 'UTC+2 (CEST)',
    flag: '🇩🇪',
    isp: 'Equinix FR5 Enterprise Peer'
  },
  {
    ipPrefix: '103.',
    country: 'Japan',
    countryCode: 'JP',
    city: 'Tokyo',
    timezone: 'Asia/Tokyo',
    timezoneOffset: 'UTC+9 (JST)',
    flag: '🇯🇵',
    isp: 'NTT Communications Tokyo'
  },
  {
    ipPrefix: '142.',
    country: 'Canada',
    countryCode: 'CA',
    city: 'Toronto',
    timezone: 'America/Toronto',
    timezoneOffset: 'UTC-4 (EDT)',
    flag: '🇨🇦',
    isp: 'Bell Canada Residential Gateway'
  },
  {
    ipPrefix: '159.',
    country: 'Singapore',
    countryCode: 'SG',
    city: 'Singapore',
    timezone: 'Asia/Singapore',
    timezoneOffset: 'UTC+8 (SGT)',
    flag: '🇸🇬',
    isp: 'SingTel Global Accelerator'
  }
];

export function resolveProxyGeo(ipOrHost: string): ProxyGeoPreset {
  const clean = ipOrHost.trim().toLowerCase();
  
  if (clean.includes('us') || clean.includes('ny') || clean.startsWith('192.') || clean.startsWith('194.')) {
    return KNOWN_PROXY_GEOS[0];
  }
  if (clean.includes('uk') || clean.includes('london') || clean.startsWith('45.')) {
    return KNOWN_PROXY_GEOS[1];
  }
  if (clean.includes('de') || clean.includes('frankfurt') || clean.startsWith('185.')) {
    return KNOWN_PROXY_GEOS[2];
  }
  if (clean.includes('jp') || clean.includes('tokyo') || clean.startsWith('103.')) {
    return KNOWN_PROXY_GEOS[3];
  }
  if (clean.includes('ca') || clean.includes('toronto') || clean.startsWith('142.')) {
    return KNOWN_PROXY_GEOS[4];
  }
  if (clean.includes('sg') || clean.includes('singapore') || clean.startsWith('159.')) {
    return KNOWN_PROXY_GEOS[5];
  }

  // Hash-based deterministic resolution for any other IP
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = (hash << 5) - hash + clean.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % KNOWN_PROXY_GEOS.length;
  return KNOWN_PROXY_GEOS[index];
}
