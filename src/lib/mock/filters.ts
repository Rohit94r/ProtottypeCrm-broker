import { now } from './dates';
import { EMPLOYEES } from './company';
import { LEADS, ACTIVE_LEADS, NEGATIVE_LEADS, BROKER_LEADS } from './leads';
import { BOOKINGS, LOANS } from './bookings';

export function buildAssignmentStats() {
  return {
    unassigned_count: ACTIVE_LEADS.filter(l => !l.assigned_to).length,
    total_leads: LEADS.length,
    employees: EMPLOYEES.filter(e => e.role !== 'admin' && e.active).map(e => ({
      employee_id: e.employee_id, name: e.name, role: e.role,
      assigned_queue: e.assigned_queue, assigned_follow_ups: e.assigned_follow_ups,
    })),
  };
}

export function buildWorkspace(employeeId?: string | null) {
  const empId = employeeId || 'emp_002';
  const myLeads = LEADS.filter(l => l.assigned_to === empId && l.status !== 'negative');
  const queueLeads = myLeads.filter(l => l.stage === 'assigned' || (l.stage === 'new' && l.assigned_to));
  const followUpLeads = myLeads.filter(l => l.follow_up_at);
  return {
    stats: { assigned_queue: queueLeads.length, assigned_follow_ups: followUpLeads.length },
    queue: { leads: queueLeads },
    follow_ups: { leads: followUpLeads },
  };
}

export function filterLeads(params: Record<string, any>) {
  const bucket = params.bucket || 'all';
  const limit = Number(params.limit || 100);
  const offset = Number(params.offset || 0);
  let filtered = LEADS.filter(l => l.status !== 'negative' && l.stage !== 'broker');

  switch (bucket) {
    case 'all': break;
    case 'new_today': filtered = filtered.filter(l => new Date(l.created_at).toDateString() === now.toDateString()); break;
    case 'open_leads': filtered = filtered.filter(l => l.stage === 'new' && !l.assigned_to); break;
    case 'missed_leads': filtered = filtered.filter(l => l.assigned_to && (l.stage === 'new' || l.stage === 'assigned') && !l.call_status && !l.follow_up_at); break;
    case 'positive': filtered = filtered.filter(l => l.priority === 'hot' || l.stage === 'positive'); break;
    case 'cold_leads': filtered = filtered.filter(l => l.priority === 'cold'); break;
    case 'ringing': filtered = filtered.filter(l => l.call_status === 'ringing'); break;
    case 'follow_up': filtered = filtered.filter(l => l.follow_up_at && l.status !== 'negative'); break;
    case 'visited': filtered = filtered.filter(l => l.stage === 'site_visit'); break;
    case 'not_interested': filtered = NEGATIVE_LEADS; break;
    case 'registration': filtered = filtered.filter(l => l.stage === 'registration'); break;
    case 'booking': filtered = filtered.filter(l => l.stage === 'booking'); break;
    default: break;
  }

  if (params.assigned_to && params.assigned_to !== 'all') filtered = filtered.filter(l => l.assigned_to === params.assigned_to);
  if (params.source && params.source !== 'all') {
    const sf = params.source.toLowerCase();
    filtered = filtered.filter(l => l.source.toLowerCase().includes(sf));
  }
  if (params.status && params.status !== 'all') filtered = filtered.filter(l => l.status === params.status);

  const total = filtered.length;
  const leads = filtered.slice(offset, offset + limit);
  return { leads, total, employees: EMPLOYEES };
}

export function employeeMetric(employeeId: string, metric: string) {
  const filterMap: Record<string, (l: any) => boolean> = {
    new_leads: l => l.assigned_to === employeeId && l.stage === 'new',
    total: l => l.assigned_to === employeeId,
    missed_leads: l => l.assigned_to === employeeId && (l.stage === 'new' || l.stage === 'assigned') && !l.call_status && !l.follow_up_at,
    hot: l => l.assigned_to === employeeId && l.priority === 'hot',
    cold: l => l.assigned_to === employeeId && l.priority === 'cold',
    site_visit_assigned: l => l.assigned_to === employeeId && l.stage === 'site_visit',
    visited: l => l.assigned_to === employeeId && l.stage === 'site_visit',
    not_interested: l => l.assigned_to === employeeId && l.status === 'negative',
    booking_done: l => l.assigned_to === employeeId && ['booking','loan','registration','closed'].includes(l.stage),
    low_budget: l => l.assigned_to === employeeId && l.priority === 'low_budget',
    follow_ups: l => l.assigned_to === employeeId && l.follow_up_at,
    today_follow_ups: l => l.assigned_to === employeeId && l.follow_up_at,
    ringing: l => l.assigned_to === employeeId && l.call_status === 'ringing',
  };

  const fn = filterMap[metric] || (() => false);
  const leads = LEADS.filter(fn);
  return { kind: 'leads', leads, total: leads.length, label: metric };
}

export function myActivity(metric: string) {
  const result = employeeMetric('emp_002', metric);
  if (metric === 'today_activity') {
    return { kind: 'today_report', items: result.leads.map((l: any) => ({
      lead_id: l.lead_id, lead_name: l.name, lead_phone: l.phone,
      workflow_status_label: l.workflow_status_label, action_count: Math.floor(Math.random() * 5) + 1,
      actions: [{ activity_id: 'act_' + l.lead_id, label: 'Called customer', created_at: l.updated_at }],
    })), total: result.leads.length, action_total: result.leads.length * 2, label: 'Today Activity' };
  }
  return { kind: 'leads', items: result.leads, total: result.total, label: metric };
}

export function leadsByPlatform() {
  return { platforms: [
    { platform: 'housing', label: 'Housing.com', count: LEADS.filter(l => l.source === 'Housing.com').length, active: LEADS.filter(l => l.source === 'Housing.com' && l.status === 'active').length, negative: LEADS.filter(l => l.source === 'Housing.com' && l.status === 'negative').length },
    { platform: 'meta', label: 'Meta (Facebook)', count: LEADS.filter(l => l.source === 'Facebook').length, active: LEADS.filter(l => l.source === 'Facebook' && l.status === 'active').length, negative: LEADS.filter(l => l.source === 'Facebook' && l.status === 'negative').length },
    { platform: 'manual', label: 'Database', count: LEADS.filter(l => l.source === 'manual_entry').length, active: LEADS.filter(l => l.source === 'manual_entry' && l.status === 'active').length, negative: LEADS.filter(l => l.source === 'manual_entry' && l.status === 'negative').length },
    { platform: 'other', label: 'Other Sources', count: LEADS.filter(l => !['Housing.com','Facebook','manual_entry'].includes(l.source)).length, active: 0, negative: 0 },
  ] };
}

export function recentLeads() {
  return { leads: LEADS.slice(0, 20).map(l => ({
    lead_id: l.lead_id, name: l.name, phone: l.phone,
    platform: l.source === 'Housing.com' ? 'housing' : l.source === 'Facebook' ? 'meta' : 'manual',
    platform_label: l.source === 'Housing.com' ? 'Housing.com' : l.source === 'Facebook' ? 'Meta (Facebook)' : 'Database',
    created_at: l.created_at,
  })) };
}

export function brokerLeads() { return { leads: BROKER_LEADS }; }
export function bookingQueue() { return ACTIVE_LEADS.filter(l => l.priority === 'hot' || l.priority === 'handoff_booking' || l.stage === 'booking').slice(0, 100); }
export function loanQueue() { return ACTIVE_LEADS.filter(l => l.priority === 'hot' || l.priority === 'handoff_loan' || l.stage === 'loan').slice(0, 100); }
export function integrationStatus() { return { facebook: { source: 'Facebook', webhook_path: '/api/facebook/webhook', verify_token_configured: true, lead_retrieval_configured: true }, housing: { source: 'Housing.com', webhook_path: '/api/housing/webhook', sync_path: '/api/housing/sync', profile_id_configured: true, encryption_key_configured: true, integration_uuid_configured: true, api_url: 'https://api.housing.com/api/v1' } }; }
export function housingVerify() { return { credentials_ok: true, api_reachable: true, leads_available: 42, db_housing_leads: LEADS.filter(l => l.source === 'Housing.com').length, message: 'Housing.com integration is active and syncing leads.' }; }
export function facebookVerify() { return { token_configured: true, token_valid: true, token_error: null, token_type: 'Page Access Token', lead_api_ready: true, db_meta_leads: LEADS.filter(l => l.source === 'Facebook').length, forms_count: 3, forms: [{ id: 'fb_form_001', name: 'Nexus Skylark - Lead Form', status: 'ACTIVE' }, { id: 'fb_form_002', name: 'Nexus Green Valley - Enquiry', status: 'ACTIVE' }, { id: 'fb_form_003', name: 'Nexus Premium Heights - 3BHK', status: 'PAUSED' }], page_id: 'fb_page_nexus_001', pending_webhook_events: 0, last_error: null, fix_steps: [] }; }
export function facebookEvents() { return { events: [{ event_id: 'fb_evt_1', event_type: 'leadgen_received', lead_id: 'lead_0005', text: 'Facebook Lead Ad generated new enquiry', created_at: LEADS[4].created_at }] }; }
export function metaLeadsList() { return { leads: LEADS.filter(l => l.source === 'Facebook').slice(0, 50).map(l => ({ lead_id: l.lead_id, name: l.name, phone: l.phone, email: l.email, source: l.source, created_at: l.created_at })) }; }
