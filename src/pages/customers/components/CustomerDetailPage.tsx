import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Clock, FolderOpen, NotebookPen, Pencil, Trash2, UserRound } from 'lucide-react';
import { Avatar } from '@/components/common/Avatar';
import { StatusBadge } from '@/components/badges/StatusBadge';
import { Button } from '@/components/buttons/Button';
import { IconButton } from '@/components/buttons/IconButton';
import { Tabs } from '@/components/common/Tabs';
import type { TabItem } from '@/components/common/Tabs';
import { EmptyState } from '@/components/common/EmptyState';
import { PageLoader } from '@/components/common/PageLoader';
import { ConfirmDialog } from '@/components/modals/ConfirmDialog';
import { CustomerFormDrawer } from '@/pages/customers/components/CustomerFormDrawer';
import { OverviewTab } from '@/pages/customers/components/tabs/OverviewTab';
import { TimelineTab } from '@/pages/customers/components/tabs/TimelineTab';
import { NotesTab } from '@/pages/customers/components/tabs/NotesTab';
import { FilesTab } from '@/pages/customers/components/tabs/FilesTab';
import { useCustomer, useCustomersStore } from '@/store/customers.store';
import { toast } from '@/store/toast.store';
import { ROUTES } from '@/constants/routes.constants';
import { CUSTOMER_STATUS_LABEL, CUSTOMER_STATUS_TONE } from '@/constants/customer.constants';

type DetailTab = 'overview' | 'timeline' | 'notes' | 'files';

const TABS: TabItem<DetailTab>[] = [
  { id: 'overview', label: 'Overview', icon: UserRound },
  { id: 'timeline', label: 'Timeline', icon: Clock },
  { id: 'notes', label: 'Notes', icon: NotebookPen },
  { id: 'files', label: 'Files', icon: FolderOpen },
];

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const customer = useCustomer(id);
  const isLoading = useCustomersStore((state) => state.isLoading);
  const fetchCustomers = useCustomersStore((state) => state.fetchCustomers);
  const fetchCustomerDetails = useCustomersStore((state) => state.fetchCustomerDetails);
  const deleteCustomer = useCustomersStore((state) => state.deleteCustomer);

  const [activeTab, setActiveTab] = useState<DetailTab>('overview');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [detailsFetched, setDetailsFetched] = useState(false);

  // Ensure customers list is loaded (covers direct URL navigation / page refresh)
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Fetch notes, timeline, and files once the customer id is known
  useEffect(() => {
    if (id && !detailsFetched) {
      fetchCustomerDetails(id).then(() => setDetailsFetched(true));
    }
  }, [id, fetchCustomerDetails, detailsFetched]);

  if (!customer) {
    if (isLoading) return <PageLoader />;
    return (
      <EmptyState
        icon={UserRound}
        title="Customer not found"
        description="This account may have been deleted."
        action={
          <Button variant="secondary" onClick={() => navigate(ROUTES.CUSTOMERS)}>
            Back to customers
          </Button>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <IconButton
        icon={<ArrowLeft size={16} />}
        label="Back to customers"
        onClick={() => navigate(ROUTES.CUSTOMERS)}
        className="-ml-2"
      />

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex items-center gap-4">
          <Avatar name={customer.name} size="lg" />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight text-foreground">{customer.name}</h1>
              <StatusBadge
                label={CUSTOMER_STATUS_LABEL[customer.status]}
                tone={CUSTOMER_STATUS_TONE[customer.status]}
              />
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {customer.company} · Owned by {customer.owner}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setIsEditOpen(true)}>
            <Pencil size={15} />
            Edit
          </Button>
          <Button variant="destructive" onClick={() => setIsDeleteOpen(true)}>
            <Trash2 size={15} />
            Delete
          </Button>
        </div>
      </div>

      <Tabs tabs={TABS} value={activeTab} onChange={setActiveTab} />

      {activeTab === 'overview' && <OverviewTab customer={customer} />}
      {activeTab === 'timeline' && <TimelineTab customerId={customer.id} />}
      {activeTab === 'notes' && <NotesTab customerId={customer.id} />}
      {activeTab === 'files' && <FilesTab customerId={customer.id} />}

      <CustomerFormDrawer isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} customer={customer} />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete this customer?"
        description={`This removes ${customer.name} (${customer.company}) and their notes and timeline. This can't be undone.`}
        confirmLabel="Delete customer"
        tone="danger"
        onConfirm={async () => {
          try {
            await deleteCustomer(customer.id);
            toast.success('Customer deleted', { description: `${customer.name} was removed.` });
            navigate(ROUTES.CUSTOMERS);
          } catch (err: any) {
            toast.error('Failed to delete customer', { description: err.response?.data?.message || 'Delete operation failed.' });
          } finally {
            setIsDeleteOpen(false);
          }
        }}
      />
    </div>
  );
}
