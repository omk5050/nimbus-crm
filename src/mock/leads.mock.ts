import type { Lead, LeadActivity } from '@/types/lead.types';

export const MOCK_LEADS: Lead[] = [
  {
    id: 'lead_001',
    name: 'Isabella Cruz',
    company: 'Northlight Media',
    email: 'isabella@northlightmedia.com',
    phone: '+1 (212) 555-0166',
    stage: 'new',
    source: 'Website',
    owner: 'Aisha Khan',
    value: 24000,
    createdAt: '2026-07-16T10:20:00Z',
  },
  {
    id: 'lead_002',
    name: 'Marcus Boone',
    company: 'Vantage Robotics',
    email: 'marcus@vantagerobotics.io',
    phone: '+1 (650) 555-0184',
    stage: 'new',
    source: 'Referral',
    owner: 'Jordan Reyes',
    value: 58000,
    createdAt: '2026-07-15T14:05:00Z',
  },
  {
    id: 'lead_003',
    name: 'Chloe Bennett',
    company: 'Redwood Wellness',
    email: 'chloe@redwoodwellness.com',
    phone: '+1 (971) 555-0129',
    stage: 'new',
    source: 'Social Media',
    owner: 'Priya Shah',
    value: 15500,
    createdAt: '2026-07-15T09:40:00Z',
  },
  {
    id: 'lead_004',
    name: 'Ravi Patel',
    company: 'Summit Freight Co.',
    email: 'ravi@summitfreight.com',
    phone: '+1 (720) 555-0147',
    stage: 'new',
    source: 'Cold Outreach',
    owner: 'Marcus Webb',
    value: 41200,
    createdAt: '2026-07-14T16:55:00Z',
  },
  {
    id: 'lead_005',
    name: 'Freya Lindqvist',
    company: 'Nordkap Energy',
    email: 'freya@nordkapenergy.se',
    phone: '+46 8 555 0176',
    stage: 'contacted',
    source: 'Partner',
    owner: 'Aisha Khan',
    value: 96500,
    expectedCloseDate: '2026-08-20',
    createdAt: '2026-07-11T08:15:00Z',
  },
  {
    id: 'lead_006',
    name: 'Julian Ashford',
    company: 'Ashford & Cole Legal',
    email: 'julian@ashfordcole.com',
    phone: '+1 (312) 555-0193',
    stage: 'contacted',
    source: 'Website',
    owner: 'Jordan Reyes',
    value: 33000,
    expectedCloseDate: '2026-08-05',
    createdAt: '2026-07-10T11:30:00Z',
  },
  {
    id: 'lead_007',
    name: 'Meiying Zhou',
    company: 'Panda Bay Foods',
    email: 'meiying@pandabayfoods.com',
    phone: '+1 (415) 555-0138',
    stage: 'contacted',
    source: 'Referral',
    owner: 'Priya Shah',
    value: 27800,
    expectedCloseDate: '2026-07-30',
    createdAt: '2026-07-08T13:10:00Z',
  },
  {
    id: 'lead_008',
    name: 'Damon Wheeler',
    company: 'Ironclad Security',
    email: 'damon@ironcladsecurity.com',
    phone: '+1 (206) 555-0157',
    stage: 'qualified',
    source: 'Cold Outreach',
    owner: 'Marcus Webb',
    value: 112000,
    expectedCloseDate: '2026-08-12',
    createdAt: '2026-07-03T09:50:00Z',
  },
  {
    id: 'lead_009',
    name: 'Anya Petrova',
    company: 'Solace Interiors',
    email: 'anya@solaceinteriors.com',
    phone: '+1 (617) 555-0122',
    stage: 'qualified',
    source: 'Social Media',
    owner: 'Aisha Khan',
    value: 19400,
    expectedCloseDate: '2026-07-28',
    createdAt: '2026-07-01T15:20:00Z',
  },
  {
    id: 'lead_010',
    name: 'Théo Lambert',
    company: 'Lambert Vineyards',
    email: 'theo@lambertvineyards.fr',
    phone: '+33 1 55 55 0198',
    stage: 'qualified',
    source: 'Partner',
    owner: 'Jordan Reyes',
    value: 46700,
    expectedCloseDate: '2026-08-01',
    createdAt: '2026-06-27T12:00:00Z',
  },
  {
    id: 'lead_011',
    name: 'Simone Ferreira',
    company: 'Aurora Biotech',
    email: 'simone@aurorabiotech.com',
    phone: '+1 (858) 555-0161',
    stage: 'proposal',
    source: 'Website',
    owner: 'Priya Shah',
    value: 187000,
    expectedCloseDate: '2026-07-25',
    createdAt: '2026-06-20T10:40:00Z',
  },
  {
    id: 'lead_012',
    name: 'Nate Kowalczyk',
    company: 'Crestline Builders',
    email: 'nate@crestlinebuilders.com',
    phone: '+1 (303) 555-0114',
    stage: 'proposal',
    source: 'Referral',
    owner: 'Marcus Webb',
    value: 68300,
    expectedCloseDate: '2026-07-22',
    createdAt: '2026-06-18T14:25:00Z',
  },
  {
    id: 'lead_013',
    name: 'Layla Haddad',
    company: 'Haddad Import Group',
    email: 'layla@haddadimport.com',
    phone: '+971 4 555 0142',
    stage: 'won',
    source: 'Partner',
    owner: 'Aisha Khan',
    value: 84000,
    createdAt: '2026-06-05T09:15:00Z',
  },
  {
    id: 'lead_014',
    name: 'Connor Blake',
    company: 'Blake Outdoor Supply',
    email: 'connor@blakeoutdoor.com',
    phone: '+1 (406) 555-0175',
    stage: 'won',
    source: 'Website',
    owner: 'Jordan Reyes',
    value: 29500,
    createdAt: '2026-05-29T11:50:00Z',
  },
  {
    id: 'lead_015',
    name: 'Petra Novak',
    company: 'Novak Precision Tools',
    email: 'petra@novaktools.cz',
    phone: '+420 2 5555 0163',
    stage: 'lost',
    source: 'Cold Outreach',
    owner: 'Marcus Webb',
    value: 37200,
    createdAt: '2026-05-22T13:35:00Z',
  },
  {
    id: 'lead_016',
    name: 'Ben Okonkwo',
    company: 'Riverside Analytics',
    email: 'ben@riversideanalytics.com',
    phone: '+1 (773) 555-0189',
    stage: 'lost',
    source: 'Social Media',
    owner: 'Priya Shah',
    value: 21900,
    createdAt: '2026-05-14T16:05:00Z',
  },
];

function seedFrom(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return hash;
}

function pick<T>(items: T[], seed: number, salt: number): T {
  return items[(seed + salt) % items.length];
}

function daysAgoIso(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

const ACTIVITY_TEMPLATES: Array<{ type: LeadActivity['type']; description: string }> = [
  { type: 'call', description: 'Discovery call completed' },
  { type: 'email', description: 'Follow-up email sent' },
  { type: 'meeting', description: 'Demo scheduled' },
  { type: 'note', description: 'Budget confirmed for this quarter' },
];

function buildActivityFor(lead: Lead): LeadActivity[] {
  const seed = seedFrom(lead.id);
  const extraCount = 1 + (seed % ACTIVITY_TEMPLATES.length);

  const generated = Array.from({ length: extraCount }, (_, index) => {
    const template = pick(ACTIVITY_TEMPLATES, seed, index);
    return {
      id: `act_${lead.id}_${index}`,
      leadId: lead.id,
      type: template.type,
      description: template.description,
      actor: lead.owner,
      createdAt: daysAgoIso(1 + index * 3 + (seed % 3)),
    };
  });

  const createdEvent: LeadActivity = {
    id: `act_${lead.id}_created`,
    leadId: lead.id,
    type: 'created',
    description: `Lead captured from ${lead.source}`,
    actor: lead.owner,
    createdAt: lead.createdAt,
  };

  return [...generated, createdEvent].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export const INITIAL_LEAD_ACTIVITY: Record<string, LeadActivity[]> = Object.fromEntries(
  MOCK_LEADS.map((lead) => [lead.id, buildActivityFor(lead)]),
);
