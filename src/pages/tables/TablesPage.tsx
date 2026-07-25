import { useEffect, useState } from 'react';
import { Clock, Plus, RefreshCw, UserCheck, Utensils, CheckCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/buttons/Button';
import { Card } from '@/components/cards/Card';
import { StatusBadge } from '@/components/badges/StatusBadge';
import { ConfirmDialog } from '@/components/modals/ConfirmDialog';
import { TextField } from '@/components/inputs/TextField';
import { useTablesStore } from '@/store/tables.store';
import { toast } from '@/store/toast.store';
import type { Table, TableStatus } from '@/types/table.types';

export default function TablesPage() {
  const { tables, isLoading, fetchTables, createTable, reserveTable, extendGracePeriod, clearTable, deleteTable } = useTablesStore();
  const [filterStatus, setFilterStatus] = useState<TableStatus | 'all'>('all');

  // Modal states
  const [isNewTableOpen, setIsNewTableOpen] = useState(false);
  const [newTableName, setNewTableName] = useState('');
  const [newTableCapacity, setNewTableCapacity] = useState(4);
  const [newTableGrace, setNewTableGrace] = useState(15);

  const [reservingTable, setReservingTable] = useState<Table | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [graceMinutes, setGraceMinutes] = useState(15);

  const [pendingDelete, setPendingDelete] = useState<Table | null>(null);

  // Live timer tick for grace period countdown
  const [, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredTables = tables.filter((t) => filterStatus === 'all' || t.status === filterStatus);

  const availableCount = tables.filter((t) => t.status === 'available').length;
  const reservedCount = tables.filter((t) => t.status === 'reserved').length;

  async function handleCreateTable() {
    if (!newTableName.trim()) return;
    try {
      await createTable({
        name: newTableName.trim(),
        capacity: Number(newTableCapacity) || 4,
        gracePeriodMinutes: Number(newTableGrace) || 15,
      });
      toast.success('Table created', { description: `${newTableName} added to workspace.` });
      setNewTableName('');
      setIsNewTableOpen(false);
    } catch {
      toast.error('Failed to create table');
    }
  }

  async function handleReserve() {
    if (!reservingTable || !customerName.trim()) return;
    try {
      await reserveTable(reservingTable.id, {
        reservedBy: customerName.trim(),
        gracePeriodMinutes: Number(graceMinutes) || 15,
      });
      toast.success('Table reserved', {
        description: `${reservingTable.name} reserved for ${customerName} with ${graceMinutes}-min grace period.`,
      });
      setReservingTable(null);
      setCustomerName('');
    } catch {
      toast.error('Failed to reserve table');
    }
  }

  async function handleExtend(table: Table) {
    try {
      await extendGracePeriod(table.id, 10);
      toast.success('Grace period extended', { description: `Added +10 minutes to ${table.name}.` });
    } catch {
      toast.error('Failed to extend grace period');
    }
  }

  async function handleClear(table: Table) {
    try {
      await clearTable(table.id);
      toast.success('Table cleared', { description: `${table.name} is now available.` });
    } catch {
      toast.error('Failed to clear table');
    }
  }

  function getRemainingTime(graceExpiresAt: string | null) {
    if (!graceExpiresAt) return null;
    const expires = new Date(graceExpiresAt).getTime();
    const diff = Math.max(0, Math.floor((expires - Date.now()) / 1000));
    const mins = Math.floor(diff / 60);
    const secs = diff % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground flex items-center gap-2">
            <Utensils size={22} className="text-primary" />
            Table & Grace Period Management
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor real-time table reservations and automated grace period auto-clearing.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => fetchTables()} isLoading={isLoading}>
            <RefreshCw size={15} />
            Refresh
          </Button>
          <Button onClick={() => setIsNewTableOpen(true)}>
            <Plus size={16} />
            Add Table
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-4 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
            <CheckCircle size={20} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Available Tables</p>
            <p className="text-xl font-semibold text-foreground">{availableCount}</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Active Reservations</p>
            <p className="text-xl font-semibold text-foreground">{reservedCount}</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Utensils size={20} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Capacity</p>
            <p className="text-xl font-semibold text-foreground">
              {tables.reduce((acc, t) => acc + t.capacity, 0)} Seats
            </p>
          </div>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <button
          type="button"
          onClick={() => setFilterStatus('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            filterStatus === 'all' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'
          }`}
        >
          All ({tables.length})
        </button>
        <button
          type="button"
          onClick={() => setFilterStatus('available')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            filterStatus === 'available' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'
          }`}
        >
          Available ({availableCount})
        </button>
        <button
          type="button"
          onClick={() => setFilterStatus('reserved')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            filterStatus === 'reserved' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'
          }`}
        >
          Reserved ({reservedCount})
        </button>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTables.map((table) => {
          const isReserved = table.status === 'reserved';
          const remainingStr = isReserved ? getRemainingTime(table.graceExpiresAt) : null;

          return (
            <Card key={table.id} className="p-5 flex flex-col justify-between gap-4 border border-border">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{table.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{table.capacity} Seats</p>
                  </div>
                  <StatusBadge
                    label={isReserved ? 'Reserved' : 'Available'}
                    tone={isReserved ? 'warning' : 'success'}
                  />
                </div>

                {isReserved && (
                  <div className="mt-4 rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 text-xs">
                    <p className="font-medium text-amber-600 dark:text-amber-400">
                      Reserved by: <span className="font-semibold text-foreground">{table.reservedBy}</span>
                    </p>
                    <div className="mt-2 flex items-center justify-between font-mono text-amber-700 dark:text-amber-300">
                      <span className="flex items-center gap-1">
                        <Clock size={13} />
                        Grace timer:
                      </span>
                      <span className="font-bold text-sm">{remainingStr}</span>
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Will auto-clear when countdown hits zero & trigger Bell notification.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-border pt-3">
                {isReserved ? (
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm" onClick={() => handleClear(table)}>
                      Clear
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleExtend(table)}>
                      <Clock size={13} />
                      +10m
                    </Button>
                  </div>
                ) : (
                  <Button size="sm" onClick={() => { setReservingTable(table); setCustomerName(''); }}>
                    <UserCheck size={14} />
                    Reserve
                  </Button>
                )}

                <button
                  type="button"
                  onClick={() => setPendingDelete(table)}
                  className="text-muted-foreground hover:text-destructive p-1 rounded-md"
                  title="Delete table"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Modal: Reserve Table */}
      {reservingTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-card p-6 border border-border shadow-xl">
            <h2 className="text-lg font-semibold text-foreground">Reserve {reservingTable.name}</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Enter customer details and set grace period duration before auto-clearing.
            </p>

            <div className="mt-4 flex flex-col gap-4">
              <TextField
                label="Customer / Party Name"
                placeholder="e.g. Sarah Connor"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Grace Period (Minutes)
                </label>
                <select
                  value={graceMinutes}
                  onChange={(e) => setGraceMinutes(Number(e.target.value))}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value={1}>1 Minute (Fast Test)</option>
                  <option value={5}>5 Minutes</option>
                  <option value={15}>15 Minutes (Default)</option>
                  <option value={30}>30 Minutes</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setReservingTable(null)}>
                Cancel
              </Button>
              <Button onClick={handleReserve} disabled={!customerName.trim()}>
                Confirm Reservation
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add New Table */}
      {isNewTableOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-card p-6 border border-border shadow-xl">
            <h2 className="text-lg font-semibold text-foreground">Add New Table</h2>
            <div className="mt-4 flex flex-col gap-4">
              <TextField
                label="Table Name / Number"
                placeholder="e.g. Table 7 (Bar)"
                value={newTableName}
                onChange={(e) => setNewTableName(e.target.value)}
              />
              <TextField
                label="Seating Capacity"
                type="number"
                value={newTableCapacity}
                onChange={(e) => setNewTableCapacity(Number(e.target.value))}
              />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setIsNewTableOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTable} disabled={!newTableName.trim()}>
                Create Table
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        title="Delete this table?"
        description={pendingDelete ? `This removes ${pendingDelete.name} from your workspace.` : undefined}
        confirmLabel="Delete table"
        tone="danger"
        onConfirm={async () => {
          if (!pendingDelete) return;
          try {
            await deleteTable(pendingDelete.id);
            toast.success('Table deleted');
          } catch {
            toast.error('Failed to delete table');
          } finally {
            setPendingDelete(null);
          }
        }}
      />
    </div>
  );
}
