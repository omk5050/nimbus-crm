import { prisma } from '@/config/prisma';
import { AppError } from '@/middleware/error.middleware';
import { parsePagination, parseSorting } from '@/utils/pagination';
import type { CustomerInput, CustomerNoteInput, CustomerListQuery } from './customers.schema';

const ALLOWED_SORT = ['name', 'company', 'createdAt', 'lifetimeValue'];

function parseTags(raw: string): string[] {
  return raw.split(',').map((t) => t.trim()).filter(Boolean);
}

export async function listCustomers(companyId: string, query: CustomerListQuery) {
  const { page, limit, skip } = parsePagination(query as Record<string, string | undefined>);
  const orderBy = parseSorting(query as Record<string, string | undefined>, ALLOWED_SORT);

  const where: Record<string, unknown> = { companyId };
  if (query.status) where['status'] = query.status;
  if (query.industry) where['industry'] = query.industry;
  if (query.owner) where['owner'] = { contains: query.owner, mode: 'insensitive' };
  if (query.search) {
    where['OR'] = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { company: { contains: query.search, mode: 'insensitive' } },
      { email: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({ where, orderBy, skip, take: limit }),
    prisma.customer.count({ where }),
  ]);

  return { customers, total, page, limit };
}

export async function getCustomer(companyId: string, id: string) {
  const customer = await prisma.customer.findFirst({
    where: { id, companyId },
    include: {
      notes: { orderBy: { createdAt: 'desc' } },
      files: { orderBy: { createdAt: 'desc' } },
      timeline: { orderBy: { createdAt: 'desc' } },
    },
  });
  if (!customer) throw new AppError(404, 'NOT_FOUND', 'Customer not found');
  return customer;
}

export async function createCustomer(companyId: string, input: CustomerInput, actor: string) {
  return prisma.customer.create({
    data: {
      companyId,
      name: input.name,
      company: input.company,
      email: input.email,
      phone: input.phone,
      status: input.status as any,
      industry: input.industry as any,
      owner: input.owner,
      address: input.address,
      tags: parseTags(input.tags),
      timeline: {
        create: {
          type: 'created',
          description: 'Account created',
          actor,
        },
      },
    },
  });
}

export async function updateCustomer(companyId: string, id: string, input: CustomerInput, actor: string) {
  await assertExists(companyId, id);
  return prisma.customer.update({
    where: { id },
    data: {
      name: input.name,
      company: input.company,
      email: input.email,
      phone: input.phone,
      status: input.status as any,
      industry: input.industry as any,
      owner: input.owner,
      address: input.address,
      tags: parseTags(input.tags),
      timeline: {
        create: {
          type: 'updated',
          description: 'Profile details updated',
          actor,
        },
      },
    },
  });
}

export async function deleteCustomer(companyId: string, id: string) {
  await assertExists(companyId, id);
  await prisma.$transaction([
    prisma.customerNote.deleteMany({ where: { customerId: id } }),
    prisma.customerFile.deleteMany({ where: { customerId: id } }),
    prisma.customerTimelineEvent.deleteMany({ where: { customerId: id } }),
    prisma.deal.deleteMany({ where: { customerId: id } }),
    prisma.quotation.deleteMany({ where: { customerId: id } }),
    prisma.invoice.deleteMany({ where: { customerId: id } }),
    prisma.customer.delete({ where: { id } }),
  ]);
}

export async function getNotes(companyId: string, customerId: string) {
  await assertExists(companyId, customerId);
  return prisma.customerNote.findMany({
    where: { customerId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function addNote(companyId: string, customerId: string, input: CustomerNoteInput, actor: string) {
  await assertExists(companyId, customerId);
  const note = await prisma.customerNote.create({
    data: { customerId, content: input.content, author: actor },
  });
  await prisma.customerTimelineEvent.create({
    data: { customerId, type: 'note', description: 'Note added', actor },
  });
  return note;
}

export async function getFiles(companyId: string, customerId: string) {
  await assertExists(companyId, customerId);
  return prisma.customerFile.findMany({
    where: { customerId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function addFile(
  companyId: string,
  customerId: string,
  fileData: { fileName: string; fileType: string; sizeLabel: string; storageKey: string },
  actor: string,
) {
  await assertExists(companyId, customerId);
  return prisma.customerFile.create({
    data: { customerId, ...fileData, uploadedBy: actor } as any,
  });
}

export async function deleteFile(companyId: string, customerId: string, fileId: string) {
  await assertExists(companyId, customerId);
  await prisma.customerFile.delete({ where: { id: fileId } });
}

export async function getTimeline(companyId: string, customerId: string) {
  await assertExists(companyId, customerId);
  return prisma.customerTimelineEvent.findMany({
    where: { customerId },
    orderBy: { createdAt: 'desc' },
  });
}

// ─── Private helper ───────────────────────────────────────────

async function assertExists(companyId: string, id: string) {
  const exists = await prisma.customer.findFirst({ where: { id, companyId }, select: { id: true } });
  if (!exists) throw new AppError(404, 'NOT_FOUND', 'Customer not found');
}
