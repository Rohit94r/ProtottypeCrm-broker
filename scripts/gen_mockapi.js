import { Platform } from 'react-native';
import {
  DUMMY_USER, EMPLOYEES, EMPLOYEE_LOCATIONS,
  LEADS, ACTIVE_LEADS, NEGATIVE_LEADS, BROKER_LEADS, BOOKINGS, LOANS,
  NOTIFICATIONS, NOTIFICATION_PREFS, ACTIVITIES,
  buildDashboardBundle, buildMeBundle, buildAssignmentStats, buildWorkspace,
  filterLeads, employeeMetric, myActivity, leadsByPlatform, recentLeads,
  brokerLeads, bookingQueue, loanQueue, integrationStatus, housingVerify,
  facebookVerify, facebookEvents, metaLeadsList,
} from './mock';

let _sessionUser: any = null;
let _employees: any[] = JSON.parse(JSON.stringify(EMPLOYEES));
let _leads: any[] = JSON.parse(JSON.stringify(LEADS));
let _bookings: any[] = JSON.parse(JSON.stringify(BOOKINGS));
let _loans: any[] = JSON.parse(JSON.stringify(LOANS));
let _notifications: any[] = JSON.parse(JSON.stringify(NOTIFICATIONS));

function clone<T>(v: T): T { return JSON.parse(JSON.stringify(v)); }

export const MOCK_MODE = true;

export function mockGetToken(): string | null {
  try {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      return window.sessionStorage.getItem('nexus_session_token');
    }
  } catch {}
  return null;
}

export function mockSetToken(t: string | null) {
  try {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      if (t) window.sessionStorage.setItem('nexus_session_token', t);
      else window.sessionStorage.removeItem('nexus_session_token');
    }
  } catch {}
}

export function mockHasSessionToken(): boolean { return !!mockGetToken(); }
export async function mockWarmUpBackend(): Promise<boolean> { return true; }

export function mockGetActAsId(): string | null {
  try {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      return window.sessionStorage.getItem('nexus_acting_as_id');
    }
  } catch {}
  return null;
}

export function mockSetActAsId(id: string | null) {
  try {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      if (id) window.sessionStorage.setItem('nexus_acting_as_id', id);
      else window.sessionStorage.removeItem('nexus_acting_as_id');
    }
  } catch {}
}

function resolveUser(): any {
  if (_sessionUser) return _sessionUser;
  const actAsId = mockGetActAsId();
  if (actAsId) {
    const emp = _employees.find(e => e.employee_id === actAsId);
    if (emp) return { ...DUMMY_USER, acting_as_employee_id: actAsId, employee_id: actAsId, name: emp.name, email: emp.email, role: emp.role };
  }
  return DUMMY_USER;
}

function getIdFromPath(path: string, prefix: string): string | null {
  const idx = path.indexOf(prefix);
  if (idx < 0) return null;
  const after = path.slice(idx + prefix.length);
  const slashIdx = after.indexOf('/');
  return slashIdx >= 0 ? after.slice(0, slashIdx) : after;
}

export async function mockApiGet(url: string, config?: any): Promise<any> {
  const path = url.split('?')[0];
  const params = config?.params || {};
  await new Promise(r => setTimeout(r, 60 + Math.random() * 100));

  if (path === '/auth/me') return { data: resolveUser() };
  if (path === '/employees') return { data: clone(_employees) };
  if (path === '/employees/locations') return { data: clone(EMPLOYEE_LOCATIONS) };
  if (path === '/leads') {
    let result = _leads;
    if (params.assigned_to) result = result.filter(l => l.assigned_to === params.assigned_to);
    if (params.status_ === 'negative' || params.status === 'negative') result = result.filter(l => l.status === 'negative');
    if (params.limit) result = result.slice(0, Number(params.limit));
    return { data: clone(result) };
  }
  if (path === '/leads/filtered') return { data: clone(filterLeads(params)) };
  if (path === '/leads/workspace') return { data: clone(buildWorkspace(params.assigned_to || mockGetActAsId())) };
  if (path === '/leads/recent') return { data: clone(recentLeads()) };
  if (path === '/leads/booking-queue') return { data: clone(bookingQueue()) };
  if (path === '/leads/loan-queue') return { data: clone(loanQueue()) };
  if (path === '/leads/by-platform/meta') return { data: clone(metaLeadsList()) };
  if (path === '/leads/assign-workspace') return { data: { unassigned: clone(ACTIVE_LEADS.filter(l => !l.assigned_to).slice(0, 20)), total: ACTIVE_LEADS.filter(l => !l.assigned_to).length } };
  if (path === '/broker-leads') return { data: clone(brokerLeads()) };
  if (path === '/bookings') return { data: clone(_bookings) };
  if (path === '/loans') return { data: clone(_loans) };
  if (path === '/stats/dashboard-bundle') return { data: clone(buildDashboardBundle()) };
  if (path === '/stats/me-bundle') return { data: clone(buildMeBundle(resolveUser()?.employee_id)) };
  if (path === '/stats/assignment') return { data: clone(buildAssignmentStats()) };
  if (path === '/stats/leads-by-platform') return { data: clone(leadsByPlatform()) };
  if (path.startsWith('/leads/employee/') && path.includes('/metric/')) {
    const parts = path.split('/');
    const empId = parts[3] || 'emp_002';
    const metric = parts[5] || 'total';
    return { data: clone(employeeMetric(empId, metric)) };
  }
  if (path.startsWith('/stats/me/activity/')) {
    const metric = path.split('/').pop() || 'total';
    return { data: clone(myActivity(metric)) };
  }
  if (path.startsWith('/leads/') && path.endsWith('/ai-summary')) {
    const leadId = getIdFromPath(path, '/leads/');
    return { data: { summary: 'This lead is interested in a 2BHK property in Mumbai. Budget aligns with our Nexus projects. Recommended to schedule a site visit.' } };
  }
  if (path === '/visit-followups') {
    const fuLeads = _leads.filter(l => l.follow_up_at && l.status !== 'negative').map(l => ({
      followup_id: 'fu_' + l.lead_id, lead_id: l.lead_id, lead_name: l.name,
      follow_up_at: l.follow_up_at, follow_up_date: l.follow_up_at?.slice(0, 10),
      follow_up_time: l.follow_up_at?.slice(11, 16),
      follow_up_day: l.follow_up_at ? new Date(l.follow_up_at).toLocaleDateString('en-IN', { weekday: 'long' }) : '',
      employee_name: l.employee_name, notes: l.follow_up_reason,
    }));
    return { data: clone(fuLeads) };
  }
  if (path === '/notifications') {
    let items = _notifications;
    if (params.unread_only) items = items.filter(n => !n.is_read);
    if (params.read_only) items = items.filter(n => n.is_read);
    return { data: { items: clone(items), unread_count: items.filter(n => !n.is_read).length } };
  }
  if (path === '/notifications/unread-count') return { data: { unread_count: _notifications.filter(n => !n.is_read).length } };
  if (path === '/notifications/preferences') return { data: clone(NOTIFICATION_PREFS) };
  if (path === '/integrations/status') return { data: clone(integrationStatus()) };
  if (path === '/integrations/housing/verify') return { data: clone(housingVerify()) };
  if (path === '/integrations/facebook/verify') return { data: clone(facebookVerify()) };
  if (path === '/integrations/facebook/events') return { data: clone(facebookEvents()) };
  if (path === '/campaigns') return { data: [] };
  if (path === '/templates') return { data: [] };
  if (path === '/health') return { data: { status: 'ok' } };
  if (path.startsWith('/leads/')) {
    const leadId = path.split('/')[2];
    const lead = _leads.find(l => l.lead_id === leadId);
    if (lead) return { data: clone(lead) };
  }
  if (path.startsWith('/bookings/') && path.endsWith('/document')) return { data: { document_url: null } };
  if (path.startsWith('/bookings/') && path.endsWith('/document/preview')) return { data: null };

  console.warn('[mockApi] unhandled GET:', path);
  return { data: null };
}

export async function mockApiPost(url: string, data?: any, config?: any): Promise<any> {
  const path = url.split('?')[0];
  await new Promise(r => setTimeout(r, 60 + Math.random() * 100));

  if (path === '/auth/session') {
    _sessionUser = { ...DUMMY_USER };
    mockSetToken('mock_session_token_nexus_001');
    return { data: { session_token: 'mock_session_token_nexus_001', user: _sessionUser } };
  }
  if (path === '/auth/logout') { _sessionUser = null; mockSetToken(null); return { data: { ok: true } }; }
  if (path === '/auth/set-role') { if (_sessionUser) _sessionUser.role = data.role; return { data: resolveUser() }; }
  if (path === '/auth/act-as') {
    if (data.employee_id) mockSetActAsId(data.employee_id);
    else mockSetActAsId(null);
    return { data: resolveUser() };
  }
  if (path === '/auth/ping-location') return { data: { ok: true } };
  if (path === '/notifications/fcm-token') return { data: { ok: true } };
  if (path === '/notifications/read-all') {
    _notifications = _notifications.map(n => ({ ...n, is_read: true }));
    return { data: { ok: true } };
  }
  if (path === '/notifications/broadcast') return { data: { ok: true } };
  if (path === '/admin/flush-caches') return { data: { ok: true } };
  if (path === '/leads/reset-assignments') return { data: { ok: true } };
  if (path === '/leads') {
    const newLead = { ...data, lead_id: 'lead_new_' + Date.now(), created_at: new Date().toISOString(), status: 'active', stage: data.stage || 'new' };
    _leads.unshift(newLead);
    return { data: clone(newLead) };
  }
  if (path === '/leads/public') return { data: { ok: true, lead_id: 'lead_public_' + Date.now() } };
  if (path === '/leads/booking-manual') {
    const newLead = { ...data, lead_id: 'lead_bm_' + Date.now(), created_at: new Date().toISOString(), status: 'active', stage: 'booking', priority: 'handoff_booking' };
    _leads.unshift(newLead);
    return { data: clone(newLead) };
  }
  if (path === '/leads/import') return { data: { imported: 0, message: 'Demo mode - import disabled' } };
  if (path === '/leads/bulk-manage') return { data: { ok: true, updated: (data.lead_ids || []).length } };
  if (path === '/leads/bulk-delete') return { data: { ok: true, deleted: (data.lead_ids || []).length } };
  if (path === '/bookings') {
    const newBooking = { ...data, booking_id: 'bk_new_' + Date.now(), created_at: new Date().toISOString(), status: 'active', agreement_status: 'pending', payment_progress: 0, completed_tasks: [], starred: false, brokerage_amount: 0, brokerage_received: 0 };
    _bookings.unshift(newBooking);
    return { data: clone(newBooking) };
  }
  if (path === '/loans') {
    const newLoan = { ...data, loan_id: 'ln_new_' + Date.now(), created_at: new Date().toISOString(), application_status: 'pending', bank_stage: 'documentation', progress: 0, starred: false };
    _loans.unshift(newLoan);
    return { data: clone(newLoan) };
  }
  if (path === '/employees') {
    const newEmp = { ...data, employee_id: 'emp_new_' + Date.now(), active: true, last_activity: new Date().toISOString() };
    _employees.unshift(newEmp);
    return { data: clone(newEmp) };
  }
  if (path === '/campaigns') return { data: { ok: true } };
  if (path === '/templates') return { data: { ok: true } };
  if (path === '/integrations/housing/poll') return { data: { ok: true, message: 'Demo mode' } };
  if (path === '/integrations/facebook/poll') return { data: { ok: true, message: 'Demo mode' } };
  if (path === '/integrations/facebook/resync') return { data: { ok: true, message: 'Demo mode' } };
  if (path === '/housing/sync') return { data: { ok: true, message: 'Demo mode' } };
  if (path.startsWith('/leads/') && path.endsWith('/follow-up')) return { data: { ok: true } };
  if (path.startsWith('/leads/') && path.endsWith('/advance')) return { data: { ok: true } };
  if (path.startsWith('/leads/') && path.endsWith('/notes')) {
    const leadId = path.split('/')[2];
    const lead = _leads.find(l => l.lead_id === leadId);
    if (lead) lead.notes = [...(lead.notes || []), { ...data, note_id: 'note_' + Date.now(), created_at: new Date().toISOString() }];
    return { data: { ok: true } };
  }
  if (path.startsWith('/leads/') && path.endsWith('/from-broker')) return { data: { ok: true } };
  if (path.startsWith('/leads/') && path.endsWith('/to-broker')) return { data: { ok: true } };
  if (path.startsWith('/leads/') && path.endsWith('/assign-site-visitor')) return { data: { ok: true } };

  console.warn('[mockApi] unhandled POST:', path);
  return { data: { ok: true } };
}

export async function mockApiPatch(url: string, data?: any, config?: any): Promise<any> {
  const path = url.split('?')[0];
  await new Promise(r => setTimeout(r, 60 + Math.random() * 100));

  if (path.startsWith('/leads/')) {
    const leadId = path.split('/')[2];
    const lead = _leads.find(l => l.lead_id === leadId);
    if (lead) Object.assign(lead, data);
    if (path.endsWith('/remarks')) return { data: { ok: true } };
    return { data: clone(lead) };
  }
  if (path.startsWith('/employees/')) {
    const empId = path.split('/')[2];
    const emp = _employees.find(e => e.employee_id === empId);
    if (emp) Object.assign(emp, data);
    return { data: clone(emp) };
  }
  if (path.startsWith('/bookings/')) {
    const bkId = path.split('/')[2];
    const bk = _bookings.find(b => b.booking_id === bkId);
    if (bk) Object.assign(bk, data);
    return { data: clone(bk) };
  }
  if (path.startsWith('/loans/')) {
    const lnId = path.split('/')[2];
    const ln = _loans.find(l => l.loan_id === lnId);
    if (ln) Object.assign(ln, data);
    return { data: clone(ln) };
  }
  if (path.startsWith('/notifications/') && path.endsWith('/read')) {
    const nId = path.split('/')[2];
    _notifications = _notifications.map(n => n.notification_id === nId ? { ...n, is_read: true, read_at: new Date().toISOString() } : n);
    return { data: { ok: true } };
  }
  if (path === '/notifications/preferences') return { data: clone({ ...NOTIFICATION_PREFS, ...data }) };

  console.warn('[mockApi] unhandled PATCH:', path);
  return { data: { ok: true } };
}

export async function mockApiDelete(url: string, config?: any): Promise<any> {
  const path = url.split('?')[0];
  await new Promise(r => setTimeout(r, 60 + Math.random() * 100));

  if (path === '/leads/clear-all') { _leads = []; return { data: { ok: true } }; }
  if (path.startsWith('/leads/')) {
    const leadId = path.split('/')[2];
    _leads = _leads.filter(l => l.lead_id !== leadId);
    return { data: { ok: true } };
  }
  if (path.startsWith('/employees/')) {
    const empId = path.split('/')[2];
    _employees = _employees.filter(e => e.employee_id !== empId);
    return { data: { ok: true } };
  }
  if (path.startsWith('/bookings/')) {
    const bkId = path.split('/')[2];
    _bookings = _bookings.filter(b => b.booking_id !== bkId);
    return { data: { ok: true } };
  }
  if (path.startsWith('/loans/')) {
    const lnId = path.split('/')[2];
    _loans = _loans.filter(l => l.loan_id !== lnId);
    return { data: { ok: true } };
  }
  if (path.startsWith('/notifications/')) {
    const nId = path.split('/')[2];
    _notifications = _notifications.filter(n => n.notification_id !== nId);
    return { data: { ok: true } };
  }
  if (path.startsWith('/campaigns/')) return { data: { ok: true } };
  if (path.startsWith('/templates/')) return { data: { ok: true } };

  console.warn('[mockApi] unhandled DELETE:', path);
  return { data: { ok: true } };
}
