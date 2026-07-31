/**
 * Prisma seed script — cleans out demo data and ensures admin auth user exists.
 * Run with: npm run db:seed
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Cleaning demo records and initializing workspace...');

  // Clear demo data
  await prisma.customerTimelineEvent.deleteMany({});
  await prisma.customerNote.deleteMany({});
  await prisma.customerFile.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.invoiceItem.deleteMany({});
  await prisma.invoice.deleteMany({});
  await prisma.quotationItem.deleteMany({});
  await prisma.quotation.deleteMany({});
  await prisma.deal.deleteMany({});
  await prisma.customer.deleteMany({});
  await prisma.leadActivity.deleteMany({});
  await prisma.lead.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.notification.deleteMany({});

  console.log('✅ Demo records cleared');

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

  // ─── Test Accounts (All 4 System Roles) ─────────────────────
  const TEST_PASSWORD_HASH = await bcrypt.hash('Password123!', 10);

  const testUsersData = [
    {
      email: 'admin@nimbus.example.com',
      name: 'Jordan Reyes',
      role: 'admin' as const,
      department: 'Sales' as const,
      title: 'System Admin',
      avatarColor: '#6366f1',
    },
    {
      email: 'jordan@nimbus.example.com', // Demo alias for Admin
      name: 'Jordan Reyes',
      role: 'admin' as const,
      department: 'Sales' as const,
      title: 'Sales Director',
      avatarColor: '#6366f1',
    },
    {
      email: 'manager@nimbus.example.com',
      name: 'Marcus Vance',
      role: 'manager' as const,
      department: 'Engineering' as const,
      title: 'Engineering Manager',
      avatarColor: '#10b981',
    },
    {
      email: 'sales@nimbus.example.com',
      name: 'Sarah Chen',
      role: 'sales_rep' as const,
      department: 'Sales' as const,
      title: 'Senior Sales Representative',
      avatarColor: '#f59e0b',
    },
    {
      email: 'support@nimbus.example.com',
      name: 'David Miller',
      role: 'support' as const,
      department: 'Support' as const,
      title: 'Customer Support Lead',
      avatarColor: '#3b82f6',
    },
  ];

  for (const account of testUsersData) {
    const employee = await prisma.employee.upsert({
      where: { email: account.email },
      update: { role: account.title, department: account.department },
      create: {
        companyId: company.id,
        name: account.name,
        email: account.email,
        phone: '+1 (555) 019-2834',
        role: account.title,
        department: account.department,
        status: 'active',
        hireDate: new Date('2022-01-15'),
        avatarColor: account.avatarColor,
      },
    });

    await prisma.user.upsert({
      where: { employeeId: employee.id },
      update: { passwordHash: TEST_PASSWORD_HASH, role: account.role, hasAccess: true },
      create: {
        employeeId: employee.id,
        passwordHash: TEST_PASSWORD_HASH,
        role: account.role,
        hasAccess: true,
      },
    });
  }

  console.log('✅ Seeded Admin, Manager, Sales Rep, and Support test accounts');
  console.log('\n🎉 Initialization complete! All 4 role accounts ready.');
  console.log('\n📋 Test Login Credentials (Password for all: Password123!):');
  console.log('   1. ADMIN    : admin@nimbus.example.com   (or jordan@nimbus.example.com)');
  console.log('   2. MANAGER  : manager@nimbus.example.com');
  console.log('   3. SALES REP: sales@nimbus.example.com');
  console.log('   4. SUPPORT  : support@nimbus.example.com\n');
}

main()
  .catch((e) => {
    console.error('❌ Clean script failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
