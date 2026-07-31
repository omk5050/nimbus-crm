import bcrypt from 'bcryptjs';
import { prisma } from '@/config/prisma';

/**
 * Ensures demo company and the 4 role test accounts exist in MongoDB on server startup.
 */
export async function ensureDefaultAccountsExist(): Promise<void> {
  try {
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

    const PASSWORD_HASH = await bcrypt.hash('Password123!', 10);

    const testAccounts = [
      {
        email: 'admin@nimbus.example.com',
        name: 'Jordan Reyes',
        role: 'admin' as const,
        department: 'Sales' as const,
        title: 'System Admin',
        avatarColor: '#6366f1',
      },
      {
        email: 'jordan@nimbus.example.com',
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

    for (const acc of testAccounts) {
      const employee = await prisma.employee.upsert({
        where: { email: acc.email },
        update: { role: acc.title, department: acc.department },
        create: {
          companyId: company.id,
          name: acc.name,
          email: acc.email,
          phone: '+1 (555) 019-2834',
          role: acc.title,
          department: acc.department,
          status: 'active',
          hireDate: new Date('2022-01-15'),
          avatarColor: acc.avatarColor,
        },
      });

      await prisma.user.upsert({
        where: { employeeId: employee.id },
        update: { passwordHash: PASSWORD_HASH, role: acc.role, hasAccess: true },
        create: {
          employeeId: employee.id,
          passwordHash: PASSWORD_HASH,
          role: acc.role,
          hasAccess: true,
        },
      });
    }

    console.log('✅ Default role test accounts verified in MongoDB');
  } catch (error) {
    console.error('⚠️ Could not verify default accounts on startup:', error);
  }
}
