import { cn } from '@/lib/utils';

interface Props {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function LoadingSpinner({ className, size = 'md' }: Props) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' };
  return (
    <div
      className={cn(
        'border-2 border-stadium-400 border-t-wc-blue-light rounded-full animate-spin',
        sizes[size],
        className
      )}
    />
  );
}

export function LoadingSection({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <LoadingSpinner size="lg" />
      <p className="text-sm text-stadium-100">{label}</p>
    </div>
  );
}
