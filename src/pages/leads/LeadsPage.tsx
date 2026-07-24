import { Route, Routes } from 'react-router';
import LeadListPage from '@/pages/leads/components/LeadListPage';
import LeadDetailPage from '@/pages/leads/components/LeadDetailPage';

/**
 * Mounted at `/leads/*` by AppRouter. Owns its own sub-routing so the
 * board/list view and detail view can be separate pages while still
 * sharing this one entry in the top-level route table.
 */
export default function LeadsPage() {
  return (
    <Routes>
      <Route index element={<LeadListPage />} />
      <Route path=":id" element={<LeadDetailPage />} />
    </Routes>
  );
}
