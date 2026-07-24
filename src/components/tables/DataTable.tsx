import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, Columns3 } from 'lucide-react';
import { SearchBar } from '@/components/common/SearchBar';
import { Pagination } from '@/components/common/Pagination';
import { EmptyState } from '@/components/common/EmptyState';
import { Skeleton } from '@/components/common/Skeleton';
import { Popover } from '@/components/common/Popover';
import { Checkbox } from '@/components/inputs/Checkbox';
import { ActionMenu } from '@/components/common/ActionMenu';
import type { ActionMenuItem } from '@/components/common/ActionMenu';
import { cn } from '@/utils/cn';

export interface DataTableColumn<T> {
  id: string;
  header: string;
  cell: (row: T) => ReactNode;
  /** Enables sorting on this column. Return the raw comparable value, not rendered JSX. */
  sortValue?: (row: T) => string | number;
  align?: 'left' | 'right' | 'center';
  /** Set false for columns that must always stay visible (e.g. the primary name column). Default true. */
  hideable?: boolean;
  className?: string;
}

type SortDirection = 'asc' | 'desc';

interface EmptyStateConfig {
  title: string;
  description?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  getRowId: (row: T) => string;
  isLoading?: boolean;
  /** Enables the built-in search box — return the flattened searchable text for a row. */
  getSearchableText?: (row: T) => string;
  searchPlaceholder?: string;
  rowActions?: (row: T) => ActionMenuItem[];
  onRowClick?: (row: T) => void;
  pageSize?: number;
  emptyState?: EmptyStateConfig;
  /** Extra toolbar content rendered next to the search box — typically <FilterDropdown /> instances. */
  toolbarExtra?: ReactNode;
  className?: string;
}

const ALIGN_CLASSES: Record<NonNullable<DataTableColumn<unknown>['align']>, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export function DataTable<T>({
  data,
  columns,
  getRowId,
  isLoading = false,
  getSearchableText,
  searchPlaceholder = 'Search…',
  rowActions,
  onRowClick,
  pageSize = 10,
  emptyState,
  toolbarExtra,
  className,
}: DataTableProps<T>) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<{ columnId: string; direction: SortDirection } | null>(null);
  const [page, setPage] = useState(1);
  const [hiddenColumnIds, setHiddenColumnIds] = useState<Set<string>>(new Set());

  const visibleColumns = useMemo(
    () => columns.filter((column) => !hiddenColumnIds.has(column.id)),
    [columns, hiddenColumnIds],
  );

  const filteredData = useMemo(() => {
    if (!getSearchableText || !query.trim()) return data;
    const needle = query.trim().toLowerCase();
    return data.filter((row) => getSearchableText(row).toLowerCase().includes(needle));
  }, [data, getSearchableText, query]);

  const sortedData = useMemo(() => {
    if (!sort) return filteredData;
    const column = columns.find((entry) => entry.id === sort.columnId);
    if (!column?.sortValue) return filteredData;

    const sortValue = column.sortValue;
    const sign = sort.direction === 'asc' ? 1 : -1;

    return [...filteredData].sort((a, b) => {
      const valueA = sortValue(a);
      const valueB = sortValue(b);
      if (valueA < valueB) return -1 * sign;
      if (valueA > valueB) return 1 * sign;
      return 0;
    });
  }, [filteredData, sort, columns]);

  const pageCount = Math.max(1, Math.ceil(sortedData.length / pageSize));

  // Keep page in range whenever the filtered/sorted result set shrinks (new search, deleted rows, etc).
  useEffect(() => {
    setPage((current) => Math.min(current, pageCount));
  }, [pageCount]);

  // Jump back to page 1 on every new search — staying on page 4 of a 1-page result is confusing.
  useEffect(() => {
    setPage(1);
  }, [query]);

  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page, pageSize]);

  function handleSort(column: DataTableColumn<T>) {
    if (!column.sortValue) return;
    setSort((current) => {
      if (current?.columnId !== column.id) return { columnId: column.id, direction: 'asc' };
      if (current.direction === 'asc') return { columnId: column.id, direction: 'desc' };
      return null;
    });
  }

  const hideableColumns = columns.filter((column) => column.hideable !== false);
  const hasToolbar = Boolean(getSearchableText) || Boolean(toolbarExtra) || hideableColumns.length > 0;

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {hasToolbar && (
        <div className="flex flex-wrap items-center gap-2">
          {getSearchableText && (
            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder={searchPlaceholder}
              className="w-full sm:w-64"
            />
          )}

          {toolbarExtra}

          {hideableColumns.length > 0 && (
            <Popover
              align="end"
              panelClassName="w-52 p-1.5"
              className="ml-auto"
              trigger={({ toggle }) => (
                <button
                  type="button"
                  onClick={toggle}
                  className="inline-flex h-10 items-center gap-2 rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                >
                  <Columns3 size={15} className="text-muted-foreground" />
                  Columns
                </button>
              )}
            >
              {() => (
                <ul className="flex flex-col">
                  {hideableColumns.map((column) => (
                    <li key={column.id}>
                      <Checkbox
                        label={column.header}
                        checked={!hiddenColumnIds.has(column.id)}
                        onChange={() =>
                          setHiddenColumnIds((prev) => {
                            const next = new Set(prev);
                            if (next.has(column.id)) next.delete(column.id);
                            else next.add(column.id);
                            return next;
                          })
                        }
                        containerClassName="w-full rounded-md px-2 py-2 text-sm text-popover-foreground hover:bg-accent/60"
                      />
                    </li>
                  ))}
                </ul>
              )}
            </Popover>
          )}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              {visibleColumns.map((column) => {
                const isSorted = sort?.columnId === column.id;
                const align = column.align ?? 'left';

                return (
                  <th
                    key={column.id}
                    scope="col"
                    className={cn(
                      'whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground',
                      ALIGN_CLASSES[align],
                    )}
                  >
                    {column.sortValue ? (
                      <button
                        type="button"
                        onClick={() => handleSort(column)}
                        className={cn(
                          'inline-flex items-center gap-1 transition-colors hover:text-foreground',
                          align === 'right' && 'flex-row-reverse',
                        )}
                      >
                        {column.header}
                        {isSorted ? (
                          sort?.direction === 'asc' ? (
                            <ArrowUp size={12} />
                          ) : (
                            <ArrowDown size={12} />
                          )
                        ) : (
                          <ArrowUpDown size={12} className="opacity-40" />
                        )}
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                );
              })}
              {rowActions && <th scope="col" className="w-12 px-4 py-3" />}
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {isLoading ? (
              Array.from({ length: Math.min(pageSize, 5) }).map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {visibleColumns.map((column) => (
                    <td key={column.id} className="px-4 py-3.5">
                      <Skeleton className="h-4 w-full max-w-32" />
                    </td>
                  ))}
                  {rowActions && (
                    <td className="px-4 py-3.5">
                      <Skeleton className="h-4 w-4" />
                    </td>
                  )}
                </tr>
              ))
            ) : pageData.length === 0 ? (
              <tr>
                <td colSpan={visibleColumns.length + (rowActions ? 1 : 0)}>
                  <EmptyState
                    title={emptyState?.title ?? 'No results found'}
                    description={
                      emptyState?.description ??
                      (query ? 'Try a different search term.' : 'There is nothing to show yet.')
                    }
                  />
                </td>
              </tr>
            ) : (
              pageData.map((row) => {
                const rowId = getRowId(row);

                return (
                  <tr
                    key={rowId}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    className={cn(
                      'transition-colors',
                      onRowClick && 'cursor-pointer hover:bg-accent/40',
                    )}
                  >
                    {visibleColumns.map((column) => (
                      <td
                        key={column.id}
                        className={cn(
                          'px-4 py-3.5 text-foreground',
                          ALIGN_CLASSES[column.align ?? 'left'],
                          column.className,
                        )}
                      >
                        {column.cell(row)}
                      </td>
                    ))}
                    {rowActions && (
                      <td
                        className="px-4 py-3.5 text-right"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <ActionMenu items={rowActions(row)} />
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {!isLoading && sortedData.length > 0 && (
        <Pagination
          page={page}
          pageCount={pageCount}
          onPageChange={setPage}
          summary={`Showing ${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, sortedData.length)} of ${sortedData.length}`}
        />
      )}
    </div>
  );
}
