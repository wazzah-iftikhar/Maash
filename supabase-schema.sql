-- ── Jobs (CMS-managed) ───────────────────────────────────
create table jobs (
  id          bigint generated always as identity primary key,
  title       text not null,
  company     text not null,
  country     text not null,
  city        text not null,
  field       text not null,
  type        text check (type in ('Permanent', 'Contract')) not null,
  mode        text check (mode in ('Onsite', 'Hybrid', 'Remote')) not null,
  comp        text not null,
  comp_range  text not null,
  description text not null,
  requirements text[] not null default '{}',
  posted_date date not null default now(),
  active      boolean not null default true,
  created_at  timestamptz default now()
);

-- ── Form submissions ──────────────────────────────────────
create table hire_inquiries (
  id         bigint generated always as identity primary key,
  company    text,
  country    text,
  city       text,
  work_mode  text,
  salary     text,
  schedule   text,
  jd         text,
  name       text,
  email      text,
  created_at timestamptz default now()
);

create table assessment_individual (
  id         bigint generated always as identity primary key,
  name       text,
  occupation text,
  email      text,
  phone      text,
  sections   text,
  message    text,
  created_at timestamptz default now()
);

create table assessment_corporate (
  id           bigint generated always as identity primary key,
  org          text,
  contact      text,
  email        text,
  phone        text,
  partner_type text,
  team_size    text,
  message      text,
  created_at   timestamptz default now()
);

create table cv_submissions (
  id         bigint generated always as identity primary key,
  name       text,
  email      text,
  phone      text,
  role       text,
  location   text,
  work_mode  text,
  message    text,
  created_at timestamptz default now()
);

-- ── Row Level Security ────────────────────────────────────
alter table jobs                 enable row level security;
alter table hire_inquiries       enable row level security;
alter table assessment_individual enable row level security;
alter table assessment_corporate enable row level security;
alter table cv_submissions       enable row level security;

-- Public can read active jobs
create policy "Public read active jobs"
  on jobs for select using (active = true);

-- ── Seed: existing 8 job listings ────────────────────────
insert into jobs (title, company, country, city, field, type, mode, comp, comp_range, description, requirements, posted_date) values
('Senior Software Engineer',    'Confidential – FinTech',              'Pakistan',     'Karachi',   'Technology',   'Permanent', 'Hybrid',  'PKR 300K+',         'PKR 300K+',         'We are seeking a highly skilled Senior Software Engineer to join a growing FinTech startup. You will architect and develop scalable backend services, mentor junior engineers, and collaborate closely with product and design teams to ship world-class financial products.',                                                                          ARRAY['5+ years backend development (Node.js / Python)', 'Experience with microservices and AWS', 'Strong understanding of financial systems & APIs', 'Excellent communication and leadership skills'],         '2025-06-10'),
('HR Business Partner',         'Confidential – FMCG',                 'Pakistan',     'Lahore',    'FMCG',         'Permanent', 'Onsite',  'PKR 150K – 300K',   'PKR 150K – 300K',   'A leading FMCG organization is looking for a strategic HR Business Partner to support business leaders across multiple functions, drive talent programs, and lead organizational development initiatives at scale.',                                                                                                                                  ARRAY['6+ years HR experience in FMCG or similar', 'Strong knowledge of Pakistan labour law', 'Proven track record in talent management & OD', 'MBA or HR certification preferred'],                          '2025-06-12'),
('Chief Financial Officer',     'Confidential – Manufacturing',        'Pakistan',     'Islamabad', 'Finance',      'Permanent', 'Onsite',  'PKR 300K+',         'PKR 300K+',         'An established manufacturing group seeks an experienced CFO to oversee financial operations, lead strategic financial planning, and drive cost optimization across multiple business units with a combined turnover exceeding PKR 2 billion.',                                                                                                              ARRAY['15+ years in financial leadership roles', 'CA / CPA / ACCA qualified', 'Manufacturing sector experience preferred', 'Proven M&A, fundraising, or restructuring experience'],                              '2025-06-08'),
('Digital Marketing Manager',   'Confidential – E-Commerce',           'UAE',          'Dubai',     'Retail',       'Permanent', 'Hybrid',  'USD 2K – 5K/mo',    'USD 2K – 5K/mo',    'A fast-growing e-commerce brand in Dubai is looking for a data-driven Digital Marketing Manager to lead performance marketing, brand campaigns, and growth strategies across Meta, Google, TikTok, and email channels.',                                                                                                                                ARRAY['4+ years digital marketing experience', 'Expertise in Meta Ads, Google Ads, and SEO', 'Strong analytical mindset with a data-first approach', 'E-commerce or DTC brand background preferred'],           '2025-06-15'),
('Clinical Coordinator',        'Confidential – Healthcare',           'Saudi Arabia', 'Riyadh',    'Healthcare',   'Contract',  'Onsite',  'USD 2K – 5K/mo',    'USD 2K – 5K/mo',    'A reputable healthcare facility in Riyadh is seeking a Clinical Coordinator to manage patient care coordination, liaise between clinical departments, and ensure quality care delivery standards are consistently maintained.',                                                                                                                           ARRAY['Nursing or allied health degree required', '3+ years in clinical coordination', 'HAAD / DHA or Saudi MOH license', 'Excellent interpersonal and organizational skills'],                                  '2025-06-05'),
('Production Supervisor',       'Confidential – Manufacturing',        'Pakistan',     'Karachi',   'Manufacturing','Permanent', 'Onsite',  'PKR 80K – 150K',    'PKR 80K – 150K',    'A manufacturing company seeks an experienced production supervisor to oversee daily floor operations, manage shift teams, and ensure production targets, quality standards, and safety protocols are consistently met.',                                                                                                                                  ARRAY['3+ years production supervision', 'Engineering or technical educational background', 'Strong team leadership and communication skills', 'Solid knowledge of quality control processes & ISO standards'], '2025-06-18'),
('Senior Business Analyst',     'Confidential – Technology Consultancy','UK',          'London',    'Technology',   'Contract',  'Remote',  'USD 5K+/mo',        'USD 5K+/mo',        'A UK-based technology consultancy is seeking a Senior Business Analyst for a 6-month contract to support a large-scale digital transformation project with a Tier 1 financial services client.',                                                                                                                                                        ARRAY['6+ years BA experience in enterprise environments', 'Financial services domain knowledge essential', 'Exceptional stakeholder management skills', 'Agile / Scrum certified (preferred)'],                '2025-06-01'),
('Accounts Manager – SME Portfolio','Confidential – Financial Services','Pakistan',    'Lahore',    'Finance',      'Permanent', 'Hybrid',  'PKR 80K – 150K',    'PKR 80K – 150K',    'A financial services firm is hiring an Accounts Manager to manage a portfolio of SME clients, build strong relationships, and drive revenue growth within the small and medium enterprise segment across Lahore.',                                                                                                                                      ARRAY['3+ years in SME banking, leasing, or financial services', 'Strong client relationship management skills', 'Target-driven mindset with a hunter mentality', 'Finance degree or CFA level 1 preferred'],  '2025-06-20');
