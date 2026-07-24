import { prisma } from '@/config/prisma';
import { AppError } from '@/middleware/error.middleware';
import { parsePagination, parseSorting } from '@/utils/pagination';
import type { LeadInput, MoveStageInput, AssignOwnerInput, LogActivityInput, LeadListQuery } from './leads.schema';

type LeadStage = 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';

const ALLOWED_SORT = ['name', 'company', 'value', 'createdAt', 'expectedCloseDate'];

const STAGE_LABELS: Record<LeadStage, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  proposal: 'Proposal',
  won: 'Won',
  lost: 'Lost',
};

export async function listLeads(companyId: string, query: LeadListQuery) {
  const { page, limit, skip } = parsePagination(query as Record<string, string | undefined>);
  const orderBy = parseSorting(query as Record<string, string | undefined>, ALLOWED_SORT);

  const where = {
    companyId,
    ...(query.stage && { stage: query.stage as any }),
    ...(query.source && { source: query.source as any }),
    ...(query.owner && { owner: { contains: query.owner, mode: 'insensitive' as const } }),
    ...(query.search && {
      OR: [
        { name: { contains: query.search, mode: 'insensitive' as const } },
        { company: { contains: query.search, mode: 'insensitive' as const } },
        { email: { contains: query.search, mode: 'insensitive' as const } },
      ],
    }),
  };

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({ where, orderBy, skip, take: limit }),
    prisma.lead.count({ where }),
  ]);

  return { leads, total, page, limit };
}

export async function getLead(companyId: string, id: string) {
  const lead = await prisma.lead.findFirst({
    where: { id, companyId },
    include: { activity: { orderBy: { createdAt: 'desc' } } },
  });
  if (!lead) throw new AppError(404, 'NOT_FOUND', 'Lead not found');
  return lead;
}

export async function createLead(companyId: string, input: LeadInput, actor: string) {
  const lead = await prisma.lead.create({
    data: {
      companyId,
      name: input.name,
      company: input.company,
      email: input.email,
      phone: input.phone,
      stage: input.stage as any,
      source: input.source as any,
      owner: input.owner,
      value: input.value,
      expectedCloseDate: input.expectedCloseDate ? new Date(input.expectedCloseDate) : null,
      activity: {
        create: {
          type: 'created',
          description: `Lead captured from ${input.source}`,
          actor,
        },
      },
    },
  });
  return lead;
}

export async function updateLead(companyId: string, id: string, input: LeadInput, actor: string) {
  await assertExists(companyId, id);
  const lead = await prisma.lead.update({
    where: { id },
    data: {
      name: input.name,
      company: input.company,
      email: input.email,
      phone: input.phone,
      stage: input.stage as any,
      source: input.source as any,
      owner: input.owner,
      value: input.value,
      expectedCloseDate: input.expectedCloseDate ? new Date(input.expectedCloseDate) : null,
      activity: {
        create: { type: 'note', description: 'Lead details updated', actor },
      },
    },
  });
  return lead;
}

export async function deleteLead(companyId: string, id: string) {
  await assertExists(companyId, id);
  await prisma.lead.delete({ where: { id } });
}

export async function moveStage(companyId: string, id: string, input: MoveStageInput, actor: string) {
  const lead = await assertExists(companyId, id);
  const currentStage = lead.stage as LeadStage;
  const newStage = input.stage as LeadStage;
  if (currentStage === newStage) return lead;

  return prisma.lead.update({
    where: { id },
    data: {
      stage: newStage as any,
      activity: {
        create: {
          type: 'stage_change',
          description: `Moved from ${STAGE_LABELS[currentStage]} to ${STAGE_LABELS[newStage]}`,
          actor,
        },
      },
    },
  });
}

export async function assignOwner(companyId: string, id: string, input: AssignOwnerInput, actor: string) {
  const lead = await assertExists(companyId, id);
  if (lead.owner === input.owner) return lead;

  return prisma.lead.update({
    where: { id },
    data: {
      owner: input.owner,
      activity: {
        create: {
          type: 'owner_change',
          description: `Reassigned from ${lead.owner || '(unassigned)'} to ${input.owner}`,
          actor,
        },
      },
    },
  });
}

export async function getActivity(companyId: string, leadId: string) {
  await assertExists(companyId, leadId);
  return prisma.leadActivity.findMany({
    where: { leadId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function logActivity(companyId: string, leadId: string, input: LogActivityInput, actor: string) {
  await assertExists(companyId, leadId);
  return prisma.leadActivity.create({
    data: { leadId, type: input.type as any, description: input.description, actor },
  });
}

async function assertExists(companyId: string, id: string) {
  const lead = await prisma.lead.findFirst({ where: { id, companyId } });
  if (!lead) throw new AppError(404, 'NOT_FOUND', 'Lead not found');
  return lead;
}
