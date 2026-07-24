import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';

interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  /** Optional "Showing X–Y of Z" summary rendered on the left. */
  summary?: string;
  className?: string;
}

const SIBLING_COUNT = 1;

/** Builds the visible page-number sequence, collapsing runs into a single -1 "ellipsis" marker. */
function buildPageSequence(page: number, pageCount: number): number[] {
  const pages = new Set<number>([1, pageCount]);
  for (let offset = -SIBLING_COUNT; offset <= SIBLING_COUNT; offset += 1) {
    const candidate = page + offset;
    if (candidate > 1 && candidate < pageCount) pages.add(candidate);
  }

  const sorted = Array.from(pages).sort((a, b) => a - b);
  const withEllipsis: number[] = [];
  sorted.forEach((value, index) => {
    if (index > 0 && value - sorted[index - 1] > 1) withEllipsis.push(-1);
    withEllipsis.push(value);
  });
  return withEllipsis;
}

/** Client-side pagination control. `pageCount` of 0 or 1 renders nothing but the summary. */
export function Pagination({ page, pageCount, onPageChange, summary, className }: PaginationProps) {
  const sequence = pageCount > 1 ? buildPageSequence(page, pageCount) : [];

  return (
    <div className={cn('flex flex-wrap items-center justify-between gap-3', className)}>
      {summary && <p className="text-xs text-muted-foreground">{summary}</p>}

      {pageCount > 1 && (
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronLeft size={16} />
          </button>

          {sequence.map((entry, index) =>
            entry === -1 ? (
              <span
                key={`ellipsis-${index}`}
                className="flex h-8 w-8 items-center justify-center text-sm text-muted-foreground"
              >
                …
              </span>
            ) : (
              <button
                key={entry}
                type="button"
                onClick={() => onPageChange(entry)}
                aria-current={entry === page ? 'page' : undefined}
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-colors',
                  entry === page
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-accent',
                )}
              >
                {entry}
              </button>
            ),
          )}

          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= pageCount}
            aria-label="Next page"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
