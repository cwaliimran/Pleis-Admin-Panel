import { Badge } from '@/components/ui/badge';
import { useBoolean } from '@/hooks/useBoolean';
import { cn } from '@/lib/utils';

const COLLAPSED_BADGE_COUNT = 5;

export const BADGE_CLASSES =
  'rounded-full border border-slate-200 bg-slate-100 px-3 py-0.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white';

interface BadgeListProps {
  items?: any[];
  capitalize?: boolean;
}

const BadgeList = ({ items, capitalize = false }: BadgeListProps) => {
  const expanded = useBoolean();

  if (!items || items.length === 0) return null;

  const visibleItems = expanded.value ? items : items.slice(0, COLLAPSED_BADGE_COUNT);
  const hiddenCount = items.length - visibleItems.length;

  return (
    <div className="mt-2 flex flex-wrap items-center gap-1.5">
      {visibleItems.map((item: any, index: number) => (
        <Badge key={item?._id || item?.id || index} className={cn(BADGE_CLASSES, capitalize && 'capitalize')}>
          {item?.title}
        </Badge>
      ))}

      {(hiddenCount > 0 || expanded.value) && (
        <button
          type="button"
          onClick={expanded.onToggle}
          className="cursor-pointer rounded-full px-2 py-0.5 text-sm font-medium text-slate-500 underline-offset-2 transition-colors hover:text-slate-700 hover:underline dark:text-slate-400 dark:hover:text-slate-200"
        >
          {hiddenCount > 0 ? `+${hiddenCount} more` : 'Show less'}
        </button>
      )}
    </div>
  );
};

export default BadgeList;
