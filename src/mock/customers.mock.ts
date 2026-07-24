import type {
  Customer,
  CustomerFile,
  CustomerNote,
  CustomerTimelineEvent,
} from '@/types/customer.types';

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'cust_001',
    name: 'Harlan Ortiz',
    company: 'Cedar & Co.',
    email: 'harlan@cedarandco.com',
    phone: '+1 (415) 555-0142',
    status: 'active',
    industry: 'Retail',
    owner: 'Jordan Reyes',
    address: '221 Baker Street, San Francisco, CA',
    lifetimeValue: 84500,
    tags: ['Enterprise', 'Renewal Q3'],
    createdAt: '2026-07-14T09:12:00Z',
  },
  {
    id: 'cust_002',
    name: 'Naomi Fields',
    company: 'Fernwood Analytics',
    email: 'naomi@fernwoodanalytics.io',
    phone: '+1 (206) 555-0118',
    status: 'prospect',
    industry: 'Technology',
    owner: 'Aisha Khan',
    address: '88 Harbor View, Seattle, WA',
    lifetimeValue: 0,
    tags: ['Inbound'],
    createdAt: '2026-07-12T14:40:00Z',
  },
  {
    id: 'cust_003',
    name: 'Diego Salinas',
    company: 'Bluewave Logistics',
    email: 'diego@bluewavelogistics.com',
    phone: '+1 (713) 555-0173',
    status: 'active',
    industry: 'Logistics',
    owner: 'Marcus Webb',
    address: '4 Freight Yard Rd, Houston, TX',
    lifetimeValue: 132800,
    tags: ['Enterprise'],
    createdAt: '2026-07-09T11:05:00Z',
  },
  {
    id: 'cust_004',
    name: 'Els Van Dijk',
    company: 'Meridian Foods',
    email: 'els@meridianfoods.eu',
    phone: '+31 20 555 0199',
    status: 'active',
    industry: 'Manufacturing',
    owner: 'Priya Shah',
    address: 'Prinsengracht 12, Amsterdam, NL',
    lifetimeValue: 210400,
    tags: ['Enterprise', 'Multi-year'],
    createdAt: '2026-07-06T08:30:00Z',
  },
  {
    id: 'cust_005',
    name: 'Renee Okafor',
    company: 'Northgate Supply',
    email: 'renee@northgatesupply.com',
    phone: '+1 (312) 555-0164',
    status: 'inactive',
    industry: 'Retail',
    owner: 'Jordan Reyes',
    address: '900 Commerce Ave, Chicago, IL',
    lifetimeValue: 18200,
    tags: ['Churn risk'],
    createdAt: '2026-07-02T16:20:00Z',
  },
  {
    id: 'cust_006',
    name: 'Priya Nair',
    company: 'Skyline Retail Co.',
    email: 'priya.nair@skylineretail.co',
    phone: '+1 (646) 555-0110',
    status: 'active',
    industry: 'Retail',
    owner: 'Marcus Webb',
    address: '55 Fifth Avenue, New York, NY',
    lifetimeValue: 96700,
    tags: ['Key account'],
    createdAt: '2026-06-27T10:15:00Z',
  },
  {
    id: 'cust_007',
    name: 'Tomas Brandt',
    company: 'Northwind Freight',
    email: 'tomas@northwindfreight.com',
    phone: '+1 (503) 555-0187',
    status: 'prospect',
    industry: 'Logistics',
    owner: 'Aisha Khan',
    address: '17 Portside Way, Portland, OR',
    lifetimeValue: 0,
    tags: ['Referral'],
    createdAt: '2026-06-21T13:50:00Z',
  },
  {
    id: 'cust_008',
    name: 'Grace Liao',
    company: 'Amberlight Studios',
    email: 'grace@amberlightstudios.com',
    phone: '+1 (323) 555-0129',
    status: 'active',
    industry: 'Technology',
    owner: 'Jordan Reyes',
    address: '400 Sunset Blvd, Los Angeles, CA',
    lifetimeValue: 54300,
    tags: ['Growth tier'],
    createdAt: '2026-06-14T09:05:00Z',
  },
  {
    id: 'cust_009',
    name: 'Michael Fenwick',
    company: 'Fenwick & Partners',
    email: 'michael@fenwickpartners.com',
    phone: '+44 20 7946 0958',
    status: 'active',
    industry: 'Finance',
    owner: 'Priya Shah',
    address: '12 Threadneedle St, London, UK',
    lifetimeValue: 178900,
    tags: ['Enterprise', 'Multi-year'],
    createdAt: '2026-06-08T15:35:00Z',
  },
  {
    id: 'cust_010',
    name: 'Sofia Marchetti',
    company: 'Marchetti Hospitality Group',
    email: 'sofia@marchettihg.it',
    phone: '+39 06 5555 0143',
    status: 'inactive',
    industry: 'Hospitality',
    owner: 'Marcus Webb',
    address: 'Via del Corso 45, Rome, IT',
    lifetimeValue: 27600,
    tags: [],
    createdAt: '2026-05-30T07:45:00Z',
  },
  {
    id: 'cust_011',
    name: 'Aditi Rao',
    company: 'Clearpath Health',
    email: 'aditi.rao@clearpathhealth.org',
    phone: '+1 (612) 555-0155',
    status: 'active',
    industry: 'Healthcare',
    owner: 'Aisha Khan',
    address: '3000 Riverside Dr, Minneapolis, MN',
    lifetimeValue: 61200,
    tags: ['Key account'],
    createdAt: '2026-05-22T12:10:00Z',
  },
  {
    id: 'cust_012',
    name: 'Owen Castellano',
    company: 'Brightline Academy',
    email: 'owen@brightlineacademy.edu',
    phone: '+1 (480) 555-0121',
    status: 'prospect',
    industry: 'Education',
    owner: 'Jordan Reyes',
    address: '210 Learning Way, Phoenix, AZ',
    lifetimeValue: 0,
    tags: ['Inbound', 'Referral'],
    createdAt: '2026-05-11T09:55:00Z',
  },
  {
    id: 'cust_013',
    name: 'Lena Kowalski',
    company: 'Ironclad Manufacturing',
    email: 'lena@ironcladmfg.com',
    phone: '+1 (216) 555-0166',
    status: 'active',
    industry: 'Manufacturing',
    owner: 'Priya Shah',
    address: '88 Foundry Rd, Cleveland, OH',
    lifetimeValue: 143500,
    tags: ['Enterprise'],
    createdAt: '2026-04-29T14:25:00Z',
  },
  {
    id: 'cust_014',
    name: 'Caleb Whitfield',
    company: 'Whitfield & Sons Finance',
    email: 'caleb@whitfieldfinance.com',
    phone: '+1 (404) 555-0138',
    status: 'inactive',
    industry: 'Finance',
    owner: 'Marcus Webb',
    address: '77 Peachtree St, Atlanta, GA',
    lifetimeValue: 9800,
    tags: ['Churn risk'],
    createdAt: '2026-04-15T10:40:00Z',
  },
];

/** Small string hash so each customer deterministically gets the "same" generated detail data on every load. */
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

const NOTE_TEMPLATES = [
  'Had a great intro call — clear interest in the annual plan.',
  'Sent over the updated pricing sheet, awaiting sign-off from their finance team.',
  'Flagged as a strong upsell candidate for the reporting add-on.',
  'Requested a custom onboarding session for their regional teams.',
  'Mentioned budget approval is expected early next quarter.',
];

const TIMELINE_TEMPLATES: Array<{ type: CustomerTimelineEvent['type']; description: string }> = [
  { type: 'call', description: 'Discovery call completed' },
  { type: 'email', description: 'Follow-up proposal sent' },
  { type: 'meeting', description: 'Product walkthrough scheduled' },
  { type: 'deal', description: 'Moved to Negotiation stage' },
];

const FILE_TEMPLATES: Array<{ fileName: string; fileType: CustomerFile['fileType']; sizeLabel: string }> = [
  { fileName: 'Master Service Agreement.pdf', fileType: 'pdf', sizeLabel: '412 KB' },
  { fileName: 'Q3 Pricing Proposal.xlsx', fileType: 'sheet', sizeLabel: '88 KB' },
  { fileName: 'Onboarding Checklist.docx', fileType: 'doc', sizeLabel: '54 KB' },
  { fileName: 'Site Walkthrough.png', fileType: 'image', sizeLabel: '1.8 MB' },
];

function buildNotesFor(customer: Customer): CustomerNote[] {
  const seed = seedFrom(customer.id);
  const count = 1 + (seed % 3);
  return Array.from({ length: count }, (_, index) => ({
    id: `note_${customer.id}_${index}`,
    customerId: customer.id,
    author: customer.owner,
    content: pick(NOTE_TEMPLATES, seed, index),
    createdAt: daysAgoIso(2 + index * 5 + (seed % 4)),
  }));
}

function buildTimelineFor(customer: Customer): CustomerTimelineEvent[] {
  const seed = seedFrom(customer.id);
  const extraCount = 1 + (seed % TIMELINE_TEMPLATES.length);
  const generated = Array.from({ length: extraCount }, (_, index) => {
    const template = pick(TIMELINE_TEMPLATES, seed, index);
    return {
      id: `evt_${customer.id}_${index}`,
      customerId: customer.id,
      type: template.type,
      description: template.description,
      actor: customer.owner,
      createdAt: daysAgoIso(1 + index * 4 + (seed % 3)),
    };
  });

  const createdEvent: CustomerTimelineEvent = {
    id: `evt_${customer.id}_created`,
    customerId: customer.id,
    type: 'created',
    description: 'Account created',
    actor: customer.owner,
    createdAt: customer.createdAt,
  };

  return [...generated, createdEvent].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

function buildFilesFor(customer: Customer): CustomerFile[] {
  const seed = seedFrom(customer.id);
  const count = 1 + (seed % FILE_TEMPLATES.length);
  return Array.from({ length: count }, (_, index) => {
    const template = pick(FILE_TEMPLATES, seed, index);
    return {
      id: `file_${customer.id}_${index}`,
      customerId: customer.id,
      fileName: template.fileName,
      fileType: template.fileType,
      sizeLabel: template.sizeLabel,
      uploadedBy: customer.owner,
      createdAt: daysAgoIso(3 + index * 6),
    };
  });
}

export const INITIAL_CUSTOMER_NOTES: Record<string, CustomerNote[]> = Object.fromEntries(
  MOCK_CUSTOMERS.map((customer) => [customer.id, buildNotesFor(customer)]),
);

export const INITIAL_CUSTOMER_TIMELINE: Record<string, CustomerTimelineEvent[]> = Object.fromEntries(
  MOCK_CUSTOMERS.map((customer) => [customer.id, buildTimelineFor(customer)]),
);

/** Files are read-only in this mock-data phase (no real upload target yet), so no store needed. */
export const CUSTOMER_FILES: Record<string, CustomerFile[]> = Object.fromEntries(
  MOCK_CUSTOMERS.map((customer) => [customer.id, buildFilesFor(customer)]),
);
