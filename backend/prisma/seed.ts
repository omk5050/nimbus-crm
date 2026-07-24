/**
 * Prisma seed script — populates the database with realistic demo data
 * that mirrors what the frontend's mock/ files contained.
 *
 * Run with: npm run db:seed
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Nimbus CRM database...');

  // ─── Company ──────────────────────────────────────────────────
  const company = await prisma.company.upsert({
    where: { id: 'comp_nimbus_demo' },
    update: {},
    create: {
      id: 'comp_nimbus_demo',
      name: 'Nimbus Corp',
      plan: 'growth',
      industry: 'Technology',
      website: 'https://nimbus.example.com',
      address: '100 Market St, San Francisco, CA 94105',
      timezone: 'America/Los_Angeles',
    },
  });
  console.log(`✅ Company: ${company.name}`);

  // ─── Employees ────────────────────────────────────────────────
  const employeeData = [
    { name: 'Jordan Reyes', email: 'jordan@nimbus.example.com', role: 'Sales Director', department: 'Sales' as const, hireDate: '2021-03-15', avatarColor: '#6366f1' },
    { name: 'Priya Shah', email: 'priya@nimbus.example.com', role: 'Senior Sales Rep', department: 'Sales' as const, hireDate: '2022-01-10', avatarColor: '#ec4899' },
    { name: 'Marcus Webb', email: 'marcus@nimbus.example.com', role: 'Account Executive', department: 'Sales' as const, hireDate: '2022-06-20', avatarColor: '#f59e0b' },
    { name: 'Aisha Khan', email: 'aisha@nimbus.example.com', role: 'Support Lead', department: 'Support' as const, hireDate: '2021-08-01', avatarColor: '#10b981' },
    { name: 'Lucas Chen', email: 'lucas@nimbus.example.com', role: 'Marketing Manager', department: 'Marketing' as const, hireDate: '2023-02-14', avatarColor: '#3b82f6' },
  ];

  const employees = [];
  for (const data of employeeData) {
    const emp = await prisma.employee.upsert({
      where: { email: data.email },
      update: {},
      create: {
        companyId: company.id,
        name: data.name,
        email: data.email,
        phone: '+1 (555) 000-0000',
        role: data.role,
        department: data.department,
        status: 'active',
        hireDate: new Date(data.hireDate),
        avatarColor: data.avatarColor,
        performance: {
          create: {
            score: Math.floor(70 + Math.random() * 30),
            dealsClosed: Math.floor(Math.random() * 20),
            tasksCompleted: Math.floor(Math.random() * 50),
            trend: parseFloat((Math.random() * 10 - 3).toFixed(1)),
          },
        },
      },
    });
    employees.push(emp);
  }
  console.log(`✅ Employees: ${employees.length} ready`);

  // ─── Users (auth accounts for each employee) ──────────────────
  const PASSWORD = await bcrypt.hash('Password123!', 12);
  const ROLES = ['admin', 'sales_rep', 'sales_rep', 'support', 'manager'] as const;

  for (let i = 0; i < employees.length; i++) {
    const emp = employees[i];
    await prisma.user.upsert({
      where: { employeeId: emp.id },
      update: { passwordHash: PASSWORD },
      create: {
        employeeId: emp.id,
        passwordHash: PASSWORD,
        role: ROLES[i],
        hasAccess: true,
      },
    });
  }
  console.log(`✅ Users: ${employees.length} accounts ready (password: Password123!)`);

  // ─── Customers (create if empty) ─────────────────────────────
  const existingCustCount = await prisma.customer.count();
  let customers: any[] = [];

  if (existingCustCount === 0) {
    const customerNames = [
      ['Harlan Ortiz', 'Meridian Foods', 'harlan@meridianfoods.com', 'active', 'Retail'],
      ['Sophie Turner', 'Bluewave Logistics', 'sophie@bluewave.com', 'active', 'Logistics'],
      ['Derek Mills', 'Cedar & Co.', 'derek@cedarco.com', 'prospect', 'Retail'],
      ['Elena Vasquez', 'Fernwood Analytics', 'elena@fernwood.com', 'active', 'Technology'],
      ['Omar Farooq', 'Skyline Retail Co.', 'omar@skylineretail.com', 'inactive', 'Retail'],
    ];

    for (const [name, co, email, status, industry] of customerNames) {
      const cust = await prisma.customer.create({
        data: {
          companyId: company.id,
          name,
          company: co,
          email,
          phone: '+1 (555) 100-0000',
          status: status as any,
          industry: (industry.includes('Logistics') ? 'Logistics' : industry.includes('Retail') ? 'Retail' : 'Technology') as any,
          owner: employees[0].name,
          address: '123 Main St, Anytown, USA',
          lifetimeValue: Math.floor(Math.random() * 200000),
          tags: ['enterprise', 'priority'],
        },
      });
      customers.push(cust);
    }
    console.log(`✅ Customers: ${customers.length} created`);
  } else {
    customers = await prisma.customer.findMany({ take: 5 });
  }

  // ─── Leads (create if empty) ──────────────────────────────────
  const existingLeadCount = await prisma.lead.count();
  if (existingLeadCount === 0) {
    const leadStages = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'] as const;
    const leadSources = ['Website', 'Referral', 'Cold_Outreach', 'Social_Media', 'Partner'] as const;

    for (let i = 0; i < 8; i++) {
      await prisma.lead.create({
        data: {
          companyId: company.id,
          name: `Lead Contact ${i + 1}`,
          company: `Prospect Corp ${i + 1}`,
          email: `lead${i + 1}@prospect${i + 1}.com`,
          phone: '+1 (555) 200-0000',
          stage: leadStages[i % leadStages.length],
          source: leadSources[i % leadSources.length],
          owner: employees[i % employees.length].name,
          value: (i + 1) * 12500,
          activity: {
            create: { type: 'created', description: `Lead captured from ${leadSources[i % leadSources.length]}`, actor: employees[0].name },
          },
        },
      });
    }
    console.log(`✅ Leads: 8 created`);
  }

  // ─── Deals (create if empty) ──────────────────────────────────
  const existingDealCount = await prisma.deal.count();
  if (existingDealCount === 0 && customers.length > 0) {
    const dealStages = ['qualifying', 'proposal', 'negotiation', 'won', 'lost'] as const;
    for (let i = 0; i < 5; i++) {
      await prisma.deal.create({
        data: {
          companyId: company.id,
          title: `Deal ${i + 1} — ${customers[i % customers.length].company}`,
          customerId: customers[i % customers.length].id,
          customerName: customers[i % customers.length].name,
          company: customers[i % customers.length].company,
          stage: dealStages[i % dealStages.length],
          value: (i + 1) * 25000,
          owner: employees[i % employees.length].name,
          expectedCloseDate: new Date(Date.now() + (i + 1) * 30 * 86400000),
        },
      });
    }
    console.log(`✅ Deals: 5 created`);
  }

  // ─── Tasks (create if empty) ──────────────────────────────────
  const existingTaskCount = await prisma.task.count();
  if (existingTaskCount === 0 && customers.length > 0) {
    const taskStatuses = ['todo', 'in_progress', 'in_review', 'done'] as const;
    const taskPriorities = ['low', 'medium', 'high'] as const;

    for (let i = 0; i < 6; i++) {
      await prisma.task.create({
        data: {
          companyId: company.id,
          title: `Task ${i + 1}: Follow up on ${customers[i % customers.length].company}`,
          description: `Review the account and send follow-up email to ${customers[i % customers.length].name}.`,
          assignee: employees[i % employees.length].name,
          relatedTo: customers[i % customers.length].company,
          dueDate: new Date(Date.now() + (i + 1) * 7 * 86400000),
          priority: taskPriorities[i % taskPriorities.length],
          status: taskStatuses[i % taskStatuses.length],
        },
      });
    }
    console.log(`✅ Tasks: 6 created`);
  }

  // ─── Notifications (create if empty) ──────────────────────────
  const adminUser = await prisma.user.findUnique({ where: { employeeId: employees[0].id } });
  if (adminUser) {
    const notifCount = await prisma.notification.count({ where: { userId: adminUser.id } });
    if (notifCount === 0) {
      await prisma.notification.createMany({
        data: [
          { userId: adminUser.id, type: 'lead', title: 'New lead assigned', description: 'Lead Contact 1 from Website was assigned to you', isRead: false, link: '/leads' },
          { userId: adminUser.id, type: 'deal', title: 'Deal moved to Negotiation', description: 'Deal 3 moved to Negotiation stage', isRead: false, link: '/sales' },
          { userId: adminUser.id, type: 'task', title: 'Task due today', description: 'Task 1 is due today', isRead: true, link: '/tasks' },
          { userId: adminUser.id, type: 'system', title: 'Welcome to Nimbus CRM', description: 'Your workspace has been set up and seeded with demo data', isRead: false },
        ],
      });
      console.log(`✅ Notifications: 4 created`);
    }
  }

  console.log('\n🎉 Seeding complete!');
  console.log('\n📋 Test credentials:');
  console.log('   Email   : jordan@nimbus.example.com');
  console.log('   Password: Password123!');
  console.log('   Role    : admin\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
