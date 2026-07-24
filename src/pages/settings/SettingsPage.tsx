import { Route, Routes } from 'react-router';
import { SettingsTabNav } from '@/pages/settings/components/SettingsTabNav';
import CompanyProfilePage from '@/pages/settings/components/CompanyProfilePage';
import UsersPage from '@/pages/settings/components/UsersPage';
import RolesPermissionsPage from '@/pages/settings/components/RolesPermissionsPage';
import PreferencesPage from '@/pages/settings/components/PreferencesPage';

/**
 * Mounted at `/settings/*` by AppRouter. Owns its own sub-routing across
 * Company Profile, Users, Roles & Permissions, and Preferences, mirroring
 * the Sales/Reports pill-tab + nested-routes structure.
 */
export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your company profile, team access, and personal preferences.
        </p>
      </div>

      <SettingsTabNav />

      <Routes>
        <Route index element={<CompanyProfilePage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="roles" element={<RolesPermissionsPage />} />
        <Route path="preferences" element={<PreferencesPage />} />
      </Routes>
    </div>
  );
}
