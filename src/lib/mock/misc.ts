import { isoHoursAgo, isoDaysAgo } from './dates';

export const NOTIFICATIONS: any[] = [
  { notification_id: 'n_001', user_id: 'usr_admin_001', title: 'New Lead from Housing.com', message: 'A new enquiry for 2BHK in Andheri West just arrived.', type: 'new_lead', is_read: false, read_at: null, lead_id: 'lead_0001', created_at: isoHoursAgo(1) },
  { notification_id: 'n_002', user_id: 'usr_admin_001', title: 'Hot Lead Alert', message: 'Priya Desai marked Rohan Patil as Hot Lead.', type: 'hot_lead', is_read: false, read_at: null, lead_id: 'lead_0042', created_at: isoHoursAgo(3) },
  { notification_id: 'n_003', user_id: 'usr_admin_001', title: 'Booking Confirmed', message: 'Booking confirmed for Nexus Skylark Tower B - 3BHK.', type: 'booking', is_read: false, read_at: null, lead_id: 'lead_0042', created_at: isoDaysAgo(15, 15, 0) },
  { notification_id: 'n_004', user_id: 'usr_admin_001', title: 'Loan Disbursed', message: 'HDFC Bank disbursed loan for Rohan Patil.', type: 'loan', is_read: true, read_at: isoDaysAgo(12, 14, 0), lead_id: 'lead_0042', created_at: isoDaysAgo(12, 14, 0) },
  { notification_id: 'n_005', user_id: 'usr_admin_001', title: 'Follow-up Due Today', message: '3 follow-ups scheduled for today.', type: 'follow_up', is_read: false, read_at: null, lead_id: null, created_at: isoHoursAgo(6) },
  { notification_id: 'n_006', user_id: 'usr_admin_001', title: 'Missed Lead', message: 'Sneha Kulkarni has 2 missed leads (24h+ no action).', type: 'missed_lead', is_read: true, read_at: isoHoursAgo(5), lead_id: null, created_at: isoHoursAgo(8) },
  { notification_id: 'n_007', user_id: 'usr_admin_001', title: 'New Meta Lead', message: 'Facebook Lead Ad generated a new enquiry from Bandra West.', type: 'new_lead', is_read: true, read_at: isoDaysAgo(2, 10, 0), lead_id: 'lead_0005', created_at: isoDaysAgo(2, 10, 0) },
  { notification_id: 'n_008', user_id: 'usr_admin_001', title: 'Site Visit Completed', message: 'Amit Patil completed site visit for Karan Desai.', type: 'site_visit', is_read: true, read_at: isoDaysAgo(5, 16, 0), lead_id: 'lead_0078', created_at: isoDaysAgo(5, 16, 0) },
];

export const ACTIVITIES: any[] = [
  { activity_id: 'a_001', lead_id: 'lead_0001', lead_name: 'Rohan Patil', text: 'New lead captured from Housing.com for 2BHK in Andheri West', created_at: isoHoursAgo(1) },
  { activity_id: 'a_002', lead_id: 'lead_0042', lead_name: 'Rohan Patil', text: 'Priya Desai marked lead as Hot', created_at: isoHoursAgo(3) },
  { activity_id: 'a_003', lead_id: 'lead_0091', lead_name: 'Meera Rao', text: 'Site visit scheduled for Nexus Sea View Residency', created_at: isoHoursAgo(5) },
  { activity_id: 'a_004', lead_id: 'lead_0056', lead_name: 'Sunita Shah', text: 'Booking created for Nexus Green Valley - 2BHK', created_at: isoDaysAgo(8, 12, 0) },
  { activity_id: 'a_005', lead_id: 'lead_0078', lead_name: 'Karan Desai', text: 'Loan application submitted to ICICI Bank', created_at: isoDaysAgo(4, 11, 0) },
  { activity_id: 'a_006', lead_id: 'lead_0034', lead_name: 'Pooja Mehta', text: 'Booking completed - all 6 tasks done', created_at: isoDaysAgo(20, 10, 0) },
  { activity_id: 'a_007', lead_id: 'lead_0042', lead_name: 'Rohan Patil', text: 'Loan disbursed by HDFC Bank', created_at: isoDaysAgo(12, 14, 0) },
  { activity_id: 'a_008', lead_id: 'lead_0103', lead_name: 'Suresh Iyer', text: 'New booking created for Nexus Park Avenue - 4BHK', created_at: isoDaysAgo(1, 11, 0) },
  { activity_id: 'a_009', lead_id: null, lead_name: null, text: 'Sneha Kulkarni added a call note to 3 leads', created_at: isoHoursAgo(6) },
  { activity_id: 'a_010', lead_id: 'lead_0005', lead_name: 'Suresh Iyer', text: 'Facebook Lead Ad generated new enquiry from Bandra West', created_at: isoDaysAgo(2, 10, 0) },
];

export const NOTIFICATION_PREFS = {
  push_enabled: true,
  email_enabled: true,
  new_lead_alerts: true,
  hot_lead_alerts: true,
  booking_alerts: true,
  loan_alerts: true,
  follow_up_alerts: true,
  missed_lead_alerts: true,
};
