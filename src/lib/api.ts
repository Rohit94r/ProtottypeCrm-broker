import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { notifyLiveDataChanged } from './liveSync';
import {
  mockApiGet, mockApiPost, mockApiPatch, mockApiDelete,
  mockWarmUpBackend, mockGetToken, mockSetToken, mockHasSessionToken,
  mockGetActAsId, mockSetActAsId, MOCK_MODE,
} from './mockApi';

declare module 'axios' {
  interface AxiosRequestConfig {
    bypassCache?: boolean;
  }
}

const BACKEND_URL = 'http://localhost:8001';

const REQUEST_TIMEOUT_MS = 15000;
const DASHBOARD_TIMEOUT_MS = 90000;
export const ASSIGN_WORKSPACE_TIMEOUT_MS = 120000;
const AUTH_TIMEOUT_MS = 90000;
export const IMPORT_TIMEOUT_MS = 300000;
const GET_CACHE_MS = 15000;
const BUNDLE_CACHE_MS = 30000;
const SNAPSHOT_TTL_MS = 30 * 60 * 1000;
const SNAPSHOT_STORAGE_KEY = 'nexus_snapshots_v1';
const GET_STORAGE_KEY = 'nexus_get_cache_v1';
const USER_SNAPSHOT_KEY = 'auth-user';

export const api = axios.create({
    baseURL: `${BACKEND_URL}/api`,
    withCredentials: true,
    timeout: REQUEST_TIMEOUT_MS,
});

api.get = function mockGet(url: string, config?: any) {
  return mockApiGet(url, config);
} as typeof api.get;

api.post = function mockPost(url: string, data?: any, config?: any) {
  return mockApiPost(url, data, config);
} as typeof api.post;

api.patch = function mockPatch(url: string, data?: any, config?: any) {
  return mockApiPatch(url, data, config);
} as typeof api.patch;

api.delete = function mockDelete(url: string, config?: any) {
  return mockApiDelete(url, config);
} as typeof api.delete;

const _getCache = new Map<string, { ts: number; data: unknown }>();
const _inflightGets = new Map<string, Promise<any>>();

function getCacheKey(url: string, params?: Record<string, unknown>) {
    return `${url}?${JSON.stringify(params || {})}`;
}

function readPersistedMap(key: string): Record<string, { ts: number; data: unknown }> {
    try {
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
            const raw = window.sessionStorage.getItem(key);
            return raw ? JSON.parse(raw) : {};
        }
    } catch {}
    return {};
}

function writePersistedMap(key: string, value: Record<string, { ts: number; data: unknown }>) {
    try {
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
            window.sessionStorage.setItem(key, JSON.stringify(value));
        }
    } catch {}
}

function ttlForCacheKey(key: string) {
    // Cache keys are `${url}?${params}` — match bundle paths at the start.
    if (key.startsWith('/stats/dashboard-bundle?') || key.startsWith('/stats/me-bundle?')) {
        return BUNDLE_CACHE_MS;
    }
    return GET_CACHE_MS;
}

function hydrateGetCacheFromStorage() {
    const stored = readPersistedMap(GET_STORAGE_KEY);
    const now = Date.now();
    for (const [k, v] of Object.entries(stored)) {
        if (v?.ts && now - v.ts < ttlForCacheKey(k)) {
            _getCache.set(k, v);
        }
    }
}

function persistGetCacheEntry(key: string, entry: { ts: number; data: unknown }) {
    const stored = readPersistedMap(GET_STORAGE_KEY);
    stored[key] = entry;
    const now = Date.now();
    for (const k of Object.keys(stored)) {
        if (!stored[k]?.ts || now - stored[k].ts >= ttlForCacheKey(k)) delete stored[k];
    }
    writePersistedMap(GET_STORAGE_KEY, stored);
}

hydrateGetCacheFromStorage();

export function clearGetCache() {
    _getCache.clear();
    _inflightGets.clear();
    try {
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
            window.sessionStorage.removeItem(GET_STORAGE_KEY);
        }
    } catch {}
}

/** Call after local mutations so every open screen reloads immediately. */
export function broadcastDataChanged() {
    clearGetCache();
    notifyLiveDataChanged();
}

export function isTransientApiError(e: any): boolean { return false; }

export async function warmUpBackend(force = false): Promise<boolean> { return mockWarmUpBackend(); }

const TOKEN_KEY = 'nexus_session_token';
const ACT_AS_KEY = 'nexus_acting_as_id';

async function getToken(): Promise<string | null> { return mockGetToken(); }
export function hasSessionToken(): boolean { return mockHasSessionToken(); }
async function getActAsId(): Promise<string | null> { return mockGetActAsId(); }
export async function setToken(t: string | null) { mockSetToken(t); }
export async function setActAsId(id: string | null) { mockSetActAsId(id); }

export const BACKEND = BACKEND_URL;
export const getBackendOrigin = () => BACKEND_URL.replace(/\/$/, '');

const _snapshotCache = new Map<string, any>();

function hydrateSnapshotsFromStorage() {
    const stored = readPersistedMap(SNAPSHOT_STORAGE_KEY);
    const now = Date.now();
    for (const [k, v] of Object.entries(stored)) {
        if (v?.ts && now - v.ts < SNAPSHOT_TTL_MS && v.data !== undefined) {
            _snapshotCache.set(k, v.data);
        }
    }
}

function persistSnapshot(key: string, value: any) {
    const stored = readPersistedMap(SNAPSHOT_STORAGE_KEY);
    stored[key] = { ts: Date.now(), data: value };
    const now = Date.now();
    for (const k of Object.keys(stored)) {
        if (!stored[k]?.ts || now - stored[k].ts >= SNAPSHOT_TTL_MS) delete stored[k];
    }
    writePersistedMap(SNAPSHOT_STORAGE_KEY, stored);
}

hydrateSnapshotsFromStorage();

export function getSnapshot<T = any>(key: string): T | undefined {
    return _snapshotCache.get(key);
}

export function setSnapshot(key: string, value: any) {
    _snapshotCache.set(key, value);
    persistSnapshot(key, value);
}

export function clearSnapshots() {
    _snapshotCache.clear();
    clearGetCache();
    try {
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
            window.sessionStorage.removeItem(SNAPSHOT_STORAGE_KEY);
        }
    } catch {}
}

/** Download leads as an Excel (.xlsx) file via the authenticated API. Web-only.
 *  Optional `params` may contain date_from / date_to (YYYY-MM-DD) to limit the range. */
export async function downloadLeadsExcel(params?: Record<string, string>): Promise<void> {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
        throw new Error('Excel download is only available on the web app.');
    }
    alert('Demo mode: Excel export is disabled. All data is dummy.');
}

export { LIVE_REFRESH_MS } from './liveSync';

export const META_INTEGRATION_TIMEOUT_MS = 180000;
export const AUTH_REQUEST_TIMEOUT_MS = AUTH_TIMEOUT_MS;
export const BOOKING_REQUEST_TIMEOUT_MS = 90000;

export function integrationErrorMessage(error: any, fallback: string): string {
    if (error?.code === 'ECONNABORTED' || String(error?.message || '').toLowerCase().includes('timeout')) {
        return `${fallback} The server took too long — Meta import runs form-by-form and may need 1–3 minutes. Deploy the latest backend, then try Import again.`;
    }
    const detail = error?.response?.data?.detail;
    if (typeof detail === 'string' && detail.trim()) return detail;
    if (Array.isArray(detail)) {
        return detail.map((item) => item?.msg || String(item)).filter(Boolean).join('; ');
    }
    return fallback;
}

export { USER_SNAPSHOT_KEY };

export default api;
