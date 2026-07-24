import { Loader2 } from 'lucide-react';

export function PageLoader() {
  return (
    <div className="flex h-dvh w-full items-center justify-center bg-background">
      <Loader2 size={28} className="animate-spin text-primary" />
    </div>
  );
}
