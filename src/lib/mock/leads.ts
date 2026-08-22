import { isoDaysAgo, isoHoursAgo, isoHoursFromNow } from './dates';
import { EMPLOYEES } from './company';

const MUMBAI_LOCATIONS = [
  'Andheri West','Borivali West','Malad West','Goregaon West','Bandra West',
  'Powai','Juhu','Vile Parle','Kandivali West','Dahisar West',
  'Andheri East','Goregaon East','Bhandup West','Vikhroli West','Mulund West',
  'Nalasopara West','Virar West','Naigaon East','Bhayandar West','Mira Road East',
];

const MUMBAI_PROJECTS = [
  'Nexus Skylark Tower B','Nexus Green Valley','Nexus Premium Heights',
  'Nexus Sea View Residency','Nexus Park Avenue','Nexus Sunrise Apartments',
  'Nexus Coral Bay','Nexus Hill View','Nexus Golden Palms','Nexus Crystal Cove',
];

const FIRST_NAMES = [
  'Rohan','Sunita','Karan','Meera','Suresh','Pooja','Mahesh','Neha','Sanjay','Arti',
  'Vijay','Kavita','Rahul','Sneha','Manish','Jyoti','Ashok','Ritu','Gaurav','Shweta',
  'Prakash','Divya','Aditya','Komal','Sachin','Payal','Nitin','Bhakti','Rakesh','Madhuri',
  'Tarun','Shruti','Imran','Farida','Joseph','Sarita','Bharat','Leena','Anil','Geeta',
  'Sunil','Pallavi','Akash','Nisha','Varun','Renuka','Dinesh','Harshada','Mangesh','Trupti',
  'Sujay','Aishwarya','Ganesh','Priyanka','Hemant','Vaishali','Shyam','Reshma','Naresh','Kiran',
];

const LAST_NAMES = [
  'Patil','Shah','Desai','Rao','Iyer','Mehta','Gupta','Sharma','Joshi','Kulkarni',
  'Nair','Pillai','Reddy','Shetty','Gowda','Khan','Shaikh','Fernandes','Dsouza','Pereira',
  'More','Jadhav','Bhosale','Pawar','Kamble','Vartak','Nemade','Borde','Lad','Khaire',
];

function pick<T>(arr: T[], i: number): T { return arr[i % arr.length]; }

function makePhone(seed: number): string {
  const base = 9000000000 + (seed * 1337) % 99999999;
  return '+91 ' + String(base).slice(0, 5) + ' ' + String(base).slice(5);
}

const STAGES_ARR = ['new','new','new','assigned','assigned','assigned','positive','positive','site_visit','site_visit','booking','loan','registration','closed'];
const PRIORITIES: (string|null)[] = [null,'hot','cold','follow_up','hot',null,'cold',null,'hot','follow_up',null,null,null,null];
const CALL_STATUSES: (string|null)[] = [null,null,'ringing','call_back','disconnect',null,null,'out_of_service',null,null,null,null,null,null];
const SOURCES = ['Housing.com','Housing.com','Facebook','Facebook','manual_entry','manual_entry','Housing.com','Facebook','manual_entry','Housing.com'];

function buildLeads(): any[] {
  const leads: any[] = [];

  for (let i = 0; i < 120; i++) {
    const fn = pick(FIRST_NAMES, i);
    const ln = pick(LAST_NAMES, i + 7);
    const stage = STAGES_ARR[i % STAGES_ARR.length];
    const priority = stage === 'closed' ? null : pick(PRIORITIES, i);
    const callStatus = stage === 'new' ? null : pick(CALL_STATUSES, i + 3);
    const isNegative = i % 11 === 0 && stage !== 'closed';
    const assignedTo = stage === 'new' ? null : (i % 2 === 0 ? 'emp_002' : i % 3 === 0 ? 'emp_003' : 'emp_004');
    const assignedEmp = assignedTo ? EMPLOYEES.find(e => e.employee_id === assignedTo) : null;
    const loc = pick(MUMBAI_LOCATIONS, i + 3);
    const project = i % 4 === 0 ? pick(MUMBAI_PROJECTS, i) : null;
    const bhk = pick(['1 BHK','2 BHK','3 BHK','2 BHK','3 BHK','1 RK'], i + 2);
    const budgetLakh = pick([35,45,55,65,75,85,95,120,150,200,250,300], i + 1);
    const hasFollowUp = (stage === 'positive' || stage === 'site_visit' || priority === 'follow_up') && !isNegative;
    const createdDay = i < 5 ? 0 : i < 15 ? 1 : i < 30 ? 3 : i < 60 ? 7 : i < 90 ? 15 : 30;

    let workflowLabel = 'New Lead';
    if (isNegative) workflowLabel = pick(['Not Interested','Low Budget','Other Location','Not Searching'], i);
    else if (callStatus === 'ringing') workflowLabel = 'Ringing';
    else if (callStatus === 'call_back') workflowLabel = 'Call Back';
    else if (priority === 'hot') workflowLabel = 'Hot';
    else if (priority === 'cold') workflowLabel = 'Cold Lead';
    else if (stage === 'site_visit') workflowLabel = 'Visited';
    else if (stage === 'positive') workflowLabel = 'Interested';
    else if (stage === 'booking' || stage === 'loan' || stage === 'registration') workflowLabel = 'Booking Done';
    else if (hasFollowUp) workflowLabel = 'Follow Up';
    else if (stage === 'closed') workflowLabel = 'Closed';
    else if (stage === 'assigned') workflowLabel = 'Assigned';

    leads.push({
      lead_id: 'lead_' + String(i + 1).padStart(4, '0'),
      name: fn + ' ' + ln,
      email: i % 3 === 0 ? fn.toLowerCase() + '.' + ln.toLowerCase() + '@gmail.com' : null,
      phone: makePhone(i),
      source: pick(SOURCES, i),
      status: isNegative ? 'negative' : 'active',
      stage: isNegative ? 'new' : stage,
      priority: isNegative ? pick(['low_budget','other_location','already_purchased','not_searching'], i) : priority,
      call_status: callStatus,
      assigned_to: assignedTo,
      assigned_at: assignedTo ? isoDaysAgo(createdDay, 9 + (i % 8), (i * 7) % 60) : null,
      employee_name: assignedEmp?.name,
      property_type: bhk,
      budget: budgetLakh + ' - ' + (budgetLakh + 10),
      budget_min: budgetLakh * 100000,
      budget_max: (budgetLakh + 10) * 100000,
      location: loc,
      project: project,
      configuration: bhk,
      starred: i % 13 === 0,
      notes: i % 7 === 0 ? [{ note_id: 'note_' + i, text: 'Customer interested in site visit next weekend.', type: 'call_note', created_at: isoDaysAgo(createdDay + 1) }] : [],
      follow_up_at: hasFollowUp ? (i % 2 === 0 ? isoHoursFromNow(6) : isoHoursFromNow(48)) : null,
      follow_up_reason: hasFollowUp ? 'Schedule site visit' : null,
      workflow_status_label: workflowLabel,
      created_at: isoDaysAgo(createdDay, 9 + (i % 10), (i * 11) % 60),
      updated_at: isoDaysAgo(Math.max(0, createdDay - 1), 12, (i * 13) % 60),
      last_employee_action_at: assignedTo ? isoHoursAgo(i + 2) : null,
      lead_type: 'lead',
      brokerage_amount: null,
      city: 'Mumbai',
    });
  }

  for (let i = 0; i < 8; i++) {
    const fn = pick(FIRST_NAMES, i + 50);
    const ln = pick(LAST_NAMES, i + 12);
    leads.push({
      lead_id: 'lead_broker_' + String(i + 1).padStart(3, '0'),
      name: fn + ' ' + ln, email: null, phone: makePhone(i + 200),
      source: 'broker_referral', status: 'active', stage: 'broker',
      priority: null, call_status: null, assigned_to: null, assigned_at: null,
      employee_name: undefined,
      property_type: pick(['2 BHK','3 BHK','Shop','Office'], i),
      budget: pick([50,80,120,200], i) + ' - ' + pick([60,90,130,220], i),
      budget_min: pick([5000000,8000000,12000000,20000000], i),
      budget_max: pick([6000000,9000000,13000000,22000000], i),
      location: pick(MUMBAI_LOCATIONS, i + 10),
      project: pick(MUMBAI_PROJECTS, i + 2),
      configuration: pick(['2 BHK','3 BHK','Commercial'], i),
      starred: false, notes: [], follow_up_at: null, follow_up_reason: null,
      workflow_status_label: 'Brokerage',
      created_at: isoDaysAgo(10 + i, 11, 0), updated_at: isoDaysAgo(5 + i, 11, 0),
      last_employee_action_at: null, lead_type: 'brokerage',
      brokerage_amount: pick([50000, 75000, 100000, 125000], i), city: 'Mumbai',
    });
  }

  return leads;
}

export const LEADS: any[] = buildLeads();
export const ACTIVE_LEADS = LEADS.filter(l => l.status !== 'negative' && l.stage !== 'broker' && l.lead_type !== 'brokerage');
export const NEGATIVE_LEADS = LEADS.filter(l => l.status === 'negative');
export const BROKER_LEADS = LEADS.filter(l => l.stage === 'broker' || l.lead_type === 'brokerage');
