'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFAsyncCombobox } from '@/components/rhf';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import {
  useBulkUpdateMenuItemSubcategoryMutation,
  useDeleteMenuItemSubcategoryMutation,
  useGetMenuItemSubcategoriesQuery,
  useGetMenuItemSubcategoryItemsQuery,
} from '@/store/Reducer/menu-item-subcategories-api';
import { menuItemsApi } from '@/store/Reducer/menu-items-api';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { SubcategoryMenuItem, SubcategoryTransferFormValues, SubcategoryTransferModalProps } from './types';

const ITEM_PREVIEW_LIMIT = 100;
const TARGET_FETCH_LIMIT = 50;

// Exactly what RHFAsyncCombobox sends for its first page below. The view reuses this for its
// pre-delete check so both hit the same RTK Query cache entry instead of firing two requests.
export const TRANSFER_TARGET_QUERY_ARGS = (companyId?: string | null) => ({
  page: 0,
  limit: TARGET_FETCH_LIMIT,
  search: '',
  status: 'active',
  companyOrganizer: companyId || undefined,
});

const defaultValues: SubcategoryTransferFormValues = {
  targetSubCategory: '',
};

const schema = Yup.object().shape({
  targetSubCategory: Yup.string().required('Select a subcategory to move these items to'),
});

const SubcategoryTransferModal = ({ open, onClose, subcategory, companyId, userType, onTransferred }: SubcategoryTransferModalProps) => {
  const dispatch = useDispatch();
  const [bulkUpdateSubcategory, { isLoading: transferLoading }] = useBulkUpdateMenuItemSubcategoryMutation();
  const [deleteSubcategory, { isLoading: deleteLoading }] = useDeleteMenuItemSubcategoryMutation();
  const submitting = transferLoading || deleteLoading;

  const methods = useForm<SubcategoryTransferFormValues>({
    resolver: yupResolver(schema as Yup.ObjectSchema<SubcategoryTransferFormValues>),
    defaultValues,
  });

  const { reset } = methods;

  useEffect(() => {
    if (open) reset(defaultValues);
  }, [open, reset]);

  const { data: itemsData, isFetching: itemsLoading } = useGetMenuItemSubcategoryItemsQuery(
    { subCategory: subcategory?._id, page: 0, limit: ITEM_PREVIEW_LIMIT },
    { skip: !open || !subcategory?._id }
  );

  const menuItems: SubcategoryMenuItem[] = itemsData?.data || [];
  const totalItems = itemsData?.meta?.totalRecords ?? menuItems.length;
  const notShown = totalItems - menuItems.length;

  const handleSubmit = async (formData: SubcategoryTransferFormValues) => {
    if (!subcategory?._id) return;

    try {
      await bulkUpdateSubcategory({ oldSubCategory: subcategory._id, newSubCategory: formData.targetSubCategory }).unwrap();
      await deleteSubcategory(subcategory._id).unwrap();
      dispatch(menuItemsApi.util.invalidateTags(['menu-item']));
      showSuccess(`${totalItems} ${totalItems === 1 ? 'menu item' : 'menu items'} moved and subcategory deleted`);
      reset(defaultValues);
      onTransferred?.();
      onClose();
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  const handleClose = () => {
    if (submitting) return;
    reset(defaultValues);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0">
        <DialogContent
          aria-describedby={undefined}
          className="dark:bg-secondary mx-auto flex max-h-[90vh] w-full flex-col items-center overflow-y-auto md:max-w-[550px]!"
        >
          <DialogHeader>
            <DialogTitle className="text-left">Move menu items before deleting</DialogTitle>
          </DialogHeader>

          <div className="mt-2 w-full">
            <p className="text-muted-foreground text-sm leading-relaxed">
              <span className="text-foreground font-medium">{subcategory?.title}</span> still has{' '}
              <span className="text-foreground font-medium">{totalItems}</span> {totalItems === 1 ? 'menu item' : 'menu items'}. Choose another
              subcategory to move them to. The items are kept and this subcategory is deleted.
            </p>

            <div className="mt-4 overflow-hidden rounded-lg border">
              <div className="bg-muted/50 text-muted-foreground flex items-center justify-between border-b px-3 py-2 text-xs font-medium">
                <span>Menu items to move</span>
                <span>
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </span>
              </div>

              <div className="max-h-52 overflow-y-auto">
                {itemsLoading ? (
                  <div className="text-muted-foreground flex items-center justify-center gap-2 py-6 text-sm">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading...
                  </div>
                ) : menuItems.length === 0 ? (
                  <p className="text-muted-foreground px-3 py-6 text-center text-sm">No menu items found.</p>
                ) : (
                  menuItems.map((menuItem) => (
                    <div key={menuItem._id} className="flex items-center justify-between gap-3 border-b px-3 py-2 last:border-b-0">
                      <span className="truncate text-sm">{menuItem.title}</span>
                      {menuItem.status ? <span className="text-muted-foreground shrink-0 text-xs capitalize">{menuItem.status}</span> : null}
                    </div>
                  ))
                )}
              </div>

              {notShown > 0 && (
                <div className="text-muted-foreground bg-muted/50 border-t px-3 py-2 text-xs">
                  and {notShown} more. All {totalItems} will be moved.
                </div>
              )}
            </div>

            <div className="mt-5">
              <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
                <RHFAsyncCombobox
                  name="targetSubCategory"
                  label="Move items to"
                  placeholder="Select subcategory..."
                  searchPlaceholder="Search subcategories..."
                  useOptionsQuery={useGetMenuItemSubcategoriesQuery}
                  limit={TARGET_FETCH_LIMIT}
                  queryArgs={{
                    companyOrganizer: companyId || undefined,
                    status: 'active',
                  }}
                  skip={userType === 'super-admin' && !companyId}
                  filterOption={(option) => option._id !== subcategory?._id}
                  getOptionValue={(option) => option._id}
                  getOptionLabel={(option) => option.title}
                />

                <div className="mt-6 flex w-full items-center justify-end gap-2">
                  <Button type="button" variant="outline" onClick={handleClose} disabled={submitting} className="cursor-pointer px-4 py-2">
                    Cancel
                  </Button>

                  {submitting ? (
                    <Button type="button" disabled className="bg-primary hover:bg-primary cursor-not-allowed px-4 py-2 text-white">
                      <ButtonLoading title={transferLoading ? 'Moving' : 'Deleting'} />
                    </Button>
                  ) : (
                    <Button type="submit" className="bg-primary hover:bg-primary-dark cursor-pointer px-4 py-2 text-white">
                      Move & Delete
                    </Button>
                  )}
                </div>
              </FormProvider>
            </div>
          </div>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default SubcategoryTransferModal;
