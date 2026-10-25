export type ProxyProtocol = 'HTTP' | 'HTTPS' | 'SOCKS5';

export type ConnectionState = 'DISCONNECTED' | 'PREPARING_VPN' | 'STARTING_TUN' | 'CONNECTING' | 'CONNECTED' | 'DISCONNECTING';

export interface ProxyConfig {
  id: string;
  name: string;
  protocol: ProxyProtocol;
  host: string;
  port: number | string;
  username?: string;
  password?: string;
  timezoneMatch: boolean;
  dnsLeakProtection: boolean;
  killSwitch: boolean;
  bypassLan: boolean;
  mtu: number;
  dnsServer: string;
}

export interface TrafficStats {
  uploadSpeedKbps: number;
  downloadSpeedKbps: number;
  totalUploadedMb: number;
  totalDownloadedMb: number;
  pingMs: number;
  durationSeconds: number;
  packetsForwarded: number;
  dnsQueriesProtected: number;
}

export interface GeoLocationInfo {
  ip: string;
  country: string;
  countryCode: string;
  city: string;
  timezone: string;
  isp: string;
}

export interface ParsedProxyResult {
  success: boolean;
  protocol?: ProxyProtocol;
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  raw: string;
  error?: string;
}
