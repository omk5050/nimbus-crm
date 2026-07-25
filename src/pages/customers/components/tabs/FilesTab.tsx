import { File, FileSpreadsheet, FileText, Folder, Image, Upload } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card } from '@/components/cards/Card';
import { Button } from '@/components/buttons/Button';
import { EmptyState } from '@/components/common/EmptyState';
import type { CustomerFileType } from '@/types/customer.types';
import { useCustomersStore } from '@/store/customers.store';
import { toast } from '@/store/toast.store';
import { formatDate } from '@/utils/format';

interface FilesTabProps {
  customerId: string;
}

const FILE_ICON: Record<CustomerFileType, LucideIcon> = {
  pdf: FileText,
  doc: FileText,
  sheet: FileSpreadsheet,
  image: Image,
  other: File,
};

export function FilesTab({ customerId }: FilesTabProps) {
  const files = useCustomersStore((state) => state.filesByCustomerId[customerId] ?? []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button
          variant="secondary"
          onClick={() =>
            toast.info('Uploads coming soon', {
              description: 'File storage connects once a backend is wired up.',
            })
          }
        >
          <Upload size={15} />
          Upload file
        </Button>
      </div>

      {files.length === 0 ? (
        <EmptyState icon={Folder} title="No files yet" />
      ) : (
        <Card noPadding>
          <ul className="divide-y divide-border">
            {files.map((file) => {
              const Icon = (file.fileType && FILE_ICON[file.fileType as CustomerFileType]) || File;
              return (
                <li key={file.id} className="flex items-center gap-3 px-5 py-3.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
                    <Icon size={16} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-card-foreground">{file.fileName}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {file.sizeLabel} · Uploaded by {file.uploadedBy} on {formatDate(file.createdAt)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      )}
    </div>
  );
}
