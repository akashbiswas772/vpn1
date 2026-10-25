import { ParsedProxyResult, ProxyProtocol } from '../types/proxy';

/**
 * Parses user input strings into proxy components.
 * Supports:
 * - IP:Port:Username:Password (Primary format requested)
 * - IP:Port:User:Pass
 * - IP:Port
 * - User:Pass@IP:Port
 * - protocol://user:pass@host:port
 * - protocol://host:port:user:pass
 */
export function parseProxyString(input: string, defaultProtocol: ProxyProtocol = 'SOCKS5'): ParsedProxyResult {
  const clean = input.trim();
  if (!clean) {
    return { success: false, raw: input, error: 'Empty input string' };
  }

  // 1. Check for URL protocol prefix (e.g. socks5:// or http:// or https://)
  let workingStr = clean;
  let detectedProtocol: ProxyProtocol = defaultProtocol;

  const protoMatch = workingStr.match(/^(socks5|http|https):\/\//i);
  if (protoMatch) {
    const protoLower = protoMatch[1].toLowerCase();
    if (protoLower === 'socks5') detectedProtocol = 'SOCKS5';
    else if (protoLower === 'https') detectedProtocol = 'HTTPS';
    else if (protoLower === 'http') detectedProtocol = 'HTTP';
    workingStr = workingStr.substring(protoMatch[0].length);
  }

  // 2. Check for URI standard: user:pass@host:port
  const uriAuthMatch = workingStr.match(/^([^:@]+):([^@]+)@([^:]+):(\d+)$/);
  if (uriAuthMatch) {
    const [, username, password, host, portStr] = uriAuthMatch;
    const port = parseInt(portStr, 10);
    if (isValidPort(port)) {
      return {
        success: true,
        protocol: detectedProtocol,
        host: host.trim(),
        port,
        username: decodeURIComponent(username),
        password: decodeURIComponent(password),
        raw: input
      };
    }
  }

  // 3. Colon-separated formats
  const parts = workingStr.split(':');

  // Format: IP:Port:Username:Password (4 parts)
  if (parts.length === 4) {
    const [host, portStr, username, password] = parts;
    const port = parseInt(portStr, 10);
    if (isValidPort(port)) {
      return {
        success: true,
        protocol: detectedProtocol,
        host: host.trim(),
        port,
        username: username.trim(),
        password: password.trim(),
        raw: input
      };
    }
  }

  // Format: Protocol:IP:Port:Username:Password (5 parts)
  if (parts.length === 5) {
    const [pProto, host, portStr, username, password] = parts;
    let proto = detectedProtocol;
    if (pProto.toLowerCase().includes('socks')) proto = 'SOCKS5';
    else if (pProto.toLowerCase().includes('https')) proto = 'HTTPS';
    else if (pProto.toLowerCase().includes('http')) proto = 'HTTP';

    const port = parseInt(portStr, 10);
    if (isValidPort(port)) {
      return {
        success: true,
        protocol: proto,
        host: host.trim(),
        port,
        username: username.trim(),
        password: password.trim(),
        raw: input
      };
    }
  }

  // Format: IP:Port (2 parts)
  if (parts.length === 2) {
    const [host, portStr] = parts;
    const port = parseInt(portStr, 10);
    if (isValidPort(port)) {
      return {
        success: true,
        protocol: detectedProtocol,
        host: host.trim(),
        port,
        username: '',
        password: '',
        raw: input
      };
    }
  }

  // Format: IP:Port:Username (3 parts without password)
  if (parts.length === 3) {
    const [host, portStr, username] = parts;
    const port = parseInt(portStr, 10);
    if (isValidPort(port)) {
      return {
        success: true,
        protocol: detectedProtocol,
        host: host.trim(),
        port,
        username: username.trim(),
        password: '',
        raw: input
      };
    }
  }

  return {
    success: false,
    raw: input,
    error: 'Could not parse proxy format. Expected IP:Port:Username:Password or IP:Port'
  };
}

function isValidPort(port: number): boolean {
  return !isNaN(port) && port >= 1 && port <= 65535;
}

export function formatProxyString(host: string, port: number | string, user?: string, pass?: string): string {
  if (user && pass) {
    return `${host}:${port}:${user}:${pass}`;
  }
  return `${host}:${port}`;
}
