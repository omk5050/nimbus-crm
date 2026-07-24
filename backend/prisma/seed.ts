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

  // ─── Admin Employee & User ────────────────────────────────────
  const adminEmployee = await prisma.employee.upsert({
    where: { email: 'jordan@nimbus.example.com' },
    update: {},
    create: {
      companyId: company.id,
      name: 'Jordan Reyes',
      email: 'jordan@nimbus.example.com',
      phone: '+1 (555) 000-0000',
      role: 'Sales Director',
      department: 'Sales',
      status: 'active',
      hireDate: new Date('2021-03-15'),
      avatarColor: '#6366f1',
    },
  });

  const PASSWORD = await bcrypt.hash('Password123!', 12);
  await prisma.user.upsert({
    where: { employeeId: adminEmployee.id },
    update: { passwordHash: PASSWORD },
    create: {
      employeeId: adminEmployee.id,
      passwordHash: PASSWORD,
      role: 'admin',
      hasAccess: true,
    },
  });

  console.log('✅ Admin user account ready');
  console.log('\n🎉 Initialization complete! Database is clean and empty.');
  console.log('\n📋 Login credentials:');
  console.log('   Email   : jordan@nimbus.example.com');
  console.log('   Password: Password123!\n');
}

main()
  .catch((e) => {
    console.error('❌ Clean script failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
