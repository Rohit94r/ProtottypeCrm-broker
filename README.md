# Nexus CRM - Real Estate CRM (Frontend Demo)

A premium real-estate workflow management dashboard built with **Expo (React Native Web)**. This is a **frontend-only demo** with fully populated dummy data for the **Mumbai region** - no backend required.

## Features

- **Dashboard** - Pipeline overview, revenue tracking, employee performance, lead source charts
- **Lead Pipeline** - Kanban board (New -> Assigned -> Positive -> Site Visit -> Booking -> Loan -> Registration -> Closed)
- **Telecaller Workspace** - Call queue, follow-ups, call status tracking
- **Sales Executive** - Site visit management, follow-up scheduling
- **Booking Management** - 6-step booking pipeline (Login File -> Sanctioned -> Registration -> Disbursement -> Bill Submitted -> Amount Received)
- **Loan Department** - Bank application tracking (Documentation -> Verification -> Sanction -> Disbursal)
- **Employee Management** - Add/edit/disable employees with role-based access
- **Lead Assignment** - Bulk assign leads to telecallers
- **Broker Pool** - Brokerage leads storage
- **Integrations** - Housing.com & Facebook Lead Ads status dashboard
- **Employee Tracking** - GPS location map (dummy Mumbai coordinates)
- **Notifications** - Real-time alert system
- **Dark/Light Theme** - With 6 accent color options
- **Role Switcher** - Switch between Admin, Manager, Telecaller, Sales Executive, Booking, Loan, Marketing

## Dummy Data Included

- **128 leads** across all stages (120 active + 8 broker pool)
- **8 employees** (admin, manager, 2 telecallers, sales executive, booking, loan, marketing)
- **6 bookings** with various task completion states
- **6 loan applications** at different bank stages
- **8 notifications** (read/unread)
- **10 activities** feed
- Mumbai locations: Andheri, Borivali, Malad, Goregaon, Bandra, Powai, Juhu, Virar, Nalasopara, etc.
- Projects: Nexus Skylark, Nexus Green Valley, Nexus Premium Heights, Nexus Sea View, and more

## Quick Start

```bash
# Install dependencies
npm install

# Start the web app
npm run web
# or: npx expo start --web

# Open the URL shown in terminal (usually http://localhost:8081)
```

## Login

This is a demo - **any email and password will work**. The app logs you in as the admin user (Rajesh Sharma) with full access to all pages. Use the role switcher in the top bar to experience different department views.

## Tech Stack

- **Expo** ~54.0 (React Native 0.81 + React 19)
- **Expo Router** (file-based routing)
- **TypeScript**
- **Axios** (intercepted by mock adapter - no real API calls)
- **react-native-web** (web rendering)

## Project Structure

```
nexus-crm/
├── app/                    # Expo Router screens
│   ├── index.tsx           # Login page
│   ├── select-role.tsx     # Role selection
│   ├── enquire.tsx         # Public enquiry form
│   └── (app)/              # Authenticated app screens
│       ├── _layout.tsx     # App shell (sidebar + topbar)
│       ├── dashboard.tsx   # Owner/team dashboard
│       ├── my-dashboard.tsx# Personal dashboard
│       ├── pipeline.tsx    # Lead Kanban board
│       ├── telecaller.tsx  # Telecaller workspace
│       ├── sales-executive.tsx
│       ├── bookings.tsx    # Booking management
│       ├── loans.tsx       # Loan department
│       ├── employees.tsx   # Employee management
│       ├── assign-leads.tsx
│       ├── integrations.tsx
│       ├── broker-leads.tsx
│       ├── admin-tracking.tsx
│       ├── negative-leads.tsx
│       ├── follow-ups.tsx
│       └── notifications.tsx
├── src/
│   ├── lib/
│   │   ├── api.ts          # API layer (redirects to mockApi)
│   │   ├── mockApi.ts       # Mock adapter - intercepts all calls
│   │   ├── mock/            # Dummy data modules
│   │   │   ├── dates.ts     # Date helpers
│   │   │   ├── company.ts   # Company info, users, employees
│   │   │   ├── leads.ts     # 128 leads with Mumbai data
│   │   │   ├── bookings.ts  # Bookings & loans
│   │   │   ├── misc.ts      # Notifications, activities
│   │   │   ├── builders.ts  # Dashboard/me bundle builders
│   │   │   └── filters.ts   # Lead filtering, metrics
│   │   ├── constants.ts     # Stages, roles, nav items
│   │   └── ...
│   ├── components/          # Reusable UI components
│   ├── auth/                # Auth context
│   ├── theme/               # Theme system
│   └── notifications/       # Notification system
└── package.json
```

## How The Mock Works

All API calls (`api.get`, `api.post`, `api.patch`, `api.delete`) are intercepted by `src/lib/mockApi.ts` which returns dummy data from `src/lib/mock/`. No network requests are made. Mutations (add lead, update booking, etc.) update in-memory state and persist for the session.

## Build for Production

```bash
npm run build
# Output goes to dist/ directory
```

## License

This is a demo project for client presentation purposes.
