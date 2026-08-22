import { isoHoursAgo, isoDaysAgo } from './dates';

export const COMPANY = {
  name: 'Nexus CRM',
  full_name: 'Nexus Realty LLP',
  tagline: 'Real Estate CRM',
  domain: 'nexuscrm.in',
};

export const DUMMY_USER = {
  user_id: 'usr_admin_001',
  email: 'admin@nexuscrm.in',
  name: 'Rajesh Sharma',
  role: 'admin',
  employee_id: 'emp_001',
  acting_as_employee_id: null,
  allowed_pages: null,
  dashboard_type: 'owner',
  picture: null,
};

export const SESSION_TOKEN = 'mock_session_token_nexus_001';

export const EMPLOYEES: any[] = [
  { employee_id: 'emp_001', name: 'Rajesh Sharma', email: 'admin@nexuscrm.in', phone: '+91 98200 11223', role: 'admin', department: 'Management', location: 'Andheri West, Mumbai', active: true, allowed_pages: ['dashboard','my-dashboard','pipeline','assign-leads','telecaller','sales-executive','bookings','loans','integrations','broker','tracking','employees','negative'], last_activity: isoHoursAgo(1), emp_new_leads: 0, assigned_total: 247, leads_total: 247, emp_missed_leads: 0, emp_hot: 18, emp_cold: 12, emp_site_visit_assigned: 0, emp_visited: 0, emp_not_interested: 0, emp_booking_done: 0, emp_low_budget: 0, emp_follow_ups: 0, emp_today_follow_ups: 0, emp_ringing: 0, emp_today_activity: 5, assigned_queue: 0, assigned_follow_ups: 0 },
  { employee_id: 'emp_002', name: 'Priya Desai', email: 'priya@nexuscrm.in', phone: '+91 98330 44556', role: 'telecaller', department: 'Telecaller Department', location: 'Borivali West, Mumbai', active: true, allowed_pages: ['my-dashboard','telecaller','pipeline','negative'], last_activity: isoHoursAgo(2), emp_new_leads: 12, assigned_total: 45, leads_total: 45, emp_missed_leads: 3, emp_hot: 8, emp_cold: 5, emp_site_visit_assigned: 6, emp_visited: 4, emp_not_interested: 7, emp_booking_done: 2, emp_low_budget: 4, emp_follow_ups: 9, emp_today_follow_ups: 3, emp_ringing: 5, emp_today_activity: 14, assigned_queue: 12, assigned_follow_ups: 9 },
  { employee_id: 'emp_003', name: 'Amit Patil', email: 'amit@nexuscrm.in', phone: '+91 99670 77889', role: 'sales_executive', department: 'Sales Executive Team', location: 'Malad West, Mumbai', active: true, allowed_pages: ['my-dashboard','sales-executive','telecaller','pipeline'], last_activity: isoHoursAgo(3), emp_new_leads: 5, assigned_total: 38, leads_total: 38, emp_missed_leads: 1, emp_hot: 6, emp_cold: 3, emp_site_visit_assigned: 8, emp_visited: 12, emp_not_interested: 2, emp_booking_done: 3, emp_low_budget: 1, emp_follow_ups: 7, emp_today_follow_ups: 2, emp_ringing: 2, emp_today_activity: 8, assigned_queue: 5, assigned_follow_ups: 7 },
  { employee_id: 'emp_004', name: 'Sneha Kulkarni', email: 'sneha@nexuscrm.in', phone: '+91 98199 22334', role: 'telecaller', department: 'Telecaller Department', location: 'Goregaon West, Mumbai', active: true, allowed_pages: ['my-dashboard','telecaller','pipeline','negative'], last_activity: isoHoursAgo(5), emp_new_leads: 8, assigned_total: 52, leads_total: 52, emp_missed_leads: 2, emp_hot: 5, emp_cold: 8, emp_site_visit_assigned: 4, emp_visited: 3, emp_not_interested: 9, emp_booking_done: 1, emp_low_budget: 6, emp_follow_ups: 11, emp_today_follow_ups: 4, emp_ringing: 3, emp_today_activity: 10, assigned_queue: 8, assigned_follow_ups: 11 },
  { employee_id: 'emp_005', name: 'Vikram Singh', email: 'vikram@nexuscrm.in', phone: '+91 97690 55667', role: 'booking', department: 'Booking Department', location: 'Bandra West, Mumbai', active: true, allowed_pages: ['my-dashboard','bookings','pipeline'], last_activity: isoHoursAgo(4), emp_new_leads: 3, assigned_total: 18, leads_total: 18, emp_missed_leads: 0, emp_hot: 0, emp_cold: 0, emp_site_visit_assigned: 0, emp_visited: 0, emp_not_interested: 0, emp_booking_done: 6, emp_low_budget: 0, emp_follow_ups: 2, emp_today_follow_ups: 1, emp_ringing: 0, emp_today_activity: 4, assigned_queue: 3, assigned_follow_ups: 2 },
  { employee_id: 'emp_006', name: 'Deepika Rao', email: 'deepika@nexuscrm.in', phone: '+91 98700 88990', role: 'loan', department: 'Loan Department', location: 'Powai, Mumbai', active: true, allowed_pages: ['my-dashboard','loans','pipeline'], last_activity: isoHoursAgo(6), emp_new_leads: 2, assigned_total: 12, leads_total: 12, emp_missed_leads: 0, emp_hot: 0, emp_cold: 0, emp_site_visit_assigned: 0, emp_visited: 0, emp_not_interested: 0, emp_booking_done: 4, emp_low_budget: 0, emp_follow_ups: 3, emp_today_follow_ups: 1, emp_ringing: 0, emp_today_activity: 3, assigned_queue: 2, assigned_follow_ups: 3 },
  { employee_id: 'emp_007', name: 'Nikhil Joshi', email: 'nikhil@nexuscrm.in', phone: '+91 96530 11022', role: 'manager', department: 'Management', location: 'Andheri East, Mumbai', active: true, allowed_pages: ['dashboard','my-dashboard','pipeline','assign-leads','integrations','broker','tracking','employees','negative'], last_activity: isoHoursAgo(1), emp_new_leads: 0, assigned_total: 0, leads_total: 0, emp_missed_leads: 0, emp_hot: 0, emp_cold: 0, emp_site_visit_assigned: 0, emp_visited: 0, emp_not_interested: 0, emp_booking_done: 0, emp_low_budget: 0, emp_follow_ups: 0, emp_today_follow_ups: 0, emp_ringing: 0, emp_today_activity: 7, assigned_queue: 0, assigned_follow_ups: 0 },
  { employee_id: 'emp_008', name: 'Anjali Mehta', email: 'anjali@nexuscrm.in', phone: '+91 98225 33445', role: 'marketing', department: 'Marketing Team', location: 'Juhu, Mumbai', active: false, allowed_pages: ['my-dashboard','negative','pipeline','integrations'], last_activity: isoDaysAgo(5, 14, 0), emp_new_leads: 0, assigned_total: 15, leads_total: 15, emp_missed_leads: 0, emp_hot: 0, emp_cold: 0, emp_site_visit_assigned: 0, emp_visited: 0, emp_not_interested: 3, emp_booking_done: 0, emp_low_budget: 0, emp_follow_ups: 0, emp_today_follow_ups: 0, emp_ringing: 0, emp_today_activity: 0, assigned_queue: 0, assigned_follow_ups: 0 },
];

export const EMPLOYEE_LOCATIONS = EMPLOYEES.filter(e => e.active).map((e, i) => ({
  employee_id: e.employee_id,
  name: e.name,
  role: e.role,
  latitude: 19.0760 + (i * 0.035) - 0.05,
  longitude: 72.8777 + (i * 0.025) - 0.04,
  last_seen_at: isoHoursAgo(i + 1),
  updated_at: isoHoursAgo(i),
  accuracy: 15 + i * 3,
  address: e.location,
}));
