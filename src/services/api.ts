// Cliente HTTP hacia el backend Node/Express (server/index.js).
// En desarrollo Vite redirige /api -> http://localhost:3001 (ver vite.config.ts).

export interface HealthInfo {
  status: 'oracle' | 'local';
  database?: string;
  user?: string;
  sysdate?: string;
  tables?: number;
  service?: string;
  message?: string;
}

export class ApiError extends Error {}

async function request<T>(method: string, url: string, body?: unknown, timeoutMs = 20000): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: ctrl.signal,
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new ApiError(json.error || `Error HTTP ${res.status}`);
    return json as T;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError('No hay comunicación con el backend (npm run server).');
  } finally {
    clearTimeout(timer);
  }
}

export const api = {
  health: () => request<HealthInfo>('GET', '/api/health', undefined, 15000),
  dataset: () => request<any>('GET', '/api/dataset', undefined, 60000),
  catalogo: () => request<any>('GET', '/api/catalogo', undefined, 60000),
  report: (id: number, restauranteId: number | null) =>
    request<{ rows: any[]; elapsedMs: number }>(
      'GET',
      `/api/reports/${id}${restauranteId ? `?restaurante=${restauranteId}` : ''}`
    ),
  login: (usuario: string, clave: string) => request<any>('POST', '/api/login', { usuario, clave }),
  registro: (payload: unknown) => request<{ ok: boolean; credencialEnOracle: boolean }>('POST', '/api/registro', payload),
  post: (url: string, body: unknown) => request<{ ok: boolean; id?: number }>('POST', url, body),
  put: (url: string, body: unknown) => request<{ ok: boolean }>('PUT', url, body),
  del: (url: string) => request<{ ok: boolean }>('DELETE', url),
};
