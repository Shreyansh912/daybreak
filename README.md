# Daybreak — Modern Productivity & Wellness MVP

Daybreak is a calm, intentional calendar and productivity application designed to balance deep work, personal commitments, family routines, and daily mindfulness. Built as a full-stack MVP integrating vanilla JavaScript with Supabase (PostgreSQL, Authentication, and Row Level Security).

---

## 🌟 Key Features

- **Supabase Authentication**: Secure email and password signup, login, session persistence, and logout flow.
- **Row Level Security (RLS)**: PostgreSQL-enforced isolation ensuring users only access, create, update, and delete their own private records.
- **Interactive Calendar & Dashboard**:
  - Daily, weekly, and monthly views.
  - Event categorization: `work`, `personal`, `family`, and `wellness`.
  - Dynamic CRUD operations with zero page reloads.
  - Dedicated desktop creation modal avoiding viewport redirects.
- **Rule-Based Smart Scheduling**:
  - Analyzes existing daily events between 09:00 and 18:00.
  - Finds unallocated free windows to automatically suggest structured slots for focused work and mindfulness.
- **Mindfulness & Meditation Tracker**:
  - Guided breathing orb with a synchronized timer.
  - Automated session logging saved to PostgreSQL upon completion.
- **Real-Time Daily Insights**:
  - Dynamic aggregation of scheduled time across categories and total completed meditation minutes.
- **Customization & Themes**:
  - Light and Dark modes with automatic token switching.
  - User preference persistence.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3 (Custom Design System tokens), Vanilla JavaScript (ES6 Modules)
- **Backend / Database**: [Supabase](https://supabase.com) (PostgreSQL 15)
- **Security**: PostgreSQL Row Level Security (RLS) & Triggers
- **Hosting & Development**: VS Code (Live Server), GitHub, Vercel

---

## 📁 Project Structure

```text
daybreak/
│
├── index.html              # Main application shell (UI & Layouts)
│
├── js/
│   ├── config.js           # Client Supabase configuration (URL & Anon Key)
│   ├── supabase.js         # Supabase client instantiation
│   ├── auth.js             # Authentication & session state management
│   ├── events.js           # Database CRUD & client validation for events
│   ├── calendar.js         # Mobile and desktop calendar renderers
│   ├── smart-schedule.js   # Rule-based free-slot allocation algorithm
│   ├── meditation.js       # Breathing timer & database session logging
│   ├── insights.js         # Aggregate duration & category calculations
│   ├── settings.js         # User preferences & profile loading
│   └── app.js              # Application coordinator & form dispatchers
│
├── supabase/
│   └── schema.sql          # Database tables, triggers, indexes, and RLS policies
│
├── .gitignore              # Ignored system and local configuration files
└── README.md               # Project documentation