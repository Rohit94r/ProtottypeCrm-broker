import { STAGES } from '../constants';
import { now } from './dates';
import { EMPLOYEES } from './company';
import { LEADS, ACTIVE_LEADS, NEGATIVE_LEADS } from './leads';
import { BOOKINGS, LOANS } from './bookings';
import { ACTIVITIES } from './misc';

export function buildDashboardBundle() {
  const active = ACTIVE_LEADS;
  const negative = NEGATIVE_LEADS;
  const stageDist: Record<string, number> = {};
  STAGES.forEach(s => { stageDist[s.key] = active.filter(l => l.stage === s.key).length; });

  const buckets: Record<string, number> = {
    all: LEADS.length,
    new_today: active.filter(l => new Date(l.created_at).toDateString() === now.toDateString()).length,
    open_leads: active.filter(l => l.stage === 'new' && !l.assigned_to).length,
    missed_leads: active.filter(l => l.assigned_to && (l.stage === 'new' || l.stage === 'assigned') && !l.call_status && !l.follow_up_at).length,
    positive: active.filter(l => l.priority === 'hot' || l.stage === 'positive').length,
    cold_leads: active.filter(l => l.priority === 'cold').length,
    ringing: active.filter(l => l.call_status === 'ringing').length,
    follow_up: active.filter(l => l.follow_up_at && l.status !== 'negative').length,
    visited: active.filter(l => l.stage === 'site_visit').length,
    not_interested: negative.length,
    booking: active.filter(l => l.stage === 'booking').length,
    registration: active.filter(l => l.stage === 'registration').length,
    partition_sum: 0,
    booking_partition_sum: 0,
  };
  buckets.partition_sum = buckets.open_leads + buckets.missed_leads + buckets.ringing + buckets.follow_up + buckets.positive + buckets.cold_leads + buckets.visited + buckets.not_interested;
  buckets.booking_partition_sum = buckets.booking + buckets.registration;

  const bookingTaskBuckets: Record<string, number> = {};
  ['login_file','sanctioned','registration','disbursement','bill_submitted','amount_received'].forEach(k => {
    bookingTaskBuckets[k] = BOOKINGS.filter(b => b.completed_tasks.includes(k)).length;
  });

  const stats = {
    total_leads: LEADS.length,
    housing_leads: LEADS.filter(l => l.source === 'Housing.com').length,
    meta_leads: LEADS.filter(l => l.source === 'Facebook').length,
    stage_distribution: stageDist,
    lead_buckets: buckets,
    bookings: BOOKINGS.length,
    confirmed_bookings: BOOKINGS.filter(b => b.agreement_status === 'signed').length,
    active_bookings: BOOKINGS.filter(b => b.status !== 'cancellation' && b.status !== 'cancelled').length,
    loans: LOANS.length,
    disbursed_loans: LOANS.filter(l => l.application_status === 'disbursed').length,
    employees: EMPLOYEES.length,
    campaigns: 0,
    revenue_pipeline: BOOKINGS.reduce((s, b) => s + b.brokerage_amount, 0),
    brokerage_received: BOOKINGS.reduce((s, b) => s + b.brokerage_received, 0),
    brokerage_pending: BOOKINGS.reduce((s, b) => s + (b.brokerage_amount - b.brokerage_received), 0),
    pending_follow_ups: active.filter(l => l.follow_up_at).length,
    booking_task_buckets: bookingTaskBuckets,
  };

  const graph = {
    leads_by_month_platform: Array.from({ length: 12 }, (_, idx) => {
      const m = now.getMonth() - 11 + idx;
      const year = now.getFullYear() + Math.floor(m / 12);
      const month = ((m % 12) + 12) % 12 + 1;
      return {
        month: year + '-' + String(month).padStart(2, '0'),
        total: 8 + (idx * 3) + (idx % 3),
        housing: 3 + (idx % 4),
        meta: 2 + (idx % 3),
        manual: 3 + (idx % 2),
      };
    }),
  };

  return { stats, graph, leads: active, employees: EMPLOYEES.map(e => ({ ...e })) };
}

export function buildMeBundle(employeeId?: string) {
  const empId = employeeId || 'emp_002';
  const emp = EMPLOYEES.find(e => e.employee_id === empId) || EMPLOYEES[1];
  const myLeads = LEADS.filter(l => l.assigned_to === empId && l.status !== 'negative').slice(0, 30);
  const missedLeads = myLeads.filter(l => l.assigned_to && (l.stage === 'new' || l.stage === 'assigned') && !l.call_status && !l.follow_up_at).slice(0, 5);

  const personal = {
    emp_new_leads: emp.emp_new_leads || 0, leads_total: emp.leads_total || 0,
    emp_missed_leads: emp.emp_missed_leads || 0, emp_hot: emp.emp_hot || 0, emp_cold: emp.emp_cold || 0,
    emp_site_visit_assigned: emp.emp_site_visit_assigned || 0, emp_visited: emp.emp_visited || 0,
    emp_not_interested: emp.emp_not_interested || 0, emp_booking_done: emp.emp_booking_done || 0,
    emp_low_budget: emp.emp_low_budget || 0, emp_follow_ups: emp.emp_follow_ups || 0,
    emp_today_follow_ups: emp.emp_today_follow_ups || 0, emp_ringing: emp.emp_ringing || 0,
    emp_today_activity: emp.emp_today_activity || 0,
  };

  return {
    me: { employee: emp, role: emp.role, personal, leads: myLeads, missed_leads: missedLeads, missed_leads_total: missedLeads.length, recent_activities: ACTIVITIES.slice(0, 6) },
  };
}
