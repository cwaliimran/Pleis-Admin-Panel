'use client';

import ButtonLoading from '@/components/common/button-loading';
import { Button } from '@/components/ui/button';
import CustomBadge from '@/components/ui/custom-badge';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { AlertTriangle } from 'lucide-react';
import { DeleteImpactModalProps, DeleteImpactReference, DeleteImpactReferenceTree } from './types';

const GROUP_LABELS: Record<string, string> = {
  combos: 'Combos',
  discounts: 'Discounts',
  sales: 'Sales',
  'challenges.buyMenuItemTask': 'Challenges · Buy item task',
  'challenges.menuItemReward': 'Challenges · Item reward',
  'promotions.buyMenuItemPromotion': 'Promotions · Buy item',
  'promotions.productSale': 'Promotions · Product sale',
  'promotions.extraPointsForItem': 'Promotions · Extra points',
  'rewards.buyMenuItemReward': 'Rewards · Buy item',
};

const humanizeKey = (path: string) => {
  const key = path.split('.').pop() || path;
  const spaced = key.replace(/([A-Z])/g, ' $1').trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
};

type ReferenceGroup = { key: string; label: string; items: DeleteImpactReference[] };

const flattenReferences = (references?: DeleteImpactReferenceTree): ReferenceGroup[] => {
  const groups: ReferenceGroup[] = [];

  const visit = (value: unknown, path: string) => {
    if (!value) return;

    if (Array.isArray(value)) {
      const items = value.filter((item): item is DeleteImpactReference => !!item && typeof item === 'object');
      if (items.length > 0) groups.push({ key: path, label: GROUP_LABELS[path] || humanizeKey(path), items });
      return;
    }

    if (typeof value === 'object') {
      Object.entries(value as Record<string, unknown>).forEach(([key, child]) => visit(child, path ? `${path}.${key}` : key));
    }
  };

  visit(references, '');
  return groups;
};

const MenuItemDeleteImpactModal = ({ open, onClose, impact, isDeleting, onConfirm }: DeleteImpactModalProps) => {
  const groups = flattenReferences(impact?.references);
  const listedCount = groups.reduce((total, group) => total + group.items.length, 0);
  const totalReferences = impact?.totalReferences ?? listedCount;
  const notListed = totalReferences - listedCount;

  return (
    <Dialog open={open} onOpenChange={isDeleting ? undefined : onClose}>
      <DialogOverlay className="fixed inset-0 flex items-center justify-center">
        <DialogContent aria-describedby={undefined} className="dark:bg-secondary flex max-h-[85vh] w-full flex-col overflow-hidden md:max-w-lg!">
          <DialogHeader>
            <DialogTitle className="text-left text-lg font-semibold">Delete Menu Item</DialogTitle>
          </DialogHeader>

          <div className="flex min-h-0 flex-col">
            <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950/40">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <p className="text-sm leading-relaxed text-amber-900 dark:text-amber-100">
                <span className="font-medium">{impact?.menuItem?.title}</span> is currently used in{' '}
                <span className="font-medium">{totalReferences}</span> {totalReferences === 1 ? 'place' : 'places'}. Deleting it will also remove
                it from everything listed below.
              </p>
            </div>

            <div className="mt-4 min-h-0 flex-1 overflow-y-auto rounded-lg border">
              {groups.length === 0 ? (
                <p className="text-muted-foreground px-3 py-6 text-center text-sm">No references found.</p>
              ) : (
                groups.map((group) => (
                  <div key={group.key} className="border-b last:border-b-0">
                    <div className="bg-muted/50 text-muted-foreground flex items-center justify-between border-b px-3 py-2 text-xs font-medium">
                      <span>{group.label}</span>
                      <span>
                        {group.items.length} {group.items.length === 1 ? 'item' : 'items'}
                      </span>
                    </div>

                    {group.items.map((item) => (
                      <div key={item._id} className="flex items-center justify-between gap-3 border-b px-3 py-2 last:border-b-0">
                        <span className="truncate text-sm">{item.title || '-'}</span>
                        {item.status ? (
                          <CustomBadge variant={item.status === 'active' ? 'success' : 'error'} className="shrink-0 text-[11px] capitalize">
                            {item.status}
                          </CustomBadge>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>

            {notListed > 0 && <p className="text-muted-foreground mt-2 text-xs">and {notListed} more not listed here.</p>}

            <p className="text-muted-foreground mt-4 text-sm">This action cannot be undone. Are you sure you want to delete this menu item?</p>
          </div>

          <div className="mt-2 flex justify-end space-x-2">
            <Button variant="outline" className="cursor-pointer" onClick={onClose} disabled={isDeleting}>
              Cancel
            </Button>

            {isDeleting ? (
              <Button type="button" disabled className="cursor-not-allowed bg-[#E7000B] hover:bg-[#E7000B]/80">
                <ButtonLoading title="Deleting" />
              </Button>
            ) : (
              <Button className="cursor-pointer bg-[#E7000B] hover:bg-[#E7000B]/80" onClick={onConfirm}>
                Delete Anyway
              </Button>
            )}
          </div>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default MenuItemDeleteImpactModal;
