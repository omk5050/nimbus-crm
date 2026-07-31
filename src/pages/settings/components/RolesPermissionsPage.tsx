import { useState } from 'react';
import { Card, CardHeader } from '@/components/cards/Card';
import { Checkbox } from '@/components/inputs/Checkbox';
import { useAccessStore, useRoleUserCount } from '@/store/access.store';
import {
  PERMISSION_ACTION_LABEL,
  PERMISSION_ACTIONS,
  PERMISSION_MODULE_LABEL,
  PERMISSION_MODULES,
  ROLE_DEFINITIONS,
} from '@/constants/settings.constants';
import type { UserRole } from '@/types/auth.types';
import type { RoleDefinition } from '@/types/settings.types';
import { cn } from '@/utils/cn';

function RoleOverviewCard({ definition, isSelected, onSelect }: { definition: RoleDefinition; isSelected: boolean; onSelect: () => void }) {
  const userCount = useRoleUserCount(definition.role);

  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex-1 text-left"
    >
      <Card
        className={cn(
          'flex h-full flex-col gap-2 transition-colors',
          isSelected ? 'border-primary/60 bg-accent/30' : 'hover:border-primary/30',
        )}
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-card-foreground">{definition.label}</p>
          <span className="text-xs text-muted-foreground">{userCount} user{userCount === 1 ? '' : 's'}</span>
        </div>
        <p className="text-xs text-muted-foreground">{definition.description}</p>
      </Card>
    </button>
  );
}

export default function RolesPermissionsPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const rolePermissions = useAccessStore((state) => state.rolePermissions);
  const togglePermission = useAccessStore((state) => state.togglePermission);
  const isAdmin = selectedRole === 'admin';

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {ROLE_DEFINITIONS.map((definition) => (
          <RoleOverviewCard
            key={definition.role}
            definition={definition}
            isSelected={selectedRole === definition.role}
            onSelect={() => setSelectedRole(definition.role)}
          />
        ))}
      </div>

      <Card noPadding>
        <div className="p-5 pb-0">
          <CardHeader
            title={`${ROLE_DEFINITIONS.find((d) => d.role === selectedRole)?.label} permissions`}
            description={
              isAdmin
                ? 'Admins always have full access — this role is locked.'
                : 'Toggle what this role can view, edit, or delete in each module.'
            }
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="px-5 py-2 font-medium">Module</th>
                {PERMISSION_ACTIONS.map((action) => (
                  <th key={action} className="px-5 py-2 text-center font-medium">
                    {PERMISSION_ACTION_LABEL[action]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERMISSION_MODULES.map((module) => (
                <tr key={module} className="border-b border-border last:border-0">
                  <td className="px-5 py-3 font-medium text-foreground">{PERMISSION_MODULE_LABEL[module]}</td>
                  {PERMISSION_ACTIONS.map((action) => (
                    <td key={action} className="px-5 py-3 text-center">
                      <Checkbox
                        checked={isAdmin ? true : Boolean(rolePermissions[selectedRole]?.[module]?.[action])}
                        onChange={() => !isAdmin && togglePermission(selectedRole, module, action)}
                        disabled={isAdmin}
                        aria-label={`${PERMISSION_ACTION_LABEL[action]} ${PERMISSION_MODULE_LABEL[module]}`}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
